---
author: admin
comments: false
date: 2013-06-27 19:32:24+00:00
slug: floating-elements-and-overflow
title: Floating elements and overflow
wordpress_id: 323
tags:
- css
---

Starting point: a container with N <div> elements: one is float: right and the rest is float: none.

If you set `overflow: hidden` on a `float: none` box it will not overlap the floating siblings. In this screenshot, the semi-transparent red box is `float: right`, and the yellow box is `overflow:hidden`

[![With overflow: hidden](http://zybnet.com/wordpress/wp-content/uploads/zn.png)](http://zybnet.com/wordpress/wp-content/uploads/zn.png)

And here you what happens when `overflow: visible` is applied to the yellow box:

[![With overflow: visible](http://zybnet.com/wordpress/wp-content/uploads/zn2.png)](http://zybnet.com/wordpress/wp-content/uploads/zn2.png)

Play it on [JSBin](http://jsbin.com/atopaz/2/edit)
This is because elements with `overflow: hidden` estabilish a new [block formatting context](https://developer.mozilla.org/en-US/docs/Web/Guide/CSS/Block_formatting_context) and


<blockquote>The rules for positioning and clearing of floats apply only to things within the same block formatting context. Floats do not affect the layout of things in other block formatting contexts</blockquote>


I played with it to build a search bar that expands to fill the remaining space:

[JS Bin](http://jsbin.com/riwof/1/embed?html,css,output)
