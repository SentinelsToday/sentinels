# GitHub Project Boards

## Board 1: Core Development

**Purpose**: Track the main development workflow for sentinel-core, sentinel-agent, sentinel-cloud.

### Columns

| Column | Description | Automation |
|---|---|---|
| Backlog | Unstarted, unassigned issues | New issues with no milestone |
| Ready | Prioritized, assigned, ready to start | Issues with milestone and assignee |
| In Progress | Actively being worked on | Issues linked to open PR |
| In Review | PR submitted, awaiting review | PR opened against main/develop |
| QA | Merged to develop, awaiting testing | Merged PR to develop |
| Done | Shipped in a release | Tagged release |

### Views

- **Kanban** -- Team view, all items
- **Roadmap** -- Milestone timeline view
- **My Work** -- Filtered by assignee

---

## Board 2: Release Tracking

**Purpose**: Track the progress of each release across all repositories.

### Columns

| Column | Description |
|---|---|
| Planning | Features and fixes targeted for this release |
| In Development | Features in progress |
| Code Complete | All features merged to develop |
| Release Candidate | RC branch cut, testing in progress |
| Released | Tagged and deployed |
| Post-Mortem | Release retrospective |

---

## Board 3: Community & Ecosystem

**Purpose**: Track community contributions, documentation, and ecosystem work.

### Columns

| Column | Description |
|---|---|
| Good First Issues | New-contributor-friendly tasks |
| Community PRs | PRs from external contributors |
| Documentation | Doc updates and new guides |
| Integrations | Third-party integration work |
| Events | Conference talks, meetups, blog posts |
| Done | Completed |

---

## Board 4: Security & Compliance

**Purpose**: Track security issues, audits, and compliance work.

### Columns

| Column | Description |
|---|---|
| Triage | New security reports |
| Investigating | Confirmed, investigating |
| Fix in Progress | Remediation in development |
| Fix Deployed | Fix shipped |
| Disclosure | Coordinated disclosure in progress |
| Public | Publicly disclosed and documented |

---

## Board 5: Product Roadmap

**Purpose**: High-level strategic roadmap view.

### Views

- **Now** -- Current quarter goals
- **Next** -- Next quarter goals
- **Later** -- Future goals (not committed)

### Grouping

- By repository
- By theme (Foundation, Scale, Integrate, Enterprise, Intelligence)

---

## Labels for Project Tracking

| Label | Board Association |
|---|---|
| `status:backlog` | Core Dev > Backlog |
| `status:ready` | Core Dev > Ready |
| `status:in-progress` | Core Dev > In Progress |
| `status:in-review` | Core Dev > In Review |
| `status:qa` | Core Dev > QA |
| `release:X.Y.Z` | Release Tracking |
| `community` | Community |
| `good-first-issue` | Community |
| `security` | Security |
| `roadmap:now` | Product Roadmap |
| `roadmap:next` | Product Roadmap |
| `roadmap:later` | Product Roadmap |
