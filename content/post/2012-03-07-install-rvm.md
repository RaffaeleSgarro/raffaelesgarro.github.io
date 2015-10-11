---
author: admin
comments: false
date: 2012-03-07 23:22:18+00:00
slug: install-rvm
title: Install RVM
wordpress_id: 39
tags:
- rails
- ruby
---

The following downloads and executes the RVM installer

    
    $ bash -s stable < \
       <(curl -s https://raw.github.com/wayneeseguin/rvm/master/binscripts/rvm-installer)


<!--more-->

I explain what this oneliner does:




	
  1. The command in `<(...)` is executed and its output is made available through a file descriptor like `/dev/fd/$id` ([Bash guide](http://www.gnu.org/software/bash/manual/bashref.html#Process-Substitution))

	
  2. This filename becomes the argument of standard input redirection (it's the first `<` )

	
  3. The downloaded data (which is the output of `curl`) happens to be a Bash script, so it's executed from bash and it's passed `stable` parameter (that's [what `-s` is for](http://www.gnu.org/software/bash/manual/bashref.html#Invoking-Bash))

	
  4. The stable branch of RVM is finally installed



Run the following as the installer suggests


    
    $source ~/.rvm/scripts/rvm


Finally append this to .bashrc

    
    [[ -s "$HOME/.rvm/scripts/rvm" ]] && . "$HOME/.rvm/scripts/rvm"


Each Ruby interpreter depends on some other software. RVM suggests what to install, depending on your operating system

    
    $rvm requirements
