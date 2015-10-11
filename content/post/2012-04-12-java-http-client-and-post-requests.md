---
author: admin
comments: false
date: 2012-04-12 15:48:41+00:00
slug: java-http-client-and-post-requests
title: Java HTTP client and POST requests
wordpress_id: 73
tags:
- http
- java
---

Apache HttpClient's site is poorly designed, so the documentation is difficult to find and it also assumes you have some confidence with HTTP. So, first things first, [this is the link](http://hc.apache.org/httpcomponents-client-ga/index.html) to the project, and [here is the official tutorial](http://hc.apache.org/httpcomponents-client-ga/tutorial/html/). (BTW, you'll often see GA which stands for General Availability - ie a public release)<!--more-->

On the left pane, they say there are three modules: HttpClient, HttpMime and HttpClient Cache. I never used the Cache module myself, but the other two are available in the libs folder [of the archive](http://hc.apache.org/downloads.cgi) - often the javascript for choosing the mirror server is broken, so you have to manually type the hostname yourself in the browser. Inside the lib directory of the archive there are 5 jars needed for a HTTP client capable  of doing our POST requests:



	
  1. httpclient

	
  2. httpcore (required by httpclient, contains classes in org.apache.http.entity for example)

	
  3. httpmime

	
  4. mime-4j (required by httpmime I guess)

	
  5. commons-logging


This is the basic workflow:

	
  1. construct a HttpPost, providing a URL and an HttpEntity (StringEntity, FileEntity or the full featured [MultipartEntity](http://hc.apache.org/httpcomponents-core-ga/httpcore/apidocs/org/apache/http/HttpEntity.html))

	
  2. configure a [HttpClient](http://hc.apache.org/httpcomponents-client-ga/httpclient/apidocs/org/apache/http/client/HttpClient.html) and execute the POST method created at step 1

	
  3. examine the StatusLine of the HttpResponse just returned from step 2

	
  4. Consume the HttpEntity given by the HttpResponse


This is the reference link [for logging configuration](http://hc.apache.org/httpcomponents-client-ga/logging.html)



    
    public class Main {
    
    	public static void main(String[] args) throws ClientProtocolException, IOException {
    		// 1. construct the multipart entity of the post request
    		MultipartEntity multipart = new MultipartEntity();
    		multipart.addPart("a_number", new StringBody("12345"));
    		multipart.addPart("a_string", new StringBody("Lorem ipsum"));
    		multipart.addPart("an_array[]", new StringBody("element 1"));
    		multipart.addPart("an_array[]", new StringBody("element 2"));
    		String resourceName = "lorem_ipsum.txt";
    		multipart.addPart("a_file", new InputStreamBody(
    				Main.class.getResourceAsStream(resourceName),
    				"text/plain",
    				resourceName));
    
    		// 2. create the post request
    		HttpPost post = new HttpPost("http://w.zybnet.com/test/post_from_java.php");
    		post.setEntity(multipart);
    
    		// 3. execute the post method
    		HttpClient client = new DefaultHttpClient();
    		HttpResponse response = client.execute(post);
    
    		// 4. read the response
    		HttpEntity entity = response.getEntity();
    		System.out.println(response.getStatusLine().toString());
    		BufferedReader reader = new BufferedReader(new InputStreamReader(entity.getContent()));
    		String line = null;
    		while ((line = reader.readLine()) != null)
    			System.out.println(line);
    		reader.close();
    	}
    
    }






This is a common debug session:


    
    [DEBUG] SingleClientConnManager - Get connection for route HttpRoute[{}->http://w.zybnet.com]
    [DEBUG] RequestAddCookies - CookieSpec selected: best-match
    [DEBUG] DefaultHttpClient - Attempt 1 to execute request
    [DEBUG] DefaultClientConnection - Sending request: POST /test/post_from_java.php HTTP/1.1
    [DEBUG] wire - >> "POST /test/post_from_java.php HTTP/1.1[EOL]"
    [DEBUG] wire - >> "Transfer-Encoding: chunked[EOL]"
    [DEBUG] wire - >> "Content-Type: multipart/form-data; boundary=irl07RcWWX5xEGtgFYJo5-mnA168uOtnQ[EOL]"
    [DEBUG] wire - >> "Host: w.zybnet.com[EOL]"
    [DEBUG] wire - >> "Connection: Keep-Alive[EOL]"
    [DEBUG] wire - >> "User-Agent: Apache-HttpClient/4.0.1 (java 1.5)[EOL]"
    [DEBUG] wire - >> "Expect: 100-Continue[EOL]"
    [DEBUG] wire - >> "[EOL]"
    [DEBUG] headers - >> POST /test/post_from_java.php HTTP/1.1
    [DEBUG] headers - >> Transfer-Encoding: chunked
    [DEBUG] headers - >> Content-Type: multipart/form-data; boundary=irl07RcWWX5xEGtgFYJo5-mnA168uOtnQ
    [DEBUG] headers - >> Host: w.zybnet.com
    [DEBUG] headers - >> Connection: Keep-Alive
    [DEBUG] headers - >> User-Agent: Apache-HttpClient/4.0.1 (java 1.5)
    [DEBUG] headers - >> Expect: 100-Continue
    [DEBUG] wire - << "HTTP/1.1 100 Continue[EOL]"
    [DEBUG] wire - << "[EOL]"
    [DEBUG] DefaultClientConnection - Receiving response: HTTP/1.1 100 Continue
    [DEBUG] headers - << HTTP/1.1 100 Continue
    [DEBUG] wire - >> "a7[EOL]"
    [DEBUG] wire - >> "--irl07RcWWX5xEGtgFYJo5-mnA168uOtnQ[\r][\n]"
    [DEBUG] wire - >> "Content-Disposition: form-data; name="a_number"[\r][\n]"
    [DEBUG] wire - >> "Content-Type: text/plain; charset=UTF-8[\r][\n]"
    [DEBUG] wire - >> "Content-Transfer-Encoding: 8bit[\r][\n]"
    [DEBUG] wire - >> "[\r][\n]"
    [DEBUG] wire - >> "12345"
    [DEBUG] wire - >> "[EOL]"
    [DEBUG] wire - >> "af[EOL]"
    [DEBUG] wire - >> "[\r][\n]"
    [DEBUG] wire - >> "--irl07RcWWX5xEGtgFYJo5-mnA168uOtnQ[\r][\n]"
    [DEBUG] wire - >> "Content-Disposition: form-data; name="a_string"[\r][\n]"
    [DEBUG] wire - >> "Content-Type: text/plain; charset=UTF-8[\r][\n]"
    [DEBUG] wire - >> "Content-Transfer-Encoding: 8bit[\r][\n]"
    [DEBUG] wire - >> "[\r][\n]"
    [DEBUG] wire - >> "Lorem ipsum"
    [DEBUG] wire - >> "[EOL]"
    [DEBUG] wire - >> "af[EOL]"
    [DEBUG] wire - >> "[\r][\n]"
    [DEBUG] wire - >> "--irl07RcWWX5xEGtgFYJo5-mnA168uOtnQ[\r][\n]"
    [DEBUG] wire - >> "Content-Disposition: form-data; name="an_array[]"[\r][\n]"
    [DEBUG] wire - >> "Content-Type: text/plain; charset=UTF-8[\r][\n]"
    [DEBUG] wire - >> "Content-Transfer-Encoding: 8bit[\r][\n]"
    [DEBUG] wire - >> "[\r][\n]"
    [DEBUG] wire - >> "element 1"
    [DEBUG] wire - >> "[EOL]"
    [DEBUG] wire - >> "af[EOL]"
    [DEBUG] wire - >> "[\r][\n]"
    [DEBUG] wire - >> "--irl07RcWWX5xEGtgFYJo5-mnA168uOtnQ[\r][\n]"
    [DEBUG] wire - >> "Content-Disposition: form-data; name="an_array[]"[\r][\n]"
    [DEBUG] wire - >> "Content-Type: text/plain; charset=UTF-8[\r][\n]"
    [DEBUG] wire - >> "Content-Transfer-Encoding: 8bit[\r][\n]"
    [DEBUG] wire - >> "[\r][\n]"
    [DEBUG] wire - >> "element 2"
    [DEBUG] wire - >> "[EOL]"
    [DEBUG] wire - >> "25e[EOL]"
    [DEBUG] wire - >> "[\r][\n]"
    [DEBUG] wire - >> "--irl07RcWWX5xEGtgFYJo5-mnA168uOtnQ[\r][\n]"
    [DEBUG] wire - >> "Content-Disposition: form-data; name="a_file"; filename="lorem_ipsum.txt"[\r][\n]"
    [DEBUG] wire - >> "Content-Type: text/plain[\r][\n]"
    [DEBUG] wire - >> "Content-Transfer-Encoding: binary[\r][\n]"
    [DEBUG] wire - >> "[\r][\n]"
    [DEBUG] wire - >> " Lorem ipsum dolor sit amet, consectetur adipisici elit, sed eiusmod tempor incidunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquid ex ea commodi consequat. Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint obcaecat cupiditat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum"
    [DEBUG] wire - >> "[EOL]"
    [DEBUG] wire - >> "29[EOL]"
    [DEBUG] wire - >> "[\r][\n]"
    [DEBUG] wire - >> "--irl07RcWWX5xEGtgFYJo5-mnA168uOtnQ--[\r][\n]"
    [DEBUG] wire - >> "[EOL]"
    [DEBUG] wire - >> "0[EOL]"
    [DEBUG] wire - >> "[EOL]"
    [DEBUG] wire - << "HTTP/1.1 200 OK[EOL]"
    [DEBUG] wire - << "Date: Thu, 12 Apr 2012 15:43:20 GMT[EOL]"
    [DEBUG] wire - << "Server: Apache/2.2.20 (Ubuntu)[EOL]"
    [DEBUG] wire - << "X-Powered-By: PHP/5.3.6-13ubuntu3.6[EOL]"
    [DEBUG] wire - << "Vary: Accept-Encoding[EOL]"
    [DEBUG] wire - << "Content-Length: 442[EOL]"
    [DEBUG] wire - << "Keep-Alive: timeout=5, max=100[EOL]"
    [DEBUG] wire - << "Connection: Keep-Alive[EOL]"
    [DEBUG] wire - << "Content-Type: text/html[EOL]"
    [DEBUG] wire - << "[EOL]"
    [DEBUG] DefaultClientConnection - Receiving response: HTTP/1.1 200 OK
    [DEBUG] headers - << HTTP/1.1 200 OK
    [DEBUG] headers - << Date: Thu, 12 Apr 2012 15:43:20 GMT
    [DEBUG] headers - << Server: Apache/2.2.20 (Ubuntu)
    [DEBUG] headers - << X-Powered-By: PHP/5.3.6-13ubuntu3.6
    [DEBUG] headers - << Vary: Accept-Encoding
    [DEBUG] headers - << Content-Length: 442
    [DEBUG] headers - << Keep-Alive: timeout=5, max=100
    [DEBUG] headers - << Connection: Keep-Alive
    [DEBUG] headers - << Content-Type: text/html
    [DEBUG] DefaultHttpClient - Connection can be kept alive for 5000 ms
    [DEBUG] wire - << "array(3) {[\n]"
    [DEBUG] wire - << "  ["a_number"]=>[\n]"
    [DEBUG] wire - << "  string(5) "12345"[\n]"
    [DEBUG] wire - << "  ["a_string"]=>[\n]"
    [DEBUG] wire - << "  string(11) "Lorem ipsum"[\n]"
    [DEBUG] wire - << "  ["an_array"]=>[\n]"
    [DEBUG] wire - << "  array(2) {[\n]"
    [DEBUG] wire - << "    [0]=>[\n]"
    [DEBUG] wire - << "    string(9) "element 1"[\n]"
    [DEBUG] wire - << "    [1]=>[\n]"
    [DEBUG] wire - << "    string(9) "element 2"[\n]"
    [DEBUG] wire - << "  }[\n]"
    [DEBUG] wire - << "}[\n]"
    [DEBUG] wire - << "array(1) {[\n]"
    [DEBUG] wire - << "  ["a_file"]=>[\n]"
    [DEBUG] wire - << "  array(5) {[\n]"
    [DEBUG] wire - << "    ["name"]=>[\n]"
    [DEBUG] wire - << "    string(15) "lorem_ipsum.txt"[\n]"
    [DEBUG] wire - << "    ["type"]=>[\n]"
    [DEBUG] wire - << "    string(10) "text/plain"[\n]"
    [DEBUG] wire - << "    ["tmp_name"]=>[\n]"
    [DEBUG] wire - << "    string(14) "/tmp/phpk7ljPt"[\n]"
    [DEBUG] wire - << "    ["error"]=>[\n]"
    [DEBUG] wire - << "    int(0)[\n]"
    [DEBUG] wire - << "    ["size"]=>[\n]"
    [DEBUG] wire - << "    int(429)[\n]"
    [DEBUG] wire - << "  }[\n]"
    [DEBUG] wire - << "}[\n]"
    [DEBUG] SingleClientConnManager - Releasing connection org.apache.http.impl.conn.SingleClientConnManager$ConnAdapter@6fa9fc
