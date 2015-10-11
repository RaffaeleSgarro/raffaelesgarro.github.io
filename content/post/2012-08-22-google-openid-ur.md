---
author: admin
comments: false
date: 2012-08-22 22:37:41+00:00
slug: google-openid-ur
title: Google OpenID URL
wordpress_id: 227
tags:
- google
- openid
---

I've always thought that the URL for my Google OpenID were something like `http://google.com/account/RaffaeleSgarro`. Instead, it turns out that when a site request that URL to sign up (and in the case it doesn't provide a Google icon), you can simply enter

`https://www.google.com/accounts/o8/id`

and it will redirect you to the Google server to confirm the authorization, and then back to the original site
