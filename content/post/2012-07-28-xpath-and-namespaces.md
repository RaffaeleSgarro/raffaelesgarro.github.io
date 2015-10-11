---
author: admin
comments: false
date: 2012-07-28 11:45:58+00:00
slug: xpath-and-namespaces
title: XPath and namespaces
wordpress_id: 210
tags:
- java
- xml
- xpath
---

Let's consider the following XML

    
    <?xml version="1.0" encoding="UTF-8"?>
    <notes>
       <note>
          <heading>Remember the milk</heading>
          <body>Don't forget me this weekend!</body>
       </note>
       <note>
          <heading>Call Anna</heading>
          <body>Don't forget me this weekend!</body>
       </note>
       <note>
          <heading>Feed the trolls</heading>
          <body>Don't forget me this weekend!</body>
       </note>
       <note>
          <heading>Hooray!</heading>
          <body>Don't forget me this weekend!</body>
       </note>
    </notes>


<!--more-->And the following Java program:

    
    NodeList notes = (NodeList) xpath.evaluate("//note/heading/text()",
    	builder.parse(ColladaXPath.class.getResourceAsStream("notes.xml")),
    	XPathConstants.NODESET);
    
    for (int i = 0; i < notes.getLength(); i++) {
    	System.out.println(notes.item(i).getNodeValue());
    }


Everything works fine until one adds the infamous `xmlns` attribute to the root element. At this point, XPath won't be able to find anything without a `prefix`, so we'll have to change the XPath expression to something like

    
    //n:note/n:heading/text()


Note that the `n:` prefix does not need to appear in the source XML. It is used on the XPath side and mapped to a xmlns with a subclass of `javax.xml.namespace.NamespaceContext`:

    
    class NotesNamespaceCtx implements NamespaceContext {
    	public String getNamespaceURI(String prefix) {
    		return "foobarbaz";
    	}
    
    	public String getPrefix(String namespaceURI) {
    		return "n";
    	}
    
    	public Iterator<?> getPrefixes(String namespaceURI) {
    		return null;
    	}
    }


The String returned by `getNamespaceURI()` must be the value of xmlnls. In this case it's `xmlns="foobarbaz"`. Here is a full implementation (it needs [Guava](http://code.google.com/p/guava-libraries/) to be compiled and run)

    
    package com.zybnet;
    
    import java.util.Iterator;
    
    import javax.xml.namespace.NamespaceContext;
    import javax.xml.parsers.DocumentBuilder;
    import javax.xml.parsers.DocumentBuilderFactory;
    import javax.xml.parsers.ParserConfigurationException;
    import javax.xml.xpath.XPath;
    import javax.xml.xpath.XPathConstants;
    import javax.xml.xpath.XPathFactory;
    
    import org.w3c.dom.NodeList;
    
    import com.google.common.collect.BiMap;
    import com.google.common.collect.HashBiMap;
    
    public class ColladaXPath {
    
    	public static void main(String[] args) throws Exception {
    		NodeList notes = (NodeList) xpath.evaluate("//n:note/n:heading/text()",
    				builder.parse(ColladaXPath.class.getResourceAsStream("notes.xml")),
    				XPathConstants.NODESET);
    
    		for (int i = 0; i < notes.getLength(); i++) {
    			System.out.println(notes.item(i).getNodeValue());
    		}
    
    	}
    
    	static XPath xpath;
    	static DocumentBuilder builder;
    
    	static {
    		DocumentBuilderFactory domFactory = DocumentBuilderFactory.newInstance();
    		domFactory.setNamespaceAware(true); // !IMPORTANT
    
    		try {
    			builder = domFactory.newDocumentBuilder();
    		} catch (ParserConfigurationException e) {
    			e.printStackTrace();
    		}
    
    		xpath = XPathFactory.newInstance().newXPath();
    		NamespaceCtxImpl ns = new NamespaceCtxImpl();
    		ns.register("n", "foobarbaz");
    		xpath.setNamespaceContext(ns);
    	}
    
    	private static class NamespaceCtxImpl implements NamespaceContext {
    		private BiMap<String, String> xmlns = HashBiMap.create();
    
    		public void register(String prefix, String uri) {
    			xmlns.put(prefix, uri);
    		}
    
    		@Override
    		public String getNamespaceURI(String prefix) {
    			return xmlns.get(prefix);
    		}
    
    		@Override
    		public String getPrefix(String namespaceURI) {
    			return xmlns.inverse().get(namespaceURI);
    		}
    
    		@Override
    		public Iterator<String> getPrefixes(String namespaceURI) {
    			return xmlns.keySet().iterator();
    		}
    	}
    }
