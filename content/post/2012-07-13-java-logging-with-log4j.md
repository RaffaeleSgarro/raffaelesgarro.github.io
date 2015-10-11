---
author: admin
comments: false
date: 2012-07-13 15:30:20+00:00
slug: java-logging-with-log4j
title: Java logging with log4j
wordpress_id: 163
tags:
- java
- log4j
- logging
---

What is a Logger? Basically it's an object which lets you write code like

    
    logger.debug("Just entered main");
    logger.error(new FileNotFoundException("/home/foo/bar.txt"));
    logger.warn(new Integer(12921));


instead of all those `System.out.println` to log what your program does. With log4j one can conveniently log to stdout, a rolling file, the syslog daemon, a message queue and so on.<!--more-->

How to get a Logger object? Call the static method `Logger.getLogger(String name)`. As you can see, when you get a Logger you explicitely supply an identifier. This name is used to provide context to logging calls, so they can be effectively filtered depending on applied settings. Logger names are arranged in a hierarchical tree based on their dot separated names, exactly like DNS works: com.foo is the parent of com.foo.bar, which is a com.foo child and a descendant of both com and com.foo. Instead "com" alone is said to be an ancestor of com.foo.bar. The hierarchy matters because child loggers inherits some properties from their ancestors, like level and default appenders.

Logging is usually configured in a property files, sometimes to give users a chance for customization, but more often just to tell declarative code apart. So we put this `log4j.properties` somewhere in the `CLASSPATH` (sometimes it can be useful to start the VM with the system property `-Dlog4j.debug` to see what configuration file log4j is picking to configure itself):

    
    # Declare a logger named "com.zybnet", and add
    # two named appenders: "goku" and "vegeta".
    # The first argument, "debug", is optional and specifies
    # the minimum level for the message to be logged
    log4j.logger.com.zybnet=debug, goku, vegeta
    
    # Declare the "goku" appender and define it
    log4j.appender.goku=org.apache.log4j.ConsoleAppender
    log4j.appender.goku.layout=org.apache.log4j.PatternLayout
    log4j.appender.goku.layout.ConversionPattern=[%-5p] %m%n
    
    # Declare the "vegeta" appender
    log4j.appender.vegeta=org.apache.log4j.RollingFileAppender
    log4j.appender.vegeta.layout=org.apache.log4j.HTMLLayout
    log4j.appender.vegeta.layout.Title=My fantastic app log
    log4j.appender.vegeta.File=/users/raffaele/desktop/main.log.html
    log4j.appender.vegeta.MaxFileSize=500KB


The code is quite well commented, you should intuitively understand what an "appender" is, what a "layout" is and how a named logger is created and configured. The only things that should be noted is that this file is interpreted by the `PropertyConfigurator` after the JavaBean standard: when you see `setSomething()` and `getSomething()` in the Javadoc, there is a property named Something that can be configured (examples are `vegeta.File` and `layout.ConversionPattern`). Remeber to traverse the Java class hierarchy to discover properties defined by superclasses.

Here is a sample Java demo which exercise the log4j API and also illustrates how to get a logger via a class name

    
    package com.zybnet;
    
    import java.io.FileNotFoundException;
    
    import org.apache.log4j.Logger;
    import org.apache.log4j.PropertyConfigurator;
    
    public class Main {
    
    	static Logger logger;
    
    	static {
    		logger = Logger.getLogger(Main.class);
    		PropertyConfigurator.configure(Main.class.getResource("log4j.properties"));
    	}
    
    	public static void main(String[] args) {
    		logger.debug("Just entered main");
    		logger.error(new FileNotFoundException("/home/foo/bar.txt"));
    		logger.warn(new Integer(12921));
    	}
    
    }


Here are some useful links:




	
    * [Manual](http://logging.apache.org/log4j/1.2/manual.html)

	
    * [PropertyConfigurator Javadoc](http://logging.apache.org/log4j/1.2/apidocs/index.html?org/apache/log4j/BasicConfigurator.html)

	
    * [PatternLayout](http://logging.apache.org/log4j/1.2/apidocs/index.html?org/apache/log4j/PatternLayout.html)



This is a quick reference to understand basic log4j usage. If one needs more specialized behavior, it can certainly understand the official doc itself ;)

To disable a logger you use `OFF` (it's kind of an undocumented log level)

    
    log4j.logger.com.example.VerboseCode=OFF


Todo: Often log4j is paired with slf4j and commons-logging. Explore these things.
