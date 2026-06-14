# OKINAWANSUP 公式ホームページ

## セットアップ手順

### 1. 依存パッケージをインストール

```bash
npm install
```

### 2. 開発サーバーを起動

```bash
npm run dev
```

ブラウザで http://localhost:3000 を開くと確認できます。

### 3. 本番用ビルド

```bash
npm run build
npm start
```

---

## フォルダ構成

```
├── app/
│   ├── layout.tsx       # ルートレイアウト（フォント・メタ情報）
│   ├── page.tsx         # トップページ
│   └── globals.css      # グローバルCSS
├── components/
│   ├── Header.tsx       # ナビゲーションバー（スティッキー・ハンバーガー対応）
│   ├── Hero.tsx         # ファーストビュー（全画面）
│   ├── Concept.tsx      # 当社のこだわり（3カード）
│   ├── Locations.tsx    # 開催エリア（恩納村・名護市・金武町）
│   ├── Reviews.tsx      # お客様の声
│   ├── Social.tsx       # LINE誘導バナー＋Instagramグリッド
│   └── Footer.tsx       # フッター
└── package.json
```

## 実際の画像への置き換え方法

各コンポーネントのプレースホルダー部分（グラデーション背景）を
`<Image>` コンポーネントに置き換えてください。

```tsx
import Image from "next/image";

// 例
<Image src="/images/hero.jpg" alt="..." fill className="object-cover" />
```
