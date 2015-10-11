---
author: admin
comments: false
date: 2012-04-15 22:07:13+00:00
slug: my-odssey-in-vtiger-crm
title: My odyssey in vTiger CRM
wordpress_id: 81
tags:
- crm
- javascript
- php
- smarty
- vtiger
---

The problem: replace a popup with an Ajax autocomplete. In vTiger a Contact belongs to an organisation (called an Account), so the typical UI for a Contact shows both the Contact's data (name, email, phone number) and the Account data (ship address, bill address and so on). If you happen to switch the organisation this Contact belongs to (maybe because you entered the wrong one) you have to click an icon, which opens a new browser window and lets you choose the new Account. When you pick one, the popup is closed and the data are sent back to `window.opener.form`. A more user-friendly UI, of course, is the autocompleter.<!--more-->

An autocompleter is a bit of Javascript that asynchronously retrieves and displays matching records while the user is typing. The database is exposed via webservices.

First problem: vTiger includes Prototype, jQuery 1.2 and jQuery 1.6. In the Javascript namespace `$()` is for Prototype, `jQuery()` is for 1.2 and ... well 1.6 is not reachable. I wanted to use chosen.js for the autocomplete, but both Prototype and jQuery are too old. So I switched to jQuery UI, which has a nice autocomplete, but it requires at least jQuery 1.3.2. I had to import a new jQuery version, made it available via `jQuery172()` and manually assign this to jQuery UI, by two or three trivial modifications to the source js.

vTiget has a nice JSON REST API, but it's very difficult to access with AJAX, because you need an authentication token that is generated after two calls: one asks the server for a challenge, and one gets the auth token. Obviously I can't make two calls before every Ajax operation: the token must be available on the server side, so I can generate the appropriate javascript calls. Accessing the webservices with the current logged in user does not work (neither via cookies nor via `SESSIONID` in GET parameters). vTiger is not documented at all, so I had to manually dig into the sources, and work with my XDebug. I added the method `getWebServiceSessionName()` to the User API. It is intended to be used in Smarty to provide a Javascript variable `ws_session_name`. The logic is straightforward: cache the previously generated token, see if it's still valid, and if it's not, generate a new one. It took me quite some time to get this part to work, because nothing is documented, especially that I had to create a new `Session`. Anyway this is what I added to `modules/Users/Users.php`

    
    var $ws_session_name = false;
    var $ws_access_key = false; // this is the md5(token . accessKey)
    
    public function getWebServiceSessionName() {
        $isStillValid = false;
        
        try {
            // README: this is actually silly. ws_access_key must be stored in the db
            // and retrieved at User creation time
            $user = vtws_login($this->user_name, $this->ws_access_key);
            if ($user != null)
                $isStillValid = true;
            } catch (Exception $e) {
               // nothing really here
        }
        
        if ($isStillValid) {
            return $this->ws_session_name;
        }
    
        $challenge = vtws_getchallenge($this->user_name);
        $token = $challenge["token"];
    
        $this->ws_access_key = md5($token . $this->accesskey);
        $params = array(
        "username" => $this->user_name,
        "accessKey" => $this->ws_access_key
        );
        $sessionManager = new SessionManager();
        $sessionManager->startSession(null, false);
        $operationManager = new OperationManager($this->db, "login", "json", $sessionManager);
    
        $loginResult = $operationManager-&gt;runOperation($params, $this);
        $this->ws_session_name = $loginResult["sessionName"];
        // TODO save $this->ws_session_name in the database
        return $this->ws_session_name;
    }


Then the appropriate Javascript and markup must be generated. This is very specific to my implementation (and I also think I didn't place my code in the right place, so I'll have to talk to someone at vTiger) anyway I put the HTML includes in the template `Smarty/templates/salesEditView.tpl`

    
    <!-- This provides a jQuery172() for autocomplete -->
    <script type="text/javascript" src="include/js/jquery172-ui-autocomplete.js"></script>
    <script type="text/javascript">
      {*This value will be used in Contact.js to authenticate the ajax search request*}
      ws_session_name = "{php}global $current_user; echo $current_user->getWebServiceSessionName();{/php}"
    </script>
    <link rel="stylesheet" type="text/css" href="include/js/jquery172-css/ui-lightness/jquery-ui-1.8.18.custom.css" />


And modified the Smarty/template/EditViewUI.tpl to replace the old buttons and inputs with the new one

    
    <!-- this is really the organisation ID and is accessed in JS with form.account_id -->
    <input name="{$fldname}" type="hidden" value="{$secondvalue}">
    <input id="account_name" name="account_name" style="border:1px solid #bababa;" type="text" value="{$fldvalue}" />


Finally, the Javascript part. This is quiiiite eaaasy because jQuery UI is waaaay more documented than vTiger and there is really nothing special to this project. I appended my implementations in modules/Contacts/Contacts.js I think this is not really the right place for reuse and DRY, but just wanted to make things work until I get more focused on the big picture.

    
    // This is the database of accounts built with the AJAX
    // request fired by autocomplete
    ws_accounts = [];
    
    (function($) {
    	$(function() {
    		$("#account_name").autocomplete({
    			minLength: 3,
    			source: function(request, response) {
    				// request.term contains the search term
    				$.getJSON("webservice.php", {
    					operation: "query",
    					sessionName: ws_session_name,
    					query: "select * from Accounts where accountname like '%" + request.term + "%' limit 20;"
    				}, function(json) {
    					if (json.success === false || (json.success === true && json.result.length == 0)) {
    						response([{label: "No matching item", value: -1}]);
    						return;
    					}
    					ws_accounts = json.result;
    					var result = json.result.map(function(record){
    						return {label: record.accountname, value: record.id};
    					});
    					response(result);
    				});
    			},
    			focus: function(event, ui) {
    				event.preventDefault();
    				event.target.value = ui.item.label;
    			},
    			select: function(event, ui) {
    				// use ws_accounts data to call set_return_contact_address
    				event.preventDefault();
    				event.target.value = ui.item.label;
    				ws_accounts.each(function(account) {
    					if (ui.item.value == account.id) {
    						var form = document.forms["EditView"];
    						// account.id is 11x23, or 11x64 or 11x2
    						// the first part is the identifier of the Account entity
    						// the second is the ID of the specific account
    						console.log(form.account_id);
    						form.account_id.value = /\d+x(\d+)/.exec(account.id)[1];
    
    						// Damnit.. why do they call them in a thousand different ways???
    						form.mailingstreet.value = account.bill_street  || "";
    						form.otherstreet.value   = account.other_street || "";
    						form.mailingcity.value   = account.bill_city    || "";
    						form.othercity.value     = account.ship_city    || "";
    						form.mailingstate.value  = account.bill_state   || "";
    						form.otherstate.value    = account.ship_state   || "";
    						form.mailingzip.value    = account.bill_code    || "";
    						form.otherzip.value      = account.ship_code    || "";
    						form.mailingcountry.value= account.bill_country || "";
    						form.othercountry.value  = account.ship_country || "";
    						form.mailingpobox.value  = account.bill_pobox   || "";
    						form.otherpobox.value    = account.ship_pobox   || "";
    
    						return false;
    					}
    				});
    			}
    		});
    	});
    })(jQuery172);




A screenshot

[![](http://zybnet.com/wordpress/wp-content/uploads/vtiger-autocomplete.png)](http://zybnet.com/wordpress/wp-content/uploads/vtiger-autocomplete.png)

This implementation in broken in a number of ways, since it's only a reference for my future work. For example, the session key should be cached in the database to avoid creating a new `Session` for each new request. The Javascript should attempt to guess the name of the account_id form field, because in Smarty it's defined as `$fldName`. The script itself should not be placed in Contacts.js, because it assumes a `#account_name` element which is not guaranteed to exist in all pages which include the script. And there are certainly more flaws, but this post is only intended as proof of concept and as a technical reference.
