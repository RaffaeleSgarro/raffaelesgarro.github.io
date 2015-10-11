---
author: admin
comments: false
date: 2012-08-22 08:52:43+00:00
slug: mysql-recipes
title: MySQL Recipes
wordpress_id: 214
tags:
- mysql
---


	
  * Table management (create, alter table)

	
  * Foreign keys

	
  * UTF-8 as default character set

	
    * Know the actual column encoding




	
  * Variables

	
  * Useful tips

	
    * Easily reading query output wider than the terminal





<!--more-->





## System variables



    
    SHOW VARIABLES;
    # note here 'version' is the exact name
    SHOW VARIABLES LIKE 'version';
    # note _ (underscore) is a jolly for single character
    SHOW VARIABLES LIKE 'wait_timeout';
    SHOW VARIABLES LIKE '%character%';







## Vertical output for wide query results


End queries with `\G` instead of `;` (semicolon) produces a suitable output for tables with more than a few columns. Or you can add this line in `.bashrc`




    
    alias mysql='mysql --auto-vertical-output'







## Default to UTF-8


Set server character encoding and collation (will be inherited by databases, connection, tables and so on)

    
    [mysqld]
    collation-server=utf8_unicode_ci
    character-set-server=utf8


Every table has a character set and a collaction, which single column will inherit upon creation when no different value is specified [[link]](http://dev.mysql.com/doc/refman/5.1/en/charset-table.html)

    
    CREATE TABLE tbl_name (column_list)
        [[DEFAULT] CHARACTER SET charset_name]
        [COLLATE collation_name]]
    
    ALTER TABLE tbl_name
        [[DEFAULT] CHARACTER SET charset_name]
        [COLLATE collation_name]




## Know the actual column encoding



    
    SELECT character_set_name, collation_name
        FROM information_schema.columns
        WHERE table_schema = :DATABASE
            AND table_name = :TABLE
            AND column_name = :COLUMN;




## Foreign keys



    
    # In create table statement
     CREATE TABLE ORDER_ITEMS (
       PRODUCT_ID INT,
       QUANTITY DECIMAL(5,2),
       PRICE DECIMAL(5,2),
       ORDER_ID INT,
       FOREIGN KEY (`PRODUCT_ID`) REFERENCES `PRODUCTS`(`ID`) ON DELETE CASCADE ON UPDATE CASCADE
     );
     # In alter table
     ALTER TABLE `ORDER_ITEMS` ADD FOREIGN KEY (`ORDER_ID`) REFERENCES `ORDERS`(`ID`);
     # Remove the constraint
     ALTER TABLE `OTHER_TABLE` DROP FOREIGN KEY `0_38775`;


You can get the foreign key name via the `SHOW CREATE TABLE `OTHER_TABLE`` command. Remember the table engine must be InnoDB. [[Doc]](http://dev.mysql.com/doc/refman/5.5/en/innodb-foreign-key-constraints.html)
