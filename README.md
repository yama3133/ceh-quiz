# CEH Quiz

CEH（Certified Ethical Hacker）試験対策の問題集アプリケーションです。情報セキュリティエキスパート向けの倫理的ハッキング認定資格試験の勉強をサポートします。

## 機能

- **複数ドメイン対応**: 情報セキュリティ概要、偵察手法、システムハッキング、ネットワークスキャンなど、CEH試験の主要トピックをカバー
- **対話的学習**: 各問題に詳細な解説を付属し、試験合格に必要な知識を深める
- **進捗追跡**: 学習進捗をトラッキングし、弱点分野を把握可能
- **レスポンシブデザイン**: スマートフォン、タブレット、デスクトップで利用可能

## 技術スタック

- **フレームワーク**: React 19.2.5
- **ビルドツール**: Vite 8.0.10
- **言語**: JavaScript (JSX)
- **スタイル**: CSS

## インストール

```bash
npm install
```

## 開発環境の起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 にアクセスしてください。

## ビルド

```bash
npm run build
```

## プレビュー

```bash
npm run preview
```

## ファイル構成

```
src/
├── App.jsx          # メインコンポーネント
├── main.jsx         # エントリーポイント
├── questions.js     # 問題データベース
└── index.css        # スタイルシート
```

## 主要なドメイン

- Information Security and Ethical Hacking Overview
- Reconnaissance Techniques
- System Hacking Phases and Attack Techniques
- ネットワークセキュリティ
- 暗号化技術
- セキュリティツールと対策

## 使い方

1. アプリを起動するとメニューが表示されます
2. ドメインを選択して学習を開始
3. 各問題に回答し、解説で知識を深める
4. 進捗を確認しながら全ドメインを学習

## 対象試験

CEH試験（Certified Ethical Hacker）の合格を目指す方向けです。

## ライセンス

MIT

## 作成者

[@yama3133](https://github.com/yama3133)
