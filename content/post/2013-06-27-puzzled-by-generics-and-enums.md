---
author: admin
comments: false
date: 2013-06-27 20:01:08+00:00
slug: puzzled-by-generics-and-enums
title: Puzzled by generics and enums
wordpress_id: 328
tags:
- enums
- generics
- java
---

I had to write a method which, given an `Enum` class, returned the set of values. First signature attempt:

    
    public Set<Enum<?>> getValuesForEnum(Class<Enum<?>> klass);


Unfortunately this doesn't work. When you try to invoke this method you got the error:

    
    getValuesForEnum() can't be applied to "name.of.the.Enum"



<!--more-->

Let's say we have an enum named `com.example.MyEnum`. The compiler complains because `MyEnum.class` is not a subtype of `Class<Enum<?>>`. Can you spot the error? Nested type parameters are always tricky to deal with. In this case I had to perform the following reasoning:

`A<Y>` is a subtype of `A<X>` if ... well this never happens! For the subtype relationship to exist, wildcard must come into play, and there are no wildcards here. Except, well, there is a wildcard indeed: `Enum<?>`! Unfortunately it's in the wrong place. We have:



	
  * `Class<Enum<?>>`

	
  * `Class<MyEnum>`


To fix this problem the signature needs to be:

    
    public Set<Enum<?>> getValuesForEnum( Class<? extends Enum<?>> klass);


Generics are invariant in Java: a `List<String>` can't be used where a `List<Object>` is expected, regardless of the subtype relation between String and Object. It's not different in this case: just that we don't have String and Object, but `Enum<?>` and `Enum<MyEnum>`. There exists a subtype relation between the two arguments, but it's irrelevant because our `X` is `Enum<?>`, so it's not a wildcard.

What puzzled me is that it's a generic type and the type argument happens to be a wildcard.
