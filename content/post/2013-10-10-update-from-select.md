---
author: admin
comments: false
date: 2013-10-10 19:19:38+00:00
slug: update-from-select
title: 'Derby: UPDATE FROM SELECT'
wordpress_id: 371
tags:
- derby
- sql
---

Derby doesn't support the MS proprietary `UPDATE FROM SELECT`, nor does it support the SQL standard `MERGE`
so I had to write the following script to update a table from values retrieved from a select.
It uses a temporary table and a subquery in the SET clause. I had to add an index to the temporary table to speed up things:

<!--more-->
    
```sql
    -- store data in a temporary table
    create table tmp (account_id, last_visit_date) as
    select f.account_id, max(f.fact_date)
    from fact f join account a on f.account_id = a.id
    group by f.account_id
    with no data
    ;
    
    insert into tmp select f.account_id, max(f.fact_date)
    from fact f join account a on f.account_id = a.id
    group by f.account_id
    ;
    
    create unique index tmp_idx_1
    on tmp (account_id);
    
    update account
    set
    last_visit_date = (
      select last_visit_date
      from tmp
      where tmp.account_id = account.id
    )
    ;
    
    -- clear the temporary table
    drop table tmp;
```

Note the derby baroque syntax for loading a table from a select. Other dialects simply allow `SELECT [Query] AS [TableName]`
