/*
/////////////////////////////////////
	Gmail Object
/////////////////////////////////////	
*/
var Gmail = new Object();

Gmail.authToken;

// authenticateUser - Sends username and password to the server and returns
//					  and retrieves the sid and lsid values for getting an
//					  authentication token.
Gmail.authenticateUser = function()
{	
	Gmail.showSpinner(true);
	Gmail.makeNumberClickable(false);
	var req = new XMLHttpRequest();
	req.onload = function(e) { Gmail.authCallback(e, req) };
	req.setRequestHeader('Cache-Control', 'no-cache');
	req.open('POST', 'https://www.google.com/accounts/ClientAuth');
	req.send('Email=' + Prefs.getUsername() + '&Passwd=' + escape(Prefs.getPassword()));
}

// setAuthenticationToken - Retrieves an authentication token based on the sid
//						    and lsid sent to the server.
Gmail.setAuthenticationToken = function(sid, lsid)
{
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(e) { Gmail.tokenCallback(e, req) };
	req.setRequestHeader('Cache-Control', 'no-cache');
	req.open('POST', 'https://www.google.com/accounts/IssueAuthToken');
	req.send(sid + '&' + lsid + '&service=mail');
}
// checkMail - Retrieves the XML feed
Gmail.checkMail = function()
{
	var req = new XMLHttpRequest();
	req.onreadystatechange = function(e) { Gmail.checkCallback(e, req) };
	req.setRequestHeader('Cache-Control', 'no-cache');
	req.open('GET', 'https://mail.google.com/mail/feed/atom/?auth=' + Gmail.authToken + '&client=gmailinboxwidget');
	req.send(null);
}	


/*
/////////////////////////////////////
	Gmail Object Callback Methods
/////////////////////////////////////	
*/
Gmail.authCallback = function(e, request)
{
	if (request.readyState == 4) 
	{
  		if (request.status == 200) 
  		{
  			//alert('User Partially Authenticated!');
			var theIDs = request.responseText.split('\n');
			Gmail.setAuthenticationToken(theIDs[0], theIDs[1]);
    	} else {
    		//alert('Error: Problem authenticating user!');
    		Gmail.setNumber('~');
    		Gmail.setNewMailIndicator('~');
    		Gmail.showSpinner(false);
    	}
  	}
}
Gmail.tokenCallback = function(e, request)
{
	if (request.readyState == 4) 
	{
  		if (request.status == 200) 
  		{
			//alert('User Authenticated!');
			Gmail.authToken = request.responseText;
			Gmail.checkMail();
    	} else {
    		//alert('Error: Problem authenticating user!');
    		Gmail.setNumber('~');
    		Gmail.setNewMailIndicator('~');
    		Gmail.showSpinner(false);
    	}
  	}
}
Gmail.checkCallback = function(e, request)
{
	if (request.readyState == 4) 
	{
  		if (request.status == 200) 
  		{
  			//alert('Mail Checked!');
			var theCount = request.responseXML.getElementsByTagName('fullcount')[0].firstChild.data;
			Gmail.setNumber(theCount);
    		Gmail.setNewMailIndicator(theCount);
			Gmail.makeNumberClickable(true);
			Gmail.showSpinner(false);
    	} else {
    		//alert('Error: Problem retrieving feed!');
    		Gmail.setNumber('~');
    		Gmail.setNewMailIndicator('~');
    		Gmail.showSpinner(false);
    	}
  	}
}


/*
/////////////////////////////////////
	Gmail Object Misc Front Stuff
/////////////////////////////////////	
*/
Gmail.setNumber = function(newValue)
{
	var theNumber = document.getElementById('number');
	theNumber.innerText = newValue;
	if(newValue > 99) {
		theNumber.style.paddingTop = '14px';
		theNumber.style.paddingLeft = '0';
		theNumber.style.fontSize = '90%';
	} else if(newValue > 19) {
		theNumber.style.paddingTop = '15px';
		theNumber.style.paddingLeft = '1px';
		theNumber.style.fontSize = '120%';
	} else if(newValue <= 19) {
		theNumber.style.paddingTop = '15px';
		theNumber.style.paddingLeft = '0';
		theNumber.style.fontSize = '120%';
	} else {
		theNumber.style.paddingTop = '13px';
		theNumber.style.paddingLeft = '0';
		theNumber.style.fontSize = '120%';
	}
}
Gmail.setNewMailIndicator = function(mailCount)
{
	if(mailCount > 0) {
		document.getElementById('numberWrapper').style.backgroundImage = 'url(Images/mail.png)';
	} else {
		document.getElementById('numberWrapper').style.backgroundImage = 'url(Images/nomail.png)';
	}
}
Gmail.makeNumberClickable = function(toggle)
{
	if(toggle) 
	{
		document.getElementById('number').onclick = function(event)
		{
			if(window.widget)
				widget.openURL('https://mail.google.com/mail/?auth=' + Gmail.authToken);
		}
	} else {
		document.getElementById('number').onclick = null;
	}
}
Gmail.showSpinner = function(toggle)
{
	if(toggle)
		document.getElementById('loading').style.display = 'block';
	else
		document.getElementById('loading').style.display = 'none';
}
