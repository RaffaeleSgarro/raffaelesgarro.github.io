---
author: admin
comments: false
date: 2013-06-28 15:10:50+00:00
slug: rails-content-negotiation-explained
title: Rails content negotiation explained
wordpress_id: 340
tags:
- rails
- ruby
---

Explain the following snippet found in a Rails controller:


    
    def index
      @posts = Post.all
    
      respond_to do |format|
        format.html  # index.html.erb
        format.json  { render :json => @posts }
      end
    end



Useful [link](http://www.robertsosinski.com/2008/12/21/understanding-ruby-blocks-procs-and-lambdas/) to Ruby procs, blocks and lambdas

<!--more-->
