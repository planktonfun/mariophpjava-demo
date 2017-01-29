var limiters   = true;
var playback   = false;
var playiteration = 0;
var recordings = {};


function getMicroseconds()
{
	return Math.floor((getMicrotime(true) - initialTimestamp)*1000);
}

function getMicrotime(getAsFloat) {
    var s, now, multiplier;

    if(typeof performance !== 'undefined' && performance.now) {
        now = (performance.now() + performance.timing.navigationStart) / 1000;
        multiplier = 1e6; // 1,000,000 for microseconds
    }
    else {
        now = (Date.now ? Date.now() : new Date().getTime()) / 1000;
        multiplier = 1e3; // 1,000
    }

    // Getting microtime as a float is easy
    if(getAsFloat) {
        return now;
    }

    // Dirty trick to only get the integer part
    s = now | 0;

    return (Math.round((now - s) * multiplier ) / multiplier );
}

var initialTimestamp = getMicrotime(true);

var keynames   = {
	16: 'shift',
	37: 'left',
	38: 'up',
	39: 'right',
	40: 'down'
};

var buttonkeynames   = {
	shift: 16,
	left:  65,
	up:    32,
	right: 68,
	down:  83
};

var recorded = {};


// try accurate timings next
document.onkeydown = function(e) { // Monitor Keyboard keys
	e = e || window.event;
	keypressed = e.keyCode;

	var microtime = getMicroseconds();

	recorded[keynames[keypressed]]=true;
	recorded['time']=microtime;

	if(!playback) {
		recordings[microtime] = (jQuery.extend({}, recorded));
	}
};

document.onkeyup = function(e) { // Monitor Keyboard keys
	e = e || window.event;
	keypressed = e.keyCode;

	var microtime = getMicroseconds();

	if(keynames[keypressed] != undefined) {
		recorded[keynames[keypressed]]=false;
	}
	recorded['time']=microtime;

	if(!playback) {
		recordings[microtime] = (jQuery.extend({}, recorded));
	}
};

var saveRecordings = function() {
	localStorage.setItem('recordings', JSON.stringify(recordings));
}

var loadRecordings = function() {
	return JSON.parse(localStorage.getItem('recordings'));
}

var playBack = function(playiteration) {
	if(recordings[playiteration] == undefined) {
		return;
	}

	var playbutton = recordings[playiteration];

	$.each(playbutton,function(key,value) {
		if(buttonkeynames[key] != undefined) {
			if(value) {
				keydown(buttonkeynames[key]);
			} else {
	            keyup(buttonkeynames[key]);
			}
		}
	});
}

var playAll = function() {
	$.each(recordings, function(i,v) {
		if(v != null) {
			var timein = i;
			setTimeout(function(){
				console.log(timein, 'play');
				playBack(timein);
			},i);
			console.log(i, v);
		}
	});
}