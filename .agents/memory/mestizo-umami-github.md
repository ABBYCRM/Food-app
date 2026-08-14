---
name: Mestizo Umami GitHub push
description: How to push to ABBYCRM/Food-app.git using the PAT secret
---
Remote: https://github.com/ABBYCRM/Food-app.git
PAT secret name: GITHUB_PAT

Push command:
  git remote set-url origin "https://${GITHUB_PAT}@github.com/ABBYCRM/Food-app.git" && git push origin main

**Why:** Remote URL needs inline PAT for auth — do not store permanently in .git/config.
**How to apply:** Always set-url before each push session.
