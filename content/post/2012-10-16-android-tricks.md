---
author: admin
comments: false
date: 2012-10-16 15:00:40+00:00
slug: android-tricks
title: Android tricks
wordpress_id: 262
tags:
- android
---

This post will gather all those little tricks that speed up your Android development, because I found I often get stuck because of **poor documentation**.

<!--more-->

PopupMenu:



	
  * supply x and y, otherwise it won't show up

	
  * set a background drawable, or it won't react to touch events

	
  * You need a style with two items for animation to work [http://stackoverflow.com/a/7550227/315306](http://stackoverflow.com/a/7550227/315306)


SQLite

	
  * Primary key must be defined `INTEGER PRIMARY KEY NOT NULL` (WTF? Not null?) And be careful that if you use `INT` instead of `INTEGER`, you won't have the autoincrement behavior

	
  * Primary key must be explicitly enabled with `PRAGMA foreign_keys = ON;` ([doc](http://www.sqlite.org/foreignkeys.html#fk_enable)). Usually this is done inside `onOpen(SQLiteDatabase)`, after checking that the database is writeable

	
  * Use the class DatabaseUtils


ViewAnimator

	
  * Batch removing children is tricky. First, you must `post()` to the animator's Handler. Then you need to set in and out animations to `null`. Finally, removeViews(int start, int count) doesn't work well, so you have to remove one child at a time, either with `removeView(View view)` or `removeChildAt(int index)`


EditText

	
  * `getText()` returns a `CharSequence`. It never returns `null`,  so you must check its length to tell if it's empty.


