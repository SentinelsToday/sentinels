# Release Strategy

## Versioning

All Sentinels projects follow [Semantic Versioning 2.0](https://semver.org/):

```
MAJOR.MINOR.PATCH
```

- **MAJOR** -- Breaking API or protocol changes
- **MINOR** -- New features, backward-compatible
- **PATCH** -- Bug fixes, backward-compatible

### Pre-release Tags

```
MAJOR.MINOR.PATCH-<tag>.<number>
```

- `-alpha.1` -- Internal testing, unstable
- `-beta.1` -- Public testing, feature-complete
- `-rc.1` -- Release candidate, final testing

## Release Cadence

| Release Type | Cadence | Target |
|---|---|---|
| Major | Every 6-12 months | Breaking changes |
| Minor | Every 4-6 weeks | Features |
| Patch | As needed | Bug fixes |
| Security | Within 7 days for Tier 1 | CVEs |
| Nightly | Daily (pre-release) | Development |

## Branching Model

```
main
  ^
  |- release/v1.0.x  (stable patch releases)
  |- release/v1.1.x  (stable patch releases)
  ^
  |- develop               (integration branch)
      ^
      |- feat/*            (feature branches)
      |- fix/*             (bug fix branches)
      |- chore/*           (maintenance branches)
```

### Flow

1. Feature work happens on `feat/*` branches branched from `develop`.
2. When complete, PR into `develop` with squash merge.
3. When `develop` is stable, create `release/vX.Y.0` branch from `develop`.
4. Release branch gets final testing and documentation updates.
5. Release branch merges into `main` (tagged) and back into `develop`.
6. Patch releases are cherry-picked from `main` into `release/vX.Y.x`.
7. Hotfixes for critical issues branch from `main` and merge back into both `main` and `develop`.

## Release Process

### 1. Preparation

- [ ] All features for the release are merged to `develop`.
- [ ] CHANGELOG.md is updated.
- [ ] Version numbers are bumped (Cargo.toml, package.json, etc.).
- [ ] Documentation is updated.
- [ ] Migration guide is written (if breaking changes).

### 2. Release Candidate

- [ ] Create `release/vX.Y.0-rc.1` branch from `develop`.
- [ ] Run full test suite.
- [ ] Run integration tests.
- [ ] Run security audit.
- [ ] Fix any issues found.
- [ ] Tag `vX.Y.0-rc.1`.

### 3. Release

- [ ] Final review.
- [ ] Merge `release/vX.Y.0` into `main`.
- [ ] Tag `vX.Y.0` on `main`.
- [ ] Build release artifacts (binaries, packages, Docker images).
- [ ] Publish to package registries (crates.io, npm, PyPI).
- [ ] Publish release notes on GitHub.
- [ ] Deploy to staging.
- [ ] Smoke test staging.
- [ ] Deploy to production.
- [ ] Merge `main` back into `develop`.

### 4. Post-Release

- [ ] Monitor for issues.
- [ ] Create patch releases as needed.
- [ ] Announce release on Discord, Twitter, mailing list.

## Artifact Publishing

| Repository | Registry | Artifacts |
|---|---|---|
| sentinel-core | crates.io, GitHub Releases | Library crate, CLI binary |
| sentinel-agent | GitHub Releases, apt, rpm | Linux binary, systemd unit, Docker image |
| sentinel-cloud | npm, Docker Hub | npm package, Docker image, Helm chart |
| sentinel-chain | crates.io, GitHub Releases | Anchor program, SDK |
| sentinel-sdk | npm, crates.io, PyPI | Language packages |
| sentinel-cli | crates.io, GitHub Releases, Homebrew | CLI binary |
| sentinel-dashboard | npm, Docker Hub | npm package, Docker image |
| sentinel-docs | Vercel, Docker Hub | Static site, Docker image |

## Changelog

All repositories maintain a CHANGELOG.md following [Keep a Changelog](https://keepachangelog.com/) conventions. The changelog is auto-generated from conventional commits and manually curated before release.

### Sections

- **Added** -- New features
- **Changed** -- Changes in existing functionality
- **Deprecated** -- Features to be removed
- **Removed** -- Removed features
- **Fixed** -- Bug fixes
- **Security** -- Security fixes

## Backport Policy

- Patch releases are created for the current minor version only.
- Security fixes are backported to supported versions (see SECURITY.md).
- Feature backports are evaluated case by case.
- Only the latest minor version receives patch releases.

## Deprecation Policy

- Deprecate APIs with a MINOR release.
- Provide migration guides.
- Remove deprecated APIs in the next MAJOR release.
- Minimum deprecation period: 3 months or 1 MINOR release (whichever is longer).

## Communication

- Release announcements are posted to GitHub Releases, Discord, and the mailing list.
- Breaking changes are documented in MIGRATION.md in each repository.
- Security releases are announced 7 days after the fix is deployed.
