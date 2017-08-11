// Theremin

var theremin = function () {
	"use strict";
	var osc, instrument, masterLvl;
	return {
		init: function () {
			var audio = new AudioContext;
			osc = audio.createOscillator();
			masterLvl = audio.createGain();
			osc.connect(masterLvl);
			masterLvl.connect(audio.destination);
			osc.start(0);
			instrument = document.querySelector("html");
			instrument.addEventListener("mousemove", theremin.mouseMonitor, false);
		},
		mouseMonitor: function(e) {
			var horizontalMouse = event.clientX;
			var verticalMouse = event.clientY;
			var fv = (55 + (1705 * horizontalMouse/window.innerWidth)); // 5 octaves between C1 and C6
			var gv = 1- verticalMouse/window.innerHeight;
			osc.frequency.value = fv;
			masterLvl.gain.value = gv;
		}
}
}();

// Drawing Functions
var canvas = null;
var context = null;
var maxDrawingRadius = 30;
var drawingRadius = null;
var colors = ['#000000','#FF0000','#FFA500','#FFFF00','#008000','#0000FF','#800080','#FFFFFF'];
var rate = null;
var ranges = []
var currentColor = colors[0];

function drawing() {
	canvas = document.getElementById("c");
	context = canvas.getContext("2d");
	context.canvas.width  = window.innerWidth;
	context.canvas.height = window.innerHeight;
	for ( i = 0; i < colors.length; i++ ) {
		var radius = context.canvas.width / 30;
		var posx = i * (context.canvas.width - context.canvas.width / 3) / colors.length + radius + context.canvas.width / 6;
		var posy = context.canvas.height - context.canvas.height / 8;
		ranges.push([posx,posy,radius])
		context.fillStyle = colors[i];
		context.beginPath();
		context.arc(posx, posy, radius, 0, 2*Math.PI);
		context.fill();
		if ( colors[i] == '#FFFFFF') {
			context.lineWidth = 1;
      context.strokeStyle = '#003300';
      context.stroke();
		}
	}
}

function checkColor(x,y) {
	for ( i = 0; i < ranges.length; i++ ) {
		minX = ranges[i][0] - ranges[i][2]
		maxX = ranges[i][0] + ranges[i][2]
		minY = ranges[i][1] - ranges[i][2]
		maxY = ranges[i][1] + ranges[i][2]
		if ( x > minX - drawingRadius && x < maxX + drawingRadius && y > minY - drawingRadius && y < maxY + drawingRadius ) {
			context.globalCompositeOperation='destination-over';
		}
		if ( x > minX && x < maxX && y > minY && y < maxY ) {
			return colors[i]
		}
	}
	context.globalCompositeOperation='source-over';
	return currentColor
}

function draw(e) {
  var pos = getMousePos(canvas,e);
  posx = pos.x;
  posy = pos.y;
	rate = ( 1 - posx / context.canvas.width ) * 5
	if (i > rate) {
		var drawingRadius = ( 1 - posy / context.canvas.height ) * maxDrawingRadius;
		currentColor = checkColor(posx,posy)
    context.fillStyle = currentColor;
    context.beginPath();
    context.arc(posx, posy, drawingRadius, 0, 2*Math.PI);
    context.fill();
		i = 0;
	}
	else {
		i += 1;
	}
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
}

window.draw = draw;

window.addEventListener("DOMContentLoaded", theremin.init, true);
window.addEventListener("DOMContentLoaded", drawing, true);
