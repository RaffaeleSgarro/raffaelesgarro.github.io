---
author: Raffaele Sgarro
date: 2015-10-11T23:04:54+02:00
title: 'How to host a static site (Hugo) on GitHub Pages' 
type: post
---

GitHub Pages is a free hosting service that can effectively be used for static
content. For example this site is entirelty made up of HTML files in the `master`
branch of the repository `raffaelesgarro.github.io`. Only two things are needed:

 - a `CNAME` record in the DNS
 - a `CNAME` file to instruct the Pages virtual host

<!--more-->

I use Hugo to write the posts in Markdown, and obviously keep the files in Git.
The first problem is I can't use the remote `master` branch, so I keep the posts
in a `src` branch. Another strange thing is that the build artifacts must be
kept in version control (!) and since I don't really like it, I clear
`master` every time I push. So this is my typical workflow

  - `git checkout src`
  - ... create posts, tweak theme and commit ...
  - build the site `hugo -d dist`
  - Move the site outside the repo `mv dist /tmp/dist`
  - Come back to master `git checkout -f master`
  - Replace the content of the directory (`git rm -rf .` and `git clean -fxd`)
    with the content of `dist`, and eventually commit
  - Rebase `git rebase --root`
  - Push `git push -f origin --all`

I rebase `master` because I don't want to keep the builds in the history - it's
a huge load of files! Obviously that won't take down GitHub, and the commits will
still be online until garbage collection... But still I feel better this way :)
