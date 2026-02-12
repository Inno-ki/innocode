<p align="center">
  <a href="https://innocode.io">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="InnoCode logo">
    </picture>
  </a>
</p>
<p align="center">オープンソースのAIコーディングエージェント。</p>
<p align="center">
  <a href="https://innocode.io/discord"><img alt="Discord" src="https://img.shields.io/discord/1391832426048651334?style=flat-square&label=discord" /></a>
  <a href="https://www.npmjs.com/package/innocode-ai"><img alt="npm" src="https://img.shields.io/npm/v/innocode-ai?style=flat-square" /></a>
  <a href="https://github.com/anomalyco/innocode/actions/workflows/publish.yml"><img alt="Build status" src="https://img.shields.io/github/actions/workflow/status/anomalyco/innocode/publish.yml?style=flat-square&branch=dev" /></a>
</p>

<p align="center">
  <a href="README.md">English</a> |
  <a href="README.zh.md">简体中文</a> |
  <a href="README.zht.md">繁體中文</a> |
  <a href="README.ko.md">한국어</a> |
  <a href="README.de.md">Deutsch</a> |
  <a href="README.es.md">Español</a> |
  <a href="README.fr.md">Français</a> |
  <a href="README.it.md">Italiano</a> |
  <a href="README.da.md">Dansk</a> |
  <a href="README.ja.md">日本語</a> |
  <a href="README.pl.md">Polski</a> |
  <a href="README.ru.md">Русский</a> |
  <a href="README.ar.md">العربية</a> |
  <a href="README.no.md">Norsk</a> |
  <a href="README.br.md">Português (Brasil)</a> |
  <a href="README.th.md">ไทย</a> |
  <a href="README.tr.md">Türkçe</a>
</p>

[![InnoCode Terminal UI](packages/web/src/assets/lander/screenshot.png)](https://innocode.io)

---

### インストール

```bash
# YOLO
curl -fsSL https://innocode.io/install | bash

# パッケージマネージャー
npm i -g innocode-ai@latest        # bun/pnpm/yarn でもOK
scoop install innocode             # Windows
choco install innocode             # Windows
brew install anomalyco/tap/innocode # macOS と Linux（推奨。常に最新）
brew install innocode              # macOS と Linux（公式 brew formula。更新頻度は低め）
paru -S innocode-bin               # Arch Linux
mise use -g innocode               # どのOSでも
nix run nixpkgs#innocode           # または github:anomalyco/innocode で最新 dev ブランチ
```

> [!TIP]
> インストール前に 0.1.x より古いバージョンを削除してください。

### デスクトップアプリ (BETA)

InnoCode はデスクトップアプリとしても利用できます。[releases page](https://github.com/anomalyco/innocode/releases) から直接ダウンロードするか、[innocode.io/download](https://innocode.io/download) を利用してください。

| プラットフォーム      | ダウンロード                          |
| --------------------- | ------------------------------------- |
| macOS (Apple Silicon) | `innocode-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `innocode-desktop-darwin-x64.dmg`     |
| Windows               | `innocode-desktop-windows-x64.exe`    |
| Linux                 | `.deb`、`.rpm`、または AppImage       |

```bash
# macOS (Homebrew)
brew install --cask innocode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/innocode-desktop
```

#### インストールディレクトリ

インストールスクリプトは、インストール先パスを次の優先順位で決定します。

1. `$INNOCODE_INSTALL_DIR` - カスタムのインストールディレクトリ
2. `$XDG_BIN_DIR` - XDG Base Directory Specification に準拠したパス
3. `$HOME/bin` - 標準のユーザー用バイナリディレクトリ（存在する場合、または作成できる場合）
4. `$HOME/.innocode/bin` - デフォルトのフォールバック

```bash
# 例
INNOCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://innocode.io/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://innocode.io/install | bash
```

### Agents

InnoCode には組み込みの Agent が2つあり、`Tab` キーで切り替えられます。

- **build** - デフォルト。開発向けのフルアクセス Agent
- **plan** - 分析とコード探索向けの読み取り専用 Agent
  - デフォルトでファイル編集を拒否
  - bash コマンド実行前に確認
  - 未知のコードベース探索や変更計画に最適

また、複雑な検索やマルチステップのタスク向けに **general** サブ Agent も含まれています。
内部的に使用されており、メッセージで `@general` と入力して呼び出せます。

[agents](https://innocode.io/docs/agents) の詳細はこちら。

### ドキュメント

InnoCode の設定については [**ドキュメント**](https://innocode.io/docs) を参照してください。

### コントリビュート

InnoCode に貢献したい場合は、Pull Request を送る前に [contributing docs](./CONTRIBUTING.md) を読んでください。

### InnoCode の上に構築する

InnoCode に関連するプロジェクトで、名前に "innocode"（例: "innocode-dashboard" や "innocode-mobile"）を含める場合は、そのプロジェクトが InnoCode チームによって作られたものではなく、いかなる形でも関係がないことを README に明記してください。

### FAQ

#### Claude Code との違いは？

機能面では Claude Code と非常に似ています。主な違いは次のとおりです。

- 100% オープンソース
- 特定のプロバイダーに依存しません。[InnoCode Zen](https://innocode.io/zen) で提供しているモデルを推奨しますが、InnoCode は Claude、OpenAI、Google、またはローカルモデルでも利用できます。モデルが進化すると差は縮まり価格も下がるため、provider-agnostic であることが重要です。
- そのまま使える LSP サポート
- TUI にフォーカス。InnoCode は neovim ユーザーと [terminal.shop](https://terminal.shop) の制作者によって作られており、ターミナルで可能なことの限界を押し広げます。
- クライアント/サーバー構成。例えば InnoCode をあなたのPCで動かし、モバイルアプリからリモート操作できます。TUI フロントエンドは複数あるクライアントの1つにすぎません。

---

**コミュニティに参加** [Discord](https://discord.gg/innocode) | [X.com](https://x.com/innocode)
