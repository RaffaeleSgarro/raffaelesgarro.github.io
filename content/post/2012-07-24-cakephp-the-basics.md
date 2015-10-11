---
author: admin
comments: false
date: 2012-07-24 22:08:33+00:00
slug: cakephp-the-basics
title: 'CakePHP: the basics'
wordpress_id: 202
categories:
- CakePHP
tags:
- cakephp
- php
---

CakePHP is a PHP framework to easily build MVC applications. To install it clone the repository on GitHub

    
    git clone https://github.com/cakephp/cakephp.git cakephp-2.2.1
    git checkout 2.2.1


Now we can use the Cake code generator from command line - it's called `bake` and is run like `cake bake`. The path to the `cake` executable (really a tiny shell script which invokes the real PHP-cli one) is like `cake-2.2.1/lib/Cake/Console/cake`. For convenience, you can add this to your `PATH`. We are now ready to generate the skeleton of the directory structure plus common files required by a CakePHP application:

    
    cake bake


Bake will ask you the path of the project, the credentials for accessing the database and so on. You can keep the default for the majority of the settings<!--more-->. Let's see what files/directory bake just created:

    
    myapp/
    myapp/.htaccess
    myapp/Locale
    myapp/Locale/eng
    myapp/Locale/eng/LC_MESSAGES
    myapp/Lib
    myapp/Console
    myapp/Console/cake.bat
    myapp/Console/Command
    myapp/Console/Command/AppShell.php
    myapp/Console/Command/Task
    myapp/Console/cake.php
    myapp/Console/cake
    myapp/Console/Templates
    myapp/index.php
    myapp/Plugin
    myapp/tmp
    myapp/tmp/cache
    myapp/tmp/cache/models
    myapp/tmp/cache/persistent
    myapp/tmp/cache/persistent/myapp_cake_core_cake_console_
    myapp/tmp/cache/views
    myapp/tmp/logs
    myapp/tmp/tests
    myapp/tmp/sessions
    myapp/Vendor
    myapp/Model
    myapp/Model/AppModel.php
    myapp/Model/Datasource
    myapp/Model/Behavior
    myapp/Controller
    myapp/Controller/Component
    myapp/Controller/AppController.php
    myapp/Controller/PagesController.php
    myapp/Config
    myapp/Config/email.php.default
    myapp/Config/routes.php
    myapp/Config/acl.ini.php
    myapp/Config/database.php.default
    myapp/Config/bootstrap.php
    myapp/Config/core.php
    myapp/Config/database.php
    myapp/Config/Schema
    myapp/Config/Schema/sessions.sql
    myapp/Config/Schema/sessions.php
    myapp/Config/Schema/db_acl.php
    myapp/Config/Schema/db_acl.sql
    myapp/Config/Schema/i18n.sql
    myapp/Config/Schema/i18n.php
    myapp/webroot
    myapp/webroot/img
    myapp/webroot/img/test-fail-icon.png
    myapp/webroot/img/cake.icon.png
    myapp/webroot/img/test-pass-icon.png
    myapp/webroot/img/cake.power.gif
    myapp/webroot/img/test-skip-icon.png
    myapp/webroot/img/test-error-icon.png
    myapp/webroot/.htaccess
    myapp/webroot/index.php
    myapp/webroot/css
    myapp/webroot/css/cake.generic.css
    myapp/webroot/test.php
    myapp/webroot/js
    myapp/webroot/files
    myapp/webroot/favicon.ico
    myapp/Test
    myapp/Test/Fixture
    myapp/Test/Case
    myapp/Test/Case/Model
    myapp/Test/Case/Model/Behavior
    myapp/Test/Case/Controller
    myapp/Test/Case/Controller/Component<cod
    myapp/Test/Case/View
    myapp/Test/Case/View/Helper
    myapp/View
    myapp/View/Elements
    myapp/View/Emails
    myapp/View/Emails/text
    myapp/View/Emails/text/default.ctp
    myapp/View/Emails/html
    myapp/View/Emails/html/default.ctp
    myapp/View/Scaffolds
    myapp/View/Helper
    myapp/View/Helper/AppHelper.php
    myapp/View/Errors
    myapp/View/Errors/error500.ctp
    myapp/View/Errors/error400.ctp
    myapp/View/Pages
    myapp/View/Pages/home.ctp
    myapp/View/Layouts
    myapp/View/Layouts/error.ctp
    myapp/View/Layouts/ajax.ctp
    myapp/View/Layouts/Emails
    myapp/View/Layouts/Emails/text
    myapp/View/Layouts/Emails/text/default.ctp
    myapp/View/Layouts/Emails/html
    myapp/View/Layouts/Emails/html/default.ctp
    myapp/View/Layouts/xml
    myapp/View/Layouts/xml/default.ctp
    myapp/View/Layouts/js
    myapp/View/Layouts/js/default.ctp
    myapp/View/Layouts/rss
    myapp/View/Layouts/rss/default.ctp
    myapp/View/Layouts/flash.ctp
    myapp/View/Layouts/default.ctp


Now, enable `mod_rewrite` on your Apache webserver (or the equivalent) and point a browser to `http://localhost/myapp`. You will see an error asking you to set the value for the Cake library files under the constant `CAKE_CORE_INCLUDE_PATH` in `webroot/index.php`. Before setting this, it's time to init the git repository for our new project:

    
    git init
    find . -empty -type d -not -iwholename '*/.git/*' -exec touch '{}'/EMPTY \;
    touch README.md
    git add .
    git commit -m "Initial commit"
    git remote add origin $URL
    git push -u origin master


(Note that the `find` on line 2 is there to preserve the directory structure in git). Now it's time to configure the cake path seen above, but we don't want to put the edit in Git. Finally, we'll add a `.gitignore` with the `tmp/` directory as the only content

    
    git update-index --assume-unchanged webroot/index.php
    # uncomment around line 60 in the file
    echo "tmp/" >> .gitignore
    git add .gitignore
    git commit -m "Added .gitignore"


It's time to see out app in a browser window
[![](http://zybnet.com/wordpress/wp-content/uploads/CakePHP-the-rapid-development-php-framework-Home.png)](http://zybnet.com/wordpress/wp-content/uploads/CakePHP-the-rapid-development-php-framework-Home.png)
What can be seen here is a `View` rendered by the `PagesController`. Here is the flow



	
  1. The browser issues a `HTTP GET /myapp/`

	
  2. Cake reads its routing table (defined in `Config/routes.php`) and finds the line matching `/`

	
  3. `PagesController` invokes its  `display` method


These are the main components when dealing a Cake app: first you write a `Controller` and its associated `View`, then you declare a `route` and finally define the DB part: database + `Model` (in the case of the `PagesController`, it really doesn't store contents in a db, but access raw files stored under `View/Page/`

In the next post, we'll enhance the `PagesController` by adding authentication and database storage
