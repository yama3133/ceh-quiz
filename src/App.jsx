import { useState, useCallback } from 'react';
import { questions, CATEGORIES } from './questions.js';

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function buildExam() {
  const total = 125;
  const alloc = CATEGORIES.map((c) => {
    const exact = (c.count / 200) * total;
    return { name: c.name, exact, floor: Math.floor(exact), rem: exact - Math.floor(exact) };
  });
  const floorsSum = alloc.reduce((s, a) => s + a.floor, 0);
  const need = total - floorsSum;
  alloc.sort((a, b) => b.rem - a.rem);
  for (let i = 0; i < need; i++) alloc[i].floor++;
  const result = [];
  for (const a of alloc) {
    const catQs = questions.filter((q) => q.category === a.name);
    result.push(...shuffle(catQs).slice(0, a.floor));
  }
  return shuffle(result);
}

// ── Icons ──────────────────────────────────────────────
function IconArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}
function IconChevronDown() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="6 9 12 15 18 9" />
    </svg>
  );
}
function IconBack() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}
function IconX() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

// ── Ambient background ─────────────────────────────────
function Ambient() {
  return (
    <div className="ambient">
      <div className="ambient-orb ambient-orb-1" />
      <div className="ambient-orb ambient-orb-2" />
      <div className="ambient-orb ambient-orb-3" />
      <div className="ambient-grid" />
    </div>
  );
}

// ── Mode button (title screen) ─────────────────────────
function ModeButton({ icon, title, sub, badge, isAccordion, isOpen, onClick, delay }) {
  return (
    <button
      className={`mode-btn slide-up${delay ? ` slide-up-d${delay}` : ''}${isOpen ? ' is-open' : ''}`}
      onClick={onClick}
    >
      <div className="mode-btn-icon">{icon}</div>
      <div className="mode-btn-title">{title}</div>
      <div className="mode-btn-sub">{sub}</div>
      <div className="mode-btn-footer">
        <span className="badge">{badge}</span>
        <span className="mode-btn-chevron">
          {isAccordion ? <IconChevronDown /> : <IconArrowRight />}
        </span>
      </div>
    </button>
  );
}

// ── Title Screen ───────────────────────────────────────
function TitleScreen({ onStart }) {
  const [catOpen, setCatOpen] = useState(false);

  return (
    <div className="screen fade-in">
      <Ambient />
      <div className="content-wrap">
        <div className="title-header">
          <div className="chip">
            <span className="chip-dot" />
            CEH PRACTICE
          </div>
          <h1>CEH<br />練習問題集</h1>
          <p>Certified Ethical Hacker — オリジナル200問</p>
        </div>

        <div className="stats-row slide-up">
          <div className="stat-item">
            <span className="stat-value">200</span>
            <span className="stat-label">問題数</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">9</span>
            <span className="stat-label">ドメイン</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">125</span>
            <span className="stat-label">模擬試験</span>
          </div>
        </div>

        <div className="mode-grid">
          <ModeButton
            icon="📋"
            title="全問順番"
            sub="Q001 → Q200 順番に解く"
            badge="200問"
            delay={1}
            onClick={() => onStart('ordered', null)}
          />
          <ModeButton
            icon="🔀"
            title="ランダム"
            sub="全200問をシャッフル"
            badge="200問"
            delay={2}
            onClick={() => onStart('random', null)}
          />
          <ModeButton
            icon="📂"
            title="カテゴリー別"
            sub="ドメインを選んで学習"
            badge={`${CATEGORIES.length}ドメイン`}
            isAccordion
            isOpen={catOpen}
            delay={3}
            onClick={() => setCatOpen((v) => !v)}
          />
          <ModeButton
            icon="📝"
            title="模擬試験"
            sub="本番と同じ配分で出題"
            badge="125問"
            delay={4}
            onClick={() => onStart('exam', null)}
          />
        </div>

        {catOpen && (
          <div className="category-list slide-up">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.name}
                className="cat-item"
                onClick={() => onStart('category', cat.name)}
              >
                <span className="cat-dot" />
                <span className="cat-name">{cat.name}</span>
                <span className="cat-count">{cat.count}問</span>
                <span className="cat-arrow"><IconArrowRight /></span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Quiz Screen ────────────────────────────────────────
function QuizScreen({ quizSet, mode, categoryName, onFinish, onBack }) {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);

  const q = quizSet[idx];
  const total = quizSet.length;
  const progress = ((idx) / total) * 100;
  const letters = ['A', 'B', 'C', 'D'];

  const modeLabel = {
    ordered: '全問順番',
    random: 'ランダム',
    category: categoryName || 'カテゴリー',
    exam: '模擬試験',
  }[mode];

  function handleSelect(i) {
    if (submitted) return;
    setSelected(i);
  }

  function handleSubmit() {
    if (selected === null) return;
    const correct = selected === q.answer;
    if (correct) setScore((s) => s + 1);
    setAnswered((a) => a + 1);
    setSubmitted(true);
  }

  function handleNext() {
    if (idx + 1 >= total) {
      onFinish(score, total);
    } else {
      setIdx((i) => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  }

  function optionClass(i) {
    if (!submitted) {
      return i === selected ? 'option-btn selected' : 'option-btn';
    }
    if (i === q.answer) return 'option-btn correct';
    if (i === selected && i !== q.answer) return 'option-btn wrong';
    return 'option-btn muted';
  }

  function markerContent(i) {
    if (!submitted) return letters[i];
    if (i === q.answer) return <IconCheck />;
    if (i === selected && i !== q.answer) return <IconX />;
    return letters[i];
  }

  return (
    <div className="quiz-screen">
      <div className="quiz-header">
        <div className="quiz-header-inner">
          <div className="quiz-header-top">
            <button className="back-btn" onClick={onBack}>
              <IconBack /> 戻る
            </button>
            <span className="mode-badge">{modeLabel}</span>
            <div className="quiz-counter">
              <span className="quiz-counter-cur">{String(idx + 1).padStart(3, '0')}</span>
              <span className="quiz-counter-sep"> / </span>
              <span className="quiz-counter-tot">{total}</span>
            </div>
            <div className="score-badge">
              <span className="score-val">{score}</span>
              <span style={{ color: 'var(--text-faint)' }}>/</span>
              <span>{answered}</span>
            </div>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <div className="quiz-body fade-in">
        <div className="question-card">
          <div className="question-meta">
            <span className="question-num">Q{String(q.id).padStart(3, '0')}</span>
            <span className="question-cat">{q.category}</span>
          </div>
          <p className="question-text">{q.question}</p>
        </div>

        <div className="options-list">
          {q.options.map((opt, i) => (
            <button
              key={i}
              className={optionClass(i)}
              onClick={() => (submitted ? null : handleSelect(i))}
              disabled={submitted}
            >
              <span className="option-marker">{markerContent(i)}</span>
              <span className="option-text">{opt}</span>
            </button>
          ))}
        </div>

        {submitted && (
          <div className="explain-panel">
            <div className="explain-header">
              <span className="explain-icon">i</span>
              <span className="explain-label">解説</span>
            </div>
            <p className="explain-text">{q.explanation}</p>
          </div>
        )}

        {!submitted && (
          <button
            className="next-btn"
            onClick={handleSubmit}
            disabled={selected === null}
            style={{ opacity: selected === null ? .5 : 1 }}
          >
            答え合わせ <IconArrowRight />
          </button>
        )}
        {submitted && (
          <button className="next-btn" onClick={handleNext}>
            {idx + 1 >= total ? '結果を見る' : '次の問題'} <IconArrowRight />
          </button>
        )}
      </div>
    </div>
  );
}

// ── Result Screen ──────────────────────────────────────
function ResultScreen({ score, total, mode, categoryName, onBack }) {
  const pct = Math.round((score / total) * 100);
  const great = pct >= 70;

  const modeLabel = {
    ordered: '全問順番',
    random: 'ランダム',
    category: categoryName || 'カテゴリー',
    exam: '模擬試験',
  }[mode];

  return (
    <div className="screen fade-in">
      <Ambient />
      <div className="result-content">
        <div className="result-card slide-up">
          <div className="result-chip">
            <div className="chip">
              <span className="chip-dot" />
              {great ? 'GREAT WORK!' : 'KEEP GOING'}
            </div>
          </div>

          <div className="result-score-wrap">
            <div className="result-score">{score} <span style={{ fontSize: '55%', opacity: .5, fontWeight: 700 }}>/ {total}</span></div>
          </div>
          <div className="result-score-label">{modeLabel} — 終了</div>

          <div className="result-accuracy">{pct}% 正答率</div>
          <div className="result-bar-wrap">
            <div className="result-bar-fill" style={{ width: `${pct}%` }} />
          </div>

          <button className="result-back-btn" onClick={onBack}>
            <IconBack /> タイトルに戻る
          </button>
        </div>
      </div>
    </div>
  );
}

// ── App root ───────────────────────────────────────────
export default function App() {
  const [screen, setScreen] = useState('title');
  const [mode, setMode] = useState(null);
  const [categoryName, setCategoryName] = useState(null);
  const [quizSet, setQuizSet] = useState([]);
  const [resultScore, setResultScore] = useState(0);
  const [resultTotal, setResultTotal] = useState(0);

  const handleStart = useCallback((m, cat) => {
    let qs;
    if (m === 'ordered') qs = [...questions];
    else if (m === 'random') qs = shuffle(questions);
    else if (m === 'category') qs = questions.filter((q) => q.category === cat);
    else qs = buildExam();

    setMode(m);
    setCategoryName(cat);
    setQuizSet(qs);
    setScreen('quiz');
  }, []);

  const handleFinish = useCallback((score, total) => {
    setResultScore(score);
    setResultTotal(total);
    setScreen('result');
  }, []);

  const handleBack = useCallback(() => {
    setScreen('title');
  }, []);

  if (screen === 'title') return <TitleScreen onStart={handleStart} />;
  if (screen === 'quiz') return (
    <QuizScreen
      quizSet={quizSet}
      mode={mode}
      categoryName={categoryName}
      onFinish={handleFinish}
      onBack={handleBack}
    />
  );
  if (screen === 'result') return (
    <ResultScreen
      score={resultScore}
      total={resultTotal}
      mode={mode}
      categoryName={categoryName}
      onBack={handleBack}
    />
  );
}
