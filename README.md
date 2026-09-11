# Duodesigns Portfolio

Static portfolio site. This repository contains the site source files.

How to push these files to GitHub

1. Install Git if you don't have it:

Windows (winget):

```
winget install --id Git.Git -e --source winget
```

Or download from: https://git-scm.com/downloads

2. Run these commands in PowerShell from the project folder:

``powershell
cd "d:\portfolio dd"
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/duodesignsin/duodesigns-portfolio.git
git push -u origin main
``

If HTTPS push is blocked by authentication, either configure SSH and use the SSH remote:

```
git remote set-url origin git@github.com:duodesignsin/duodesigns-portfolio.git
git push -u origin main
```

Or create a Personal Access Token (PAT) on GitHub and use it when prompted for a password.
