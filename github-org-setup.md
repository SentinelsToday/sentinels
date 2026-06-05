# GitHub Organization Setup Checklist

This document lists everything that has been done in this repository, and the manual steps required on GitHub.com to complete the Sentinel Labs organization.

## Done in this repo

- [x] `.github/profile/README.md` -- organization profile (Ratspeak-style)
- [x] `CODE_OF_CONDUCT.md`
- [x] `CONTRIBUTING.md`
- [x] `SECURITY.md`
- [x] `ARCHITECTURE.md`
- [x] `ROADMAP.md`
- [x] `SUPPORTED_PLATFORMS.md`
- [x] `branding-guide.md`
- [x] `repository-hierarchy.md`
- [x] `release-strategy.md`
- [x] `12-month-growth-plan.md`
- [x] `project-boards.md`
- [x] `developer-experience-plan.md`
- [x] `open-source-strategy.md`
- [x] `community-strategy.md`
- [x] `LICENSE` (Apache 2.0)
- [x] `.github/ISSUE_TEMPLATE/bug_report.md`
- [x] `.github/ISSUE_TEMPLATE/feature_request.md`
- [x] `.github/ISSUE_TEMPLATE/config.yml`
- [x] `.github/PULL_REQUEST_TEMPLATE.md`
- [x] `.github/labels.yml`
- [x] `.github/workflows/labels.yml`
- [x] `docs/folder-structure.md`
- [x] `docs/fumadocs-config.md`
- [x] `docs/README.md`

## Manual steps on GitHub.com

### 1. Create the `.github` repository in the org

The organization profile README is shown only when a special `.github` repository exists.

1. Go to https://github.com/organizations/SentinelLabs/repositories/new
2. Repository name: `.github`
3. Description: `Sentinel Labs org profile`
4. Visibility: Public
5. Initialize with README: no
6. Add the contents of this repository's `.github/` folder to it
7. Push using:
   ```bash
   git remote add github-org https://github.com/SentinelLabs/.github.git
   git checkout -b main
   git push github-org main
   ```

The org profile README will appear at https://github.com/SentinelLabs within a few minutes.

### 2. Create the remaining repos

For each repository listed in `repository-hierarchy.md`:

| Repository | Visibility | Init with this branch |
|---|---|---|
| sentinel-core | Public | main |
| sentinel-agent | Public | main |
| sentinel-cloud | Public | main |
| sentinel-chain | Public | main |
| sentinel-sdk | Public | main |
| sentinel-cli | Public | main |
| sentinel-dashboard | Public | main |
| sentinel-mobile | Private | main |
| sentinel-firmware | Public | main |
| sentinel-hardware | Public | main |
| sentinel-docs | Public | main |
| sentinel-website | Public | main |

For each:
1. Create the repo in the org
2. Push an initial commit with README, LICENSE, CODE_OF_CONDUCT, CONTRIBUTING, SECURITY
3. Add the topics listed in `repository-hierarchy.md`
4. Add a description matching the table

### 3. Configure organization settings

Go to https://github.com/organizations/SentinelLabs/settings:

- **Display name**: Sentinel Labs
- **Description**: Trust infrastructure for autonomous systems
- **URL**: https://sentinellabs.io
- **Location**: (your location)
- **Email**: hello@sentinellabs.io
- **Profile picture**: logo (shield + "S" mark)
- **Twitter/X**: @sentinellabs

### 4. Apply organization-wide labels

Run the workflow in `.github/workflows/labels.yml` from each repo, or apply manually:

1. Go to each repo -> Issues -> Labels
2. Delete default labels
3. Add labels from `.github/labels.yml`

### 5. Create project boards

Go to https://github.com/orgs/SentinelLabs/projects:

Create the 5 boards listed in `project-boards.md`:

- Core Development
- Release Tracking
- Community & Ecosystem
- Security & Compliance
- Product Roadmap

### 6. Set up Discussions

For each public repo:
1. Settings -> Features -> Enable Discussions
2. Create categories: General, Ideas, Q&A, Show and tell, Help

### 7. Set up branch protection

For each public repo:
1. Settings -> Branches -> Add rule for `main`
2. Require pull request reviews before merging (1+ reviewer)
3. Require status checks to pass (CI, lint, typecheck, test, build)
4. Require linear history
5. Include administrators

### 8. Set up Sponsors (optional)

Go to https://github.com/sponsors/SentinelLabs (requires GitHub sponsorship program enrollment).

### 9. Set up security policy

For each repo, ensure `SECURITY.md` is in place. The org-wide version is in this repo.

### 10. Set up CODEOWNERS

In each repo, create a `.github/CODEOWNERS` file:
```
* @SentinelLabs/maintainers
/docs/ @SentinelLabs/docs-team
/security/ @SentinelLabs/security-team
```

### 11. Organization teams

Create the following teams:

| Team | Purpose | Members |
|---|---|---|
| @maintainers | Default maintainers | All core maintainers |
| @core-team | Core engine (sentinel-core, sentinel-agent) | Subset |
| @cloud-team | Cloud platform (sentinel-cloud, sentinel-dashboard) | Subset |
| @docs-team | Documentation (sentinel-docs) | Subset |
| @security-team | Security reviews | Subset |
| @community | Community moderators | Trusted contributors |

## Verification

After all steps, verify:
- [ ] Org profile README is visible at https://github.com/SentinelLabs
- [ ] All repos are visible at https://github.com/orgs/SentinelLabs/repositories
- [ ] Topics are searchable
- [ ] Discussions are enabled
- [ ] Branch protection is enforced
- [ ] Issue templates appear in new issues
- [ ] PR template appears in new PRs
