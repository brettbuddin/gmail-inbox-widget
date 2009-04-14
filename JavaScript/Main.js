/*
/////////////////////////////////////
	Gmailplugin Check
/////////////////////////////////////	
*/
if(!KeychainStore)
{
	alert("Plugin Not Loaded!");
}


/*
/////////////////////////////////////
	Event Methods
/////////////////////////////////////	
*/

var timer = null;		// Refresh timer
var flipTimer = null;	// Timer for the auto-flip
var firstLoaded = true;

if (window.widget) 
{
    widget.onshow = onShow;
    widget.onhide = onHide;
    widget.onremove = onRemove;
}

// onShow - Checks the mail and assigns the refresh timer to continue checking every 2 minutes.
function onShow() 
{
	if (timer == null) 
	{
		if(!firstLoaded && !(Prefs.username == null || Prefs.password == null || Prefs.username == '' || Prefs.password == ''))
		{
			Gmail.authenticateUser();
			timer = setInterval('Gmail.authenticateUser();', 2*60000);
		}
	}
}

// onHide - Clears the refresh timer when the widget is hidden.
function onHide()
{
    if (timer != null) 
    {
		clearInterval(timer);
		timer = null;
    }
}

// onRemove - Deletes the currently set preferences and clears the refresh timer
//			  when the widget is closed.
function onRemove() 
{
	Prefs.deletePrefs();
	if (timer != null) 
	{
        clearInterval(timer);
        timer = null;
    }
}

// loaded - Initialization process for the widget.
function loaded()
{
	// Load the preferences
	Prefs.loadPrefs();
	
	// If no username or password set, automatically flip the widget over
	// after 1.5 seconds, or check the mail
	if(Prefs.username == null || Prefs.password == null || Prefs.username == '' || Prefs.password == '') {
		flipTimer = setInterval('showBack(event);', 1500);
		firstLoaded = false;
	} else {
		Gmail.authenticateUser();
		firstLoaded = false;
	}
}

// goToProjectPage - Opens a url to the widget's project page.
function goToProjectPage() 
{
	if(window.widget)
		widget.openURL('http://intraspirit.net/gmailinbox/');
}

// showBack - Flips the widget to show the backside.
function showBack(event)
{
	if (flipTimer != null) 
	{
        clearInterval(flipTimer);
        flipTimer = null;
    }
    
    document.getElementById('userName').focus();
	var front = document.getElementById('front');
	var back = document.getElementById('back');
	
	Prefs.fillFields();
	Prefs.oldUsername = Prefs.username;
	Prefs.oldPassword = Prefs.password;
	
	if (window.widget)
		widget.prepareForTransition('ToBack');
	
	front.style.display='none';
	back.style.display='block';
	
	if (window.widget) 
	{
		setTimeout ('widget.performTransition();', 0);
	}

	document.getElementById('fliprollie').style.display = 'none';
}

// showFront - Flips the widget to show the frontside.
function showFront()
{
	var front = document.getElementById('front');
	var back = document.getElementById('back');
	Prefs.username = document.getElementById('userName').value;
	Prefs.password = document.getElementById('passWord').value;
	
	if (window.widget)
	{
		Prefs.savePrefs();
		if(!(Prefs.username == null || Prefs.password == null || Prefs.username == '' || Prefs.password == ''))
			Gmail.authenticateUser();
		else {
			Gmail.setNumber('~');
    		Gmail.setNewMailIndicator('~');
    	}
		widget.prepareForTransition('ToFront');
	}
	
	front.style.display='block';
	back.style.display='none';
	
	if (window.widget)
		setTimeout ('widget.performTransition();', 0);
	
	Prefs.oldUsername = null;
	Prefs.oldPassword = null;
}
