<!DOCTYPE html>

<!-- saved from url=(0039)http://supermarioemulator.com/mario.php -->

<html lang="en-us">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    
    <title>
    Super Mario Bros in HTML5</title>


    <link href="./Super Mario Bros in HTML5_files/mario.css" rel="stylesheet">
    <link href="./Super Mario Bros in HTML5_files/stylesheet.css" rel="stylesheet">
    
    <script type="text/javascript" src="/assets/js/jquery.min.js"></script>
    <script type="text/javascript" src="/assets/js/synaptic.min.js"></script>
    <script type="text/javascript" src="/assets/js/machinelearning.min.js"></script>
    <script type="text/javascript" src="/assets/js/initials.js"></script>
    <script type="text/javascript" src="/assets/js/gene.js"></script>
    <script type="text/javascript" src="/assets/js/population.js"></script>
    <script type="text/javascript" src="/assets/js/mario.js"></script>
    
    <script src="./Super Mario Bros in HTML5_files/data.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/editor.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/events.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/generator.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/library.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/load.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/maps.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/mario.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/quadrants.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/sounds.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/sprites.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/things.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/toned.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/triggers.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/upkeep.js.download"></script>
    <script src="./Super Mario Bros in HTML5_files/utility.js.download"></script>
<style>
#newWin:hover {opacity:1}
#newWin {position: absolute;
    z-index: 99;
    top: 50px;
    right: 10px;
    display:block;
	opacity: 0.4;}

.stats-container {
    position: absolute;
    width: 200px;
    height: 200px;
    z-index: 100;
    top: 35px;
    left: 66px;
    opacity: 1;
    border: solid 5px black;
}

.stats-background {
    width: 100%;
    height: 100%;
    background: white;
    opacity: 0.5;
    position: absolute;
    left: 0;
}
</style>
<script type="text/javascript">

function init() {
    
}
window.onload = init;

if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('/caching.js').then(function(registration) {
        if ($.Init.log) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
        }
    }).catch(function(err) {
        if ($.Init.log) {
          console.log('ServiceWorker registration failed: ', err);
        }
    });
  });
}

var currentGeneIndex = '';

function sendMessage(message) {
  return new Promise(function(resolve, reject) {
     var messageChannel = new MessageChannel();
     messageChannel.port1.onmessage = function(event) {
       if (event.data.error) {
         reject(event.data.error);
       } else {
         resolve(event.data);
       }
     };
    navigator.serviceWorker.controller.postMessage(message, [messageChannel.port2]);
  });
}

// controlling service worker
navigator.serviceWorker.addEventListener('message', function(event) {
    if(event.data[0] == 'startAgain') {
        console.log('startAgain');
        setMap(1,1);
        sendMessage('startPopulation');
    } if(event.data[0] == 'geneSent') {
        currentGeneIndex = event.data[1];
        start(event.data[2]);
        console.log('yey', currentGeneIndex);
    } else {
        console.log(event.data);
    }
});

</script>
</head>

<body onload="FullScreenMario()">


<div id="newWin" style="display: none;"><a href="http://supermarioemulator.com/" target="_top" title="Super Mario Bros Emulator">
<img src="./Super Mario Bros in HTML5_files/new_window.svg" class="nwin" title="Play Super Mario Bros Emulator in your computer" alt="Super Mario Bros Emulator" style="
    width: 75px;
    height: 75px;
">

</a></div>
<div style="position: absolute;
    z-index: 99;
    top: 421px;
    left: 27px;">
    <a href="http://online-emulators.com/" target="_top" title="SEGA Megadrive / SEGA Genesis / Super Nintendo Emulator"><img src="./Super Mario Bros in HTML5_files/super-nintendo-sega-emulators.png" title="SEGA Megadrive / SEGA Genesis Emulator" alt="SEGA Megadrive / SEGA Genesis Emulator">

</a></div>
<div style="
    position: absolute;
    z-index: 99;
    top: 433px;
    left: 410px;
    width: 54%;
    height: 152px;
    ">
<!-- Mario -->

</div>

<canvas width="1536" height="736" style="width: 1536px; height: 736px;"></canvas>
<div class="stats-container">
  <div class="stats-background"></div>
  <canvas id="stats" width="200" height="200" style="width: 200px; height: 200px;"></canvas>
</div>
<table id="data_display" class="display" style="width: 1550px;">
<td class="indisplay">
SCORE<br>
2150</td>
<td class="indisplay">
COINS<br>
3</td>
<td class="indisplay">
WORLD<br>
1-1</td>
<td class="indisplay">
TIME<br>
231</td>
<td class="indisplay">
LIVES<br>
3</td>
</table>
<div class="text" style="margin-left: -881px; margin-top: 52px;">
<div style="width:350px;max-height:189px;background-color:#d64d00;border-radius:7px;box-shadow:3px 3px #efb28b inset, -3px -3px black inset;background-image: url(&quot;Theme/Greeting.gif&quot;), url(&quot;Theme/Greeting.gif&quot;), url(&quot;Theme/Greeting.gif&quot;), url(&quot;Theme/Greeting.gif&quot;);background-repeat: no-repeat;background-position: 7px 7px, 336px 7px, 7px 168px, 336px 168px">
  <p style="text-align:left;padding:7px 0 11px 11px;color:#ffcccc;font-family: Super Plumber Bros;font-size:77px;text-shadow:3px 8px black">

<span style="font-size:84px">
super</span>
    <br>
    <br>
    <span style="font-size:75px;line-height:76px">
    MARIO HTML5</span>
  </p>
  </div>

<p id="explanation" style="text-align:center;&lt;!--/*text-shadow:2px 2px 1px black;*/--&gt;margin-left:7px;">
  Arrow/WASD keys move  <br>
  Shift to fire/sprint  <br>
  P/M tos pause/mute</p>
  </div>
</body>
</html>


    