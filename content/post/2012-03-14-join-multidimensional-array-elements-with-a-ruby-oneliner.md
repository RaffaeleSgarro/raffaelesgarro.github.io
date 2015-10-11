---
author: admin
comments: false
date: 2012-03-14 23:07:30+00:00
slug: join-multidimensional-array-elements-with-a-ruby-oneliner
title: Join multidimensional array elements with a Ruby oneliner
wordpress_id: 44
tags:
- oneliner
- ruby
---

Just the code

    
    matrix = Array[
    [1, 2, 3],
    [4, 5, 6],
    [0, 0, 0]
    ]
    puts matrix[0..1].transpose.map {|col| col.join(', ')}.join(', ')
    >>> 1, 4, 2, 5, 3, 6


I thought of this because of [canvas.setTransform()](http://www.whatwg.org/specs/web-apps/current-work/multipage/the-canvas-element.html#dom-context-2d-settransform)
