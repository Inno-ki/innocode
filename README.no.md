<p align="center">
  <a href="https://innocode.io">
    <picture>
      <source srcset="packages/console/app/src/asset/logo-ornate-dark.svg" media="(prefers-color-scheme: dark)">
      <source srcset="packages/console/app/src/asset/logo-ornate-light.svg" media="(prefers-color-scheme: light)">
      <img src="packages/console/app/src/asset/logo-ornate-light.svg" alt="InnoCode logo">
    </picture>
  </a>
</p>
<p align="center">AI-kodeagent med åpen kildekode.</p>
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

### Installasjon

```bash
# YOLO
curl -fsSL https://innocode.io/install | bash

# Pakkehåndterere
npm i -g innocode-ai@latest        # eller bun/pnpm/yarn
scoop install innocode             # Windows
choco install innocode             # Windows
brew install anomalyco/tap/innocode # macOS og Linux (anbefalt, alltid oppdatert)
brew install innocode              # macOS og Linux (offisiell brew-formel, oppdateres sjeldnere)
paru -S innocode-bin               # Arch Linux
mise use -g innocode               # alle OS
nix run nixpkgs#innocode           # eller github:anomalyco/innocode for nyeste dev-branch
```

> [!TIP]
> Fjern versjoner eldre enn 0.1.x før du installerer.

### Desktop-app (BETA)

InnoCode er også tilgjengelig som en desktop-app. Last ned direkte fra [releases-siden](https://github.com/anomalyco/innocode/releases) eller [innocode.io/download](https://innocode.io/download).

| Plattform             | Nedlasting                            |
| --------------------- | ------------------------------------- |
| macOS (Apple Silicon) | `innocode-desktop-darwin-aarch64.dmg` |
| macOS (Intel)         | `innocode-desktop-darwin-x64.dmg`     |
| Windows               | `innocode-desktop-windows-x64.exe`    |
| Linux                 | `.deb`, `.rpm` eller AppImage         |

```bash
# macOS (Homebrew)
brew install --cask innocode-desktop
# Windows (Scoop)
scoop bucket add extras; scoop install extras/innocode-desktop
```

#### Installasjonsmappe

Installasjonsskriptet bruker følgende prioritet for installasjonsstien:

1. `$INNOCODE_INSTALL_DIR` - Egendefinert installasjonsmappe
2. `$XDG_BIN_DIR` - Sti som følger XDG Base Directory Specification
3. `$HOME/bin` - Standard brukerbinar-mappe (hvis den finnes eller kan opprettes)
4. `$HOME/.innocode/bin` - Standard fallback

```bash
# Eksempler
INNOCODE_INSTALL_DIR=/usr/local/bin curl -fsSL https://innocode.io/install | bash
XDG_BIN_DIR=$HOME/.local/bin curl -fsSL https://innocode.io/install | bash
```

### Agents

InnoCode har to innebygde agents du kan bytte mellom med `Tab`-tasten.

- **build** - Standard, agent med full tilgang for utviklingsarbeid
- **plan** - Skrivebeskyttet agent for analyse og kodeutforsking
  - Nekter filendringer som standard
  - Spør om tillatelse før bash-kommandoer
  - Ideell for å utforske ukjente kodebaser eller planlegge endringer

Det finnes også en **general**-subagent for komplekse søk og flertrinnsoppgaver.
Den brukes internt og kan kalles via `@general` i meldinger.

Les mer om [agents](https://innocode.io/docs/agents).

### Dokumentasjon

For mer info om hvordan du konfigurerer InnoCode, [**se dokumentasjonen**](https://innocode.io/docs).

### Bidra

Hvis du vil bidra til InnoCode, les [contributing docs](./CONTRIBUTING.md) før du sender en pull request.

### Bygge på InnoCode

Hvis du jobber med et prosjekt som er relatert til InnoCode og bruker "innocode" som en del av navnet; for eksempel "innocode-dashboard" eller "innocode-mobile", legg inn en merknad i README som presiserer at det ikke er bygget av InnoCode-teamet og ikke er tilknyttet oss på noen måte.

### FAQ

#### Hvordan er dette forskjellig fra Claude Code?

Det er veldig likt Claude Code når det gjelder funksjonalitet. Her er de viktigste forskjellene:

- 100% open source
- Ikke knyttet til en bestemt leverandør. Selv om vi anbefaler modellene vi tilbyr gjennom [InnoCode Zen](https://innocode.io/zen); kan InnoCode brukes med Claude, OpenAI, Google eller til og med lokale modeller. Etter hvert som modellene utvikler seg vil gapene lukkes og prisene gå ned, så det er viktig å være provider-agnostic.
- LSP-støtte rett ut av boksen
- Fokus på TUI. InnoCode er bygget av neovim-brukere og skaperne av [terminal.shop](https://terminal.shop); vi kommer til å presse grensene for hva som er mulig i terminalen.
- Klient/server-arkitektur. Dette kan for eksempel la InnoCode kjøre på maskinen din, mens du styrer den eksternt fra en mobilapp. Det betyr at TUI-frontend'en bare er en av de mulige klientene.

---

**Bli med i fellesskapet** [Discord](https://discord.gg/innocode) | [X.com](https://x.com/innocode)
