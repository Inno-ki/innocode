# InnoCode Release Checklist

Use this checklist after tagging a release to confirm all channels are live.

## Preflight
- Confirm GitHub Actions secrets are set in `Inno-ki/innocode`:
  - `NPM_TOKEN`
  - `HOMEBREW_TOKEN`
  - `SCOOP_TOKEN`
  - `GITHUB_TOKEN` (default)
- Confirm `https://innocode.io/install` serves the latest `install` script.

## Trigger
1. Create a release tag:
   ```bash
   git tag vX.Y.Z
   git push origin vX.Y.Z
   ```
2. Wait for `.github/workflows/release.yml` to complete successfully.

## Verify Outputs
- GitHub release exists with assets for all OS/arch targets.
- npm:
  - `npm view innocode version` matches tag version.
- Homebrew:
  - `brew tap Inno-ki/tap`
  - `brew info innocode` shows current version.
- Scoop:
  - `scoop bucket add innocode https://github.com/Inno-ki/scoop-bucket`
  - `scoop info innocode` shows current version.
- Docker:
  - `docker pull ghcr.io/inno-ki/innocode:latest`
  - `docker run --rm ghcr.io/inno-ki/innocode:latest --version`

## Smoke Tests
- `innocode --version`
- `innocode run "Hello"`
- `innocode serve`
