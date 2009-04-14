/*
/////////////////////////////////////
	Prefs Object
/////////////////////////////////////	
*/
var Prefs = new Object();

// Object variables
Prefs.username;			  					   //Current username set
Prefs.password;								   //Current password set
Prefs.oldUsername;							   //Username before flip to back
Prefs.oldPassword;							   //Password before flip to back							
Prefs.keychainService = 'Gmail Inbox Widget';  //Name to  use for the keychain service

// idKey - Creates a key using the identifier unique to aparticular instance
//		   of the widget for storing information in the widget preferences and
//		   keychain.
Prefs.idKey = function(key)
{
	return key + ' (' + widget.identifier + ')';
}

// loadPrefs - Loads in preferences from the widget preference file and keychain.
Prefs.loadPrefs = function()
{
	if (window.widget && (widget.preferenceForKey(Prefs.idKey('username')) != null))
	{
		Prefs.username = widget.preferenceForKey(Prefs.idKey('username'));
		if(KeychainStore)
			Prefs.password = KeychainStore.getKeychain(Prefs.idKey(Prefs.keychainService), Prefs.username);
			
		//alert('Preferences Loaded!');
	}
}

// savePrefs - Saves preferences to the widget preference file and keychain.
Prefs.savePrefs = function()
{
	// If the old username or password is different from the current one
	// save the preferences to their proper locations.
	if(window.widget && !(Prefs.oldUsername == Prefs.username && Prefs.oldPassword == Prefs.password))
	{
		// The method used here for the keychain is very lazy, and will only be used
		// until I can fully figure out how to update keychains in the plugin.
		if(!(Prefs.oldUsername == null || Prefs.oldPassword == null))
			KeychainStore.deleteKeychain(Prefs.idKey(Prefs.keychainService), Prefs.oldUsername); 
		widget.setPreferenceForKey(Prefs.username, Prefs.idKey('username'));
		KeychainStore.saveKeychain(Prefs.idKey(Prefs.keychainService), Prefs.username, Prefs.password);
		
		//alert('Preferences Saved!');
	}
}

// deletePrefs - Deletes the preferences currently set.
Prefs.deletePrefs = function()
{
	if(window.widget)
	{
		widget.setPreferenceForKey(null, Prefs.idKey('username'));
	}
	
	if(KeychainStore)
	{
		KeychainStore.deleteKeychain(Prefs.idKey('Gmail Inbox Widget'), Prefs.username); 
	}
}

// fillFields - Fills the fields on the back of the widget.
Prefs.fillFields = function()
{
	if(Prefs.username != null)
		document.getElementById('userName').value = Prefs.username;
	if(Prefs.password != null)
		document.getElementById('passWord').value = Prefs.password;
}

// submitOnEnter - Makes the form on the back more accessible by allowing the 
//				   user to hit enter to flip the widget back to it's front side.
Prefs.submitOnEnter = function(event)
{
	var keycode;
	if (event) 
		keycode = event.which;

	if (keycode == 13)
	   showFront();
}

// getUsername - Returns the currently set username.
Prefs.getUsername = function()
{
	return Prefs.username;
}

// getPassword - Returns the currently set password.
Prefs.getPassword = function()
{
	return Prefs.password;
}
