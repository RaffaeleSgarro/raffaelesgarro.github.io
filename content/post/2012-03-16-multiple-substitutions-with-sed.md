---
author: admin
comments: false
date: 2012-03-16 12:46:11+00:00
slug: multiple-substitutions-with-sed
title: Multiple substitutions with sed
wordpress_id: 64
tags:
- bash
- oneliner
- regex
- sed
---

$echo 'hello world!' | sed "s/hello/good/g;s/world/bye/g"
    good bye!
