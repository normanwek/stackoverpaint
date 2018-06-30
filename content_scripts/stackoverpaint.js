/*
If the click was on a link, send a message to the background page.
The message contains the link's URL.
*/
/*
function notifyExtension(e) {
  var target = e.target;
  while ((target.tagName != "A" || !target.href) && target.parentNode) {
    target = target.parentNode;
  }
  
  console.log("content script sending message");
  browser.runtime.sendMessage({"url": target.href});
  document.documentElement.style.visibility = '';
} 
*/
//browser.runtime.onMessage.addListener(request => {
  //console.log("Message from the background script:");
  //console.log(request.greeting);
//  document.documentElement.style.visibility = '';
//  return Promise.resolve({response: "Hi from content script"});
//});

/*
Add notifyExtension() as a listener to document loaded.
*/
//window.addEventListener("notify", notifyExtension);

document.documentElement.style.visibility = 'hidden';
document.addEventListener('DOMContentLoaded', function() {
    // ... do something ... and then show the document:
	//console.log("in DOMContentedLoaded");
	/*
	document.body.addEventListener('load', function() {
		console.log('in load');
		document.documentElement.style.visibility = '';
	});
	console.log("after added load fn"); */
	//0 - pink, 1 - green, 2 - purple
	//var cssIndex = 2; //User color pref
	//var storageItem = browser.storage.managed.get('color');
	var gettingItem = browser.storage.local.get('color');
    gettingItem.then((result) => {
		var colorPref = result.color;
		//console.log("colorPref is " + this.colorPref);
		setColors(colorPref);
	}, onError);

	function setColors(colorPref) {
		//console.log("out of loop, colorPref is " + colorPref);
		if (!colorPref || colorPref.length == 0) {
			colorPref = "purple";
		}
		
		var isAltIndex = false;
		var altChanceNumber	 = Math.floor(Math.random() * 50);
		//console.log("altChanceNumber = " + altChanceNumber);
		if (altChanceNumber == 1) {
			//console.log("isAltIndex is true");
			isAltIndex = true;
		}	
		
		modifyUserNames(colorPref, isAltIndex);
		//console.log("after modify usernames");
		modifyCss(colorPref,);
		//console.log("after modify css");
		//browser.runtime.sendMessage("hi");
		//console.log("after sendMessage");
		//document.documentElement.style.visibility = '';
	}
});

/* generic error handler */
function onError(error) {
  console.log(error);
}

window.addEventListener("load", function(event) {
    //console.log("All resources finished loading!");
	document.documentElement.style.visibility = '';
  });

   /** 
    Load css file based on preference setting
   */
   function modifyCss(colorPref) {
	//remove existing styleSheets
	let styleSheets = document.querySelectorAll('link[rel=stylesheet]');
	for (let styleSheet of styleSheets) {
		styleSheet.parentNode.removeChild(styleSheet);
	}
	
    //Add in user selected stylesheet	
	var head  = document.getElementsByTagName('head')[0];
	var cssId = 'myCss';  // you could encode the css path itself to generate id..
	var cssFileName = "css/";
	
	//var isMobile = window.matchMedia("only screen and (max-width: 760px)");
	var isMobile = navigator.userAgent.match(/Mobi/i);
	
    if (isMobile) {
		cssFileName += colorPref + "-mobilestack.css";
	} else
	{
		cssFileName += colorPref + "stack.css";
	}
	
	//console.log("Adding " + cssFileName);
	var cssUrl = browser.extension.getURL(cssFileName);
	if (!document.getElementById(cssId))
	{
		var head  = document.getElementsByTagName('head')[0];
		var link  = document.createElement('link');
		link.id   = cssId;
		link.rel  = 'stylesheet';
		link.type = 'text/css';
		link.href = cssUrl;
		link.media = 'all';
		head.appendChild(link);
	}
   }

    /**
   * Walk through user name links, and modify name to random name from dictionary, with accompanying random picture
   */
  function modifyUserNames(colorPref, isAltIndex) {
	let users = document.querySelectorAll('.user-details > a, a.comment-user, .question-status a, .started a, a.author');
	for (let user of users) {
		var userHref = user.getAttribute("href");
		var userText = user.textContent;
		//console.log('href = ' + userHref + ', user text: [' + userText + ']');
		if ((userText || userText.length > 0) && userHref.startsWith("/users/")) {
			var userNumber = userHref.split("/")[2];
			user.textContent = "user" + userNumber;
			//console.log('user = user' + userNumber);
		} 
	}

	var network = document.getElementById('hot-network-questions');
	if (network) {
		network.style.display  = 'none';
	}
	
	var commBulletin = document.querySelectorAll('div.community-bulletin');
	if (commBulletin && commBulletin.length > 0) {
		commBulletin[0].style.display  = 'none';
	}
		
	var chatFeature = document.getElementById('chat-feature');
	if (chatFeature) {
		chatFeature.style.display  = 'none';
	}

	//Want to get div.user-gravatar32 a link - read user#
	//get a img, and substitute src	
	
	//console.log('before gravatar32 select');
	//Load new avatars
	var hideAvatars = false;
	if (hideAvatars) 
	{
		let icons = document.querySelectorAll('div.user-gravatar32 img, div.user-gravatar img');
		for (let icon of icons) {
			//icon.style.visibility = 'hidden';
			icon.src = "none";	
		}
	}

	var changeAvatars = true;
	if (changeAvatars) {
		var indexOrder1 = [0,1,2,3,4];
		var indexOrder2 = [3,2,4,0,1];
		var indexOrder3 = [2,0,1,4,3];
		var indexOrder = [];
		if (isAltIndex) {
			indexOrder = indexOrder1;
		} else {
			var indexOrderNumber = Math.floor(Math.random() * 3);
			switch(indexOrderNumber) {
				case 0: indexOrder = indexOrder1;
					break;
				case 1: indexOrder = indexOrder2;
					break;
				case 2: indexOrder = indexOrder3;
			}
		}

		var dict = {}; // create an empty array		
		var picIndex = 0;

		if (isAltIndex) {
			colorPref = "alt";
		}
		//also get .user-gravatar
		let divIcons = document.querySelectorAll('.user-gravatar32, .user-gravatar');
		for (let divIcon of divIcons) {
			//console.log('found div for user-gravatar');
			var userIcon = divIcon.querySelectorAll('a');
			if (userIcon.length > 0) {
				var userIcon0 = userIcon[0];
				var userHref = userIcon0.getAttribute("href");
				//console.log('icon href text [' + userHref + ']');
				if ((userHref || userHref.length > 0) && userHref.startsWith("/users/")) {
					//Find userNumber for current link
					var userNumber = userHref.split("/")[2];
					
					if (!(userNumber in dict)) {
						dict[userNumber] = indexOrder[picIndex % 5];
						avatarIndex = indexOrder[picIndex % 5];
						picIndex++;
					} else {
						avatarIndex = dict[userNumber];
					}

					//Set picture index based on userNumber
					//console.log('iconuser = user' + userNumber + ', index = [' + avatarIndex + ']');
					var icon = userIcon0.querySelectorAll('img');
					var fileName = "avatars/avatar-" + colorPref + avatarIndex + ".png";
					//avatar-pink1.png
					var imgurl = browser.extension.getURL(fileName);
					icon[0].src = imgurl;
				} 
			}
		}
	}
} //end modifyUserNames