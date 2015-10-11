---
author: admin
comments: false
date: 2012-08-26 09:03:52+00:00
slug: git-with-different-ssh-identities
title: Git with different SSH identities
wordpress_id: 231
tags:
- git
- ssh
---

Nowdays the best way to access remote Git repositories is through the HTTP transport. However most service still offer SSH connectivity, and there are times when you want to access different hosts with SSH identities different than the default one (id_rsa). Useful links



	
  * [Superuser question about multiple keys](http://superuser.com/questions/272465/using-multiple-ssh-public-keys)

	
  * [The blog post that links to the previous question](http://sealedabstract.com/code/github-ssh-with-multiple-identities-the-slightly-more-definitive-guide/)


**Disclaimer: I pasted content from the aforementioned sources. I hope I have the time to review it and clarify and make it my own. For the time, it's only a reference for myself.**

If you have an active _ssh-agent_ that has your `id_rsa` key loaded, then the problem is likely that _ssh_ is offering that key first. Unfuddle probably accepts it for authentication (e.g. in _sshd_) but rejects it for authorization to access the company repositories (e.g. in whatever internal software they use for authorization, possibly something akin to Gitolite). Perhaps there is a way to add your personal key to the company account (multiple people are not sharing the same `corp_rsa` public and private key files, are they?).

<!--more-->

The `IdentitiesOnly` `.ssh/config` configuration keyword can be used to limit the keys that _ssh_offers to the remote _sshd_ to just those specified via `IdentityFile` keywords (i.e. it will refuse to use any additional keys that happen to be loaded into an active _ssh-agent_).

Try these `.ssh/config` sections:

    
    Host {personalaccount}.unfuddle.com
       IdentityFile ~/.ssh/id_rsa
       IdentitiesOnly yes
    Host {companyaccount}.unfuddle.com
       IdentityFile ~/.ssh/{companyaccount}_rsa
       IdentitiesOnly yes


Then, use Git URLs like these:

    
    git@{personalaccount}.unfuddle.com:{personalaccount}/my-stuff.git 
    git@{companyaccount}.unfuddle.com:{companyaccount}/their-stuff.git


If you want to take full advantage of the `.ssh/config` mechanism, you can supply your own custom hostname and change the default user name:

    
    Host uf-mine
        HostName {personalaccount}.unfuddle.com
        User git
        IdentityFile ~/.ssh/id_rsa
        IdentitiesOnly yes
    Host uf-comp
        HostName {companyaccount}.unfuddle.com
        User git
        IdentityFile ~/.ssh/{companyaccount}_rsa
        IdentitiesOnly yes


Then, use Git URLs like these:

    
    uf-mine:{personalaccount}/my-stuff.git
    uf-comp:{companyaccount}/their-stuff.git


This SCP-like syntax (which is not a valid URL by the way) is [permitted by git](http://git-scm.com/docs/git-clone#_git_urls). Also note `uf-mine` can either be a [remote](http://git-scm.com/docs/git-remote) or a `Host` set in `~/.ssh/config` [[man ssh_config]](http://www.manpagez.com/man/5/ssh_config/):


<blockquote>Restricts the following declarations (up to the next Host keyword) to be only for those hosts that match one of the patterns given after the keyword. If more than one pattern is provided, they should be separated by whitespace. A single `*' as a pattern can be used to provide global defaults for all hosts. The host is the hostname argument given on the command line (i.e. the name is not converted to a canonicalized host name before matching)</blockquote>




<blockquote>What you actually do, it turns out, is use the IdentitiesOnly “yes” directive in ~/.ssh/config. This means that none of the ssh-agent magical keys will get in the priority queue, and only things explicitly specified either in config or on the commandline are allowed</blockquote>
