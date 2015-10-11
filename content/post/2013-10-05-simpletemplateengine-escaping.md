---
author: admin
comments: false
date: 2013-10-05 17:27:48+00:00
slug: simpletemplateengine-escaping
title: SimpleTemplateEngine escaping
wordpress_id: 367
tags:
- escaping
- groovy
---

The method `createTemplate()` inside `SimpleTemplateEngine` builds a template from a `String`, and then `make(bindings)` replaces placeholders with values from the hash.

As advertised [in the documentation](http://groovy.codehaus.org/api/groovy/text/SimpleTemplateEngine.html), placeholders are given in JSP or GString style, so the problem is: how do we escape JSP and GString delimiters? That is, how can we insert a plain `$foo` or a literal `<%=bar%>` without the engine complaining about missing keys when binding?

<!--more-->

First, the GString part. Your first bet would be using a backslash to escape the dollar. The intuition is right, but the implementation is tricky. For example using:

    
    engine.createTemplate("\$foo");


won't work, because the backslash is taken from the GString before converting to String, and then you have a `"$foo"` which can be evaluated as a GString placeholder from the template engine. We need to keep the backslash in that String, and the solution is a triple backslash:

    
    engine.createTemplate("\\\$foo");


The first `\\` is a literal `\`, the `\$` is a literal `$`, so the engine receives a `\$foo`, and won't attempt to do any substitution. If you don't like the triple escape, another option is:

    
    engine.createTemplate("${'foo'}");


which, to my understanding, means that the code will be evaluated as a GString, but instead of the name of a variable it finds a literal string, so doesn't look for a value for the given name.

Links:

[Working on ideone](http://ideone.com/Dh12hc)
[Original thread](http://groovy.329449.n5.nabble.com/SimpleTemplateEngine-How-to-preserve-strings-in-template-td5717067.html)
