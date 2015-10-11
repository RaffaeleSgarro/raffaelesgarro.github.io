---
author: admin
comments: false
date: 2012-10-29 17:39:23+00:00
slug: bamboo-fun-pen-on-ubuntu-12-04-precise-pangoline
title: Bamboo Fun Pen on Ubuntu 12.04 Precise Pangoline
wordpress_id: 276
tags:
- bamboo
- drawing
- ubuntu
---

The driver is supplied by [this PPA](https://launchpad.net/~lekensteyn/+archive/wacom-tablet), so:

    
    sudo add-apt-repository ppa:lekensteyn/wacom-tablet
    sudo apt-get update
    sudo apt-get install wacom-dkms


Then we need a program to draw: [MyPaint](http://mypaint.intilinux.com/)

    
    sudo apt-get install mypaint mypaint-data


Happy drawing! :)

