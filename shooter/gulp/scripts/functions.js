
/**
 * SAVE any value to local storage
 * @param string Storage name
 * @param mixed Storage Value
 */
function storeLocal(name, value){
   if (typeof(Storage) !== "undefined") {
	   localStorage.setItem(name, JSON.stringify(value));
   }else{
	   //if we do not have local storage for some reason try to use cookies
	   //we are just saving for 1 day for now
	   setCookie(name, JSON.stringify(value), 1);
   }
}

/**
 * GET any value to local storage
 * @param  string cname  Storage Name
 * @return string        Storage Value
 */
function getLocal(name){

   if (typeof(Storage) !== "undefined") {
	   return JSON.parse(localStorage.getItem(name));
   }else{
	   //if we do not have local storage for some reason try to use cookies
	   return JSON.parse(getCookie(name));
   }

}

/**
 * Set a Cookie
 * @param string cname  Cookie Name
 * @param mixed cvalue  Cookie Value
 * @param int exdays How many days before expire
 */
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

/**
 * Get a cookie
 * @param  string cname  Cookie Name
 * @return string        Cookie Value
 */
function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length,c.length);
		}
	}
	return "";
}

/**
 * Delete a Cookie
 * @param string cname  Cookie Name
 */
function deleteCookie(cname) {
	setCookie(cname, '', -1);
}

/**
 * Use for debugging information
 * @param mixed data any value you would like to log to the console
 */
function debugLog(data){
    if(DEBUG !== 1) return false;

	console.log(data);
}

/**
 * Setup the state listeners to move between the states on keypress
 */
function addStateListeners(){
	if(DEBUG !== 1) return false;

	for(var s in scenes.states){
		addKeyCallback(s, changeState, s);
	}
}

/**
 * Change the game state
 * @param event event the change event
 * @param int the state to change to
 */
function changeState(event, stateNum){
	debugLog('Change State: '+scenes.states[stateNum]);
	game.state.start(scenes.states[stateNum]);
}

/**
 * Helper function to take action on key press
 * https://phaser.io/docs/2.4.4/Phaser.Key.html#onDown
 * @param int key the keycode for the key pressed
 * @param string fn the name of the function to be called on key press (do not include quotes)
 * @param mixed the first argument passed to the added function
 */
function addKeyCallback(key, fn, args){
	game.input.keyboard.addKey(key).onDown.add(fn, null, null, args);
}


/**
 * Get a random integer between min and max
 * @param int min
 * @param int max
 */
function getRandomInt(min,max)
{
	return Math.floor(Math.random()*(max-min+1)+min);
}

/**
 * Setup arrays to have a random function to return one of their elements at random
 */
Array.prototype.random = function () {
  return this[Math.floor((Math.random()*this.length))];
}

/**
 * Show the game fps. Only displays if DEBUG is true
 */
function showFPS(){
	if(! DEBUG) return;

	//SETTING UP THE DEBUG PLUGIN. THIS WILL RUN ON ALL SCENES
	game.debug.font = "24px monospace";
	game.debug.lineHeight = 20;
	if (!game.timing) {
		game.timing = game.plugins.add(Phaser.Plugin.AdvancedTiming);
	}
	//this affects the game physics and not the actual displayed FPS. Setting this to our desired frame rate will allow catchup mechanics in the physics to work better in instances where the framerate drops below this desired rate
	game.time.desiredFps = 30;
	game.time.advancedTiming = true;
}
