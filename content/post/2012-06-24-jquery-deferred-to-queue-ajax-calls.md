---
author: admin
comments: false
date: 2012-06-24 21:55:36+00:00
slug: jquery-deferred-to-queue-ajax-calls
title: jQuery.Deferred to queue ajax calls
wordpress_id: 126
tags:
- javascript
- jquery
---

A [`jQuery.Deferred` object](http://api.jquery.com/category/deferred-object/) is an interface to describe asynchronous operations. The Deferred interface gives the client programmer two hooks:



	
  * Deferred.done(callback)

	
  * and Deferred.fail(callback)


The callback signature is estabilished by the implementor. For example `jQuery.get()` returns a `jqXHR`, implementing the Promise interface (a subset of Deferred, used to prevent users from changing the state of the Deferred), and the callback for `done()` uses up to three parameters: data, textStatus, jqXHR.<!--more--> So instead of using the jQuery "proprietary"

    
    $.get("http://host/resource", {}, function(data, textStatus, jqXHR) { /* do something with the response*/ });


one can use the promise-style (remember $.get returns a promise)

    
    $.get("http://host/resource").done(function(data, textStatus, jqXHR) { /* do something with the response*/ });


To enqueue asynchronous calls one can use `Deferred.pipe(doneFilter, failFilter)` (prior to 1.8 you must use `pipe()`, while in 1.8 the implementation of pipe() is renamed then() and pipe() becomes an alias to it).

Things get interesting when doneFilter() itself returns a Promise and you want to register a callback when this new promise is resolved. Imagine the scenario where you want to



	
  1. get authorization token

	
  2. get last order

	
  3. delete last order


Thanks to jQuery and promise we can accomplish this via

    
    $.get("/token", params)
      .pipe(function(data){
         // Note that here "this" refers to the
         // jqXHR, which also is a deferred
         return $.get("/order/last", params);
      })
      .pipe(function(data){
        return $.delete("/order", params);
      })
      .pipe(function(data){
        $("#some_div").text("OK");
      });


Without promise, we would have needed to nest calls like this

    
    $.get("/token", params, function (data) {
      $.get("/order/last", params2, function(data) {
        $.delete("/order", params3, function(data) {
          $("#some_div").text("OK");
        });
      });
    });



As a bonus, we'll review Deferred implementation in another post.

