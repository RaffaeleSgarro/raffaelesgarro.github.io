---
author: admin
comments: false
date: 2014-02-12 12:20:18+00:00
slug: the-magics-of-table-layout
title: The magics of table-layout
wordpress_id: 388
tags:
- css
- table
---

See [this JSFiddle](http://jsfiddle.net/7k7Z7/)

    
    <div>
        <div>cell lorem ipsum</div>
    </div>
    
    <div>
        <div>cell lorem ipsum</div>
        <div>cell lorem ipsum</div>
    </div>
    
    <div>
        <div>cell lorem ipsum</div>
        <div>cell</div>
        <div>cell lorem ipsum</div>
    </div>
    
    <div>
        <div>cell lorem ipsum</div>
        <div>cell</div>
        <div>cell</div>
        <div>c</div>
    </div>
    
    <div>
        <div>cell lorem ipsum</div>
        <div>cell</div>
        <div>c</div>
        <div>cell</div>
        <div>c</div>
    </div>
    
    <div>
        <div>cell lorem ipsum</div>
        <div>c</div>
        <div>c</div>
        <div>cell</div>
        <div>cell</div>
        <div>c</div>
    </div>

<!--more-->

Now the CSS:

    
    div {
        display: table;
        width: 100%;
        table-layout: fixed;
        margin-bottom: 20px;
        border-spacing: 5px;
    }
    
    div > div {
        display: table-cell;
        border: 1px dotted red;
        padding: 4px 6px;
        width: 100%;
        margin-bottom: 0;
        overflow:hidden;
    }


The magic is done with [`table-layout`](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout).
