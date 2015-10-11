---
author: admin
comments: false
date: 2012-09-06 14:43:49+00:00
slug: ack-better-than-grep
title: 'ACK: Better than GREP!'
wordpress_id: 162
tags:
- ack
- grep
---

[Better than grep!](http://betterthangrep.com)

On Ubuntu, you need to install the package `ack-grep` (oddly, the executable is also named ack-grep...)

Examples: find the usages of the variable `$secret` in the PHP files

    
    $ ack-grep --php '\$secret'
