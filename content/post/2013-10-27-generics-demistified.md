---
author: admin
comments: false
date: 2013-10-27 10:35:31+00:00
slug: generics-demistified
title: Generics demistified
wordpress_id: 377
tags:
- generics
- java
- jls
---

Take this load of questions:

  * Why can I put an `Integer` in a `List<Number>` but can't assign a `List<Integer>` to a `List<Number>`?
  * Why can I put any `Number` in a `List<? super Number>` but can't do the same with a `List<? extends Number>`?
  * Why doesn't `List<? extends Number>` extends `List<? super Number>`?

<!--more-->

These and similar questions are asked very often, but usually answered like this:


<blockquote>Consider what happens with arrays:
<pre><code>String[] strings = { "Foo", "Bar", "Baz" };
Object[] objects = strings;
objects[0] = new Integer(1); // BOOOOM!
</code></pre>
</blockquote>


This kind of answer is misleading at best, because it pretends that generic types are a feature of the Collections framework of the platform, which is simply not true. Generics are a feature of Java-the-language, and are employed throughout the API (Class, Enum, Comparable) as well as in third party libraries (especially ones dealing with I/O, and thus reflection, like Jackson, jOOQ, etc.)

Relevant links:

  - [4.5.2. Members and Constructors of Parameterized Types](http://docs.oracle.com/javase/specs/jls/se7/html/jls-4.html#jls-4.5.2)
  - [4.10.2. Subtyping among Class and Interface Types](http://docs.oracle.com/javase/specs/jls/se7/html/jls-4.html#jls-4.10.2)
  - [15.12.2.1. Identify Potentially Applicable Methods](http://docs.oracle.com/javase/specs/jls/se7/html/jls-15.html#jls-15.12.2.1)
