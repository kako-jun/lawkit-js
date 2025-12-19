# lawkit-js

Node.js/npm向けのlawkitバインディング。Rustのlawkit-coreをnapi-rsでラップ。

## アーキテクチャ

```
lawkit-core (crates.io 2.5)   ←  Rustネイティブライブラリ
      ↓
lawkit-js (this)              ←  napi-rsでNode.jsバインディング
      ↓
npm package                   ←  プラットフォーム別.nodeファイルを配布
```

## 構造

```
lawkit-js/
├── src/lib.rs          # napi-rsバインディング実装
├── build.rs            # napi-rsビルドスクリプト
├── Cargo.toml          # lawkit-core依存（crates.io版）
├── package.json        # npm設定 + jest設定
├── index.js            # プラットフォーム検出ローダー
├── tests/              # Jestテスト
│   └── law.test.js
├── .husky/pre-commit   # cargo fmt実行
└── .github/workflows/
    ├── ci.yml          # push/PR → fmt + clippy + build + test
    └── release.yml     # タグ → 6プラットフォームビルド + Release作成
```

## ビルド

```bash
npm install           # 依存インストール
npm run build         # napi build --platform --release
npm test              # jest実行
cargo fmt --check     # フォーマットチェック
cargo clippy          # lint
```

## GitHub Actions

| ワークフロー | トリガー | 動作 |
|-------------|---------|------|
| ci.yml | push/PR to main | fmt + clippy + Linux x64ビルド + テスト |
| release.yml | タグ v* | 6プラットフォームビルド + GitHub Release作成 |

### ビルドターゲット（release.yml）

- x86_64-unknown-linux-gnu
- x86_64-unknown-linux-musl
- aarch64-unknown-linux-gnu
- x86_64-apple-darwin
- aarch64-apple-darwin
- x86_64-pc-windows-msvc

## リリース手順

1. `package.json`と`Cargo.toml`のバージョンを更新
2. コミット & プッシュ
3. `git tag v2.5.16 && git push origin v2.5.16`
4. GitHub Actionsがビルド → Release作成 → バイナリ添付
5. Releaseからバイナリをダウンロード
6. `npm publish --access public`（手動）

## API

### law(subcommand, data, options?)
統計法則分析を実行。

サブコマンド:
- `benford` - ベンフォードの法則分析
- `pareto` - パレート分析
- `zipf` - ジップの法則分析
- `normal` - 正規分布分析
- `poisson` - ポアソン分布分析
- `validate` - データ検証

オプション:
- `confidenceLevel` - 信頼水準
- `riskThreshold` - リスク閾値 ("low", "medium", "high")

## 開発ルール

- lawkit-coreはcrates.ioの公開版を使用（ローカルパス依存禁止）
- コミット前にcargo fmtが自動実行される（husky）
