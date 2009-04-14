//
//  File: SaveLogin.m
//  Project: Gmailplugin
//  Author: Brett C. Buddin (brett@intraspirit.net)
//

#import "SaveLogin.h"


@implementation SaveLogin

-(id)initWithWebView:(WebView*)w {
	self = [super init];
	srand(time(NULL));
	return self;
}

-(void)dealloc {
	[super dealloc];
}

-(void)windowScriptObjectAvailable:(WebScriptObject*)login {
	[login setValue:self forKey:@"KeychainStore"];
}

+(NSString*)webScriptNameForSelector:(SEL)aSel {
	NSString *retval = nil;

	if (aSel == @selector(saveKeychain:forUsername:withPass:)) {
		retval = @"saveKeychain";
	} else if (aSel == @selector(getKeychain:forUsername:)) {
		retval = @"getKeychain";
	} else if (aSel == @selector(deleteKeychain:forUsername:)) {
		retval = @"deleteKeychain";
	} else if (aSel == @selector(updateKeychain:forUsername:withNewUsername:withNewPassword:)) {
		retval = @"updateKeychain";
	} else {
		NSLog(@"\tunknown selector");
	}
	
	return retval;
}

+(BOOL)isSelectorExcludedFromWebScript:(SEL)aSel {	
	if (aSel == @selector(getKeychain:forUsername:) || aSel == @selector(saveKeychain:forUsername:withPass:) || aSel == @selector(deleteKeychain:forUsername:) || aSel == @selector(updateKeychain:forUsername:withNewUsername:withNewPassword:)) {
		return NO;
	}
	return YES;
}

+(BOOL)isKeyExcludedFromWebScript:(const char*)k {
	return YES;
}

-(NSString*)getKeychain:(NSString*)service forUsername:(NSString*)username {
	OSStatus ret = 0;
	unsigned long len = 0;
	void *p = NULL;
	NSString *string = nil;

	ret = SecKeychainFindGenericPassword(NULL, strlen([service UTF8String]), [service UTF8String], strlen([username UTF8String]), [username UTF8String], &len, &p, NULL);
	if(ret == noErr) 
		string = [NSString stringWithCString:(const char *) p length:len];
	
	SecKeychainItemFreeContent(NULL, p);

	return string;
}

-(void)saveKeychain:(NSString*)service forUsername:(NSString*)username withPass:(NSString*)password {
	SecKeychainAddGenericPassword(NULL, strlen([service UTF8String]), [service UTF8String], strlen([username UTF8String]), [username UTF8String], strlen([password UTF8String]), (void *)[password UTF8String], NULL);
}

-(void)deleteKeychain:(NSString *)service forUsername:(NSString *)username {
	OSStatus ret = 0;
	SecKeychainItemRef itemref = NULL;

	NSParameterAssert(service);
	NSParameterAssert(username);

	ret = SecKeychainFindGenericPassword(NULL, strlen([service UTF8String]), [service UTF8String], strlen([username UTF8String]), [username UTF8String], NULL, NULL, &itemref);
	if(ret == noErr)
		SecKeychainItemDelete(itemref);
}
@end
