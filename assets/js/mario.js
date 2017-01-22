function drawRect( x, y, w, h, color) {
    var xcanvas = document.getElementById("stats");
	var xcontext = xcanvas.getContext("2d");

	xcontext.fillStyle = 'rgba(' + color + ',1)';
	xcontext.fillRect(x,y,w,h);
}

function addTextTo(text, x, y) {
	var xcanvas = document.getElementById("stats");
	var xcontext = xcanvas.getContext("2d");

	xcontext.font = "10px RockoUltraFLF";
	xcontext.fillStyle = 'white';

	xcontext.miterLimit = 1;
	xcontext.lineJoin = 'circle';
	xcontext.lineWidth = 3;
	xcontext.strokeText(text, x, y);
	xcontext.lineWidth = 1;
	xcontext.fillText(text, x, y);
}

function clearXCanvas()
{
	var xcanvas = document.getElementById("stats");
	xcanvas.width = xcanvas.width;
}

function drawBlockByAction(x,y,action) {
	var blocksize = 200/perimeter;
	var x = (blocksize*x)+5;
	var y = (blocksize*y)+11;

	addTextTo(action, x, y);
}

function drawBlockBySymbol(x,y,symbol) {
	color = null;

	if(symbol == 1) {
		color = 'red';
	} else if(symbol == 7) {
		color = 'green';
	} else if (symbol == 2 || symbol == 3) {
		color = 'black';
	} else if (
		symbol == 4 ||
		symbol == 5 ||
		symbol == 6 ||
		symbol == 8
	) {
		color = 'white';
	}

	if(color == null) {
		return;
	}

	drawBlock(x,y,color);
}

function drawBlock(x,y,color) {
	var colors = {
		black: '0,0,0',
		white: '255,255,255',
		red:   '255,0,0',
		green: '0,255,0'
	};

	var blocksize = 200/perimeter;
	var w = blocksize;
	var h = w;
	var x = blocksize*x;
	var y = blocksize*y;
	var color = colors[color];

	drawRect(x, y, w, h, color);
}

var start = function(percievedActions) {

	fitness        = 0;
	currentscore   = 0;
	currentright   = 0;
	totaliteration = 0;
	lastfitness    = 0;
	fpsstart       = fps/1.82;

	var theresno3 = false;
	$.each(percievedActions, function(i,v){
		if(v == 3) {
			theresno3 = true;
		}
	})

	if(theresno3 == false) {
		$.post('/setTestCase.php', {
			cost: fitness,
			code: rawActions
		}, function(response) {
			console.log(response);
			location.href = location.href;
		});
		return false;
	}

	var compiledGeneration = compileGeneratedActions(percievedActions);
	startLoop(compiledGeneration);
}

var compileGeneratedActions = function(generateActions) {
	// console.log(generateActions);
	var generateActions = generateActions.split('');
    var compiledGeneration = {};
    var coolz = '';
    var iteration = 0;
    for (var i=1; i <= 2; i++) {
	    for (var x=1; x <= perimeter; x++) {
	        for (var y=1; y <= perimeter; y++) {
	        	if(i==1) {
	        		coolz = 'white';
	        	} else {
	        		coolz = 'black';
	        	}

	            compiledGeneration[x + '-' + y + '-' + coolz] = generateActions[iteration];
	            // console.log(x + '-' + y + '-' + coolz + '-' + generateActions[iteration]);
	            iteration++;
	        }
	    }
	}

    return compiledGeneration;
}

var getCenterMario = function() {
	var mariocenter = {};

	for (var y = 1; y <= perimeter; y++) {
		for (var x = 1; x <= perimeter; x++) {
			var symbol = getSymbol(x,y);
			if(symbol == 1) {
				mariocenter = {
					x:x-1,
					y:y-1
				};
				break;
			}
		}
	}

	return mariocenter;
}

var getColorBySymbol = function(symbol) {
	var color = null;

	if(symbol == 1) {
		color = null;
	} else if(symbol == 7) {
		color = 'white';
	} else if (symbol == 2 || symbol == 3) {
		color = 'black';
	} else if (
		symbol == 4 ||
		symbol == 5 ||
		symbol == 6 ||
		symbol == 8
	) {
		color = 'white';
	}

	return color;
}

var startLoop = function(percievedActions, machine) {
	// console.clear();
	clearXCanvas();

	// console.log(percievedActions);
	if(machine == undefined) {
		machine = false;
	}

	// Display everything from canvas
	var display = [];
	var collectedActions = {};
	var marioposition = [];
	var pipes = {};
	var marioCenter = getCenterMario();
	var jumptime = 0;

	for (var y = 1; y <= perimeter; y++) {
		for (var x = 1; x <= perimeter; x++) {
			var symbol = getSymbol(
				x - Math.floor((perimeter/2) - marioCenter.x),
				y - Math.floor((perimeter/2) - marioCenter.y)
			);

			if(symbol==7) {
				pipes[x - Math.floor((perimeter/2) - marioCenter.x)] = 1;
			}

			if(pipes[x - Math.floor((perimeter/2) - marioCenter.x)] !== undefined) {
				symbol=7
			}

			if((y- Math.floor((perimeter/2) - marioCenter.y)) == 8) {
				symbol = 5;
			}

			var action = 0;
			var cbs = getColorBySymbol(symbol);
			if(percievedActions[x + '-' + y + '-' + cbs] != undefined) {
				action = percievedActions[x + '-' + y + '-' + cbs];
				// if(action == 4) {
				// 	action = 0;
				// }
				// console.log(x + '-' + y + '-' + cbs + '-' + action);
			}

			if(symbol == 1) {
				marioposition = x + '-' + y;
			}

			// display.push(symbol);
			drawBlockBySymbol(x-1,y-1,symbol);
			drawBlockByAction(x-1,y-1,action);

			if(action != 0 && action != 1) {
				if(action == 2) {
					jumptime += 100;
				}
				collectedActions[action] = action;
			}
		}
		// display.push('\n');
	}

	var actionCount = 0;

	$.each(collectedActions, function(action) {
		actionCount++;
	});

	if(actionCount == 0) {
		// console.log('-----> WHAT <-----');
		execute(0);
	} else {
		$.each(collectedActions, function(action) {
			console.log('----->' + action + '<-----');

			timeout = 0;

			if(action == '2') {
				timeout = jumptime;
			}

			execute(action, timeout);
		});
	}

	// Genetic part
	// console.log(display.join(""));
	// console.log(fitness);
	// console.log(totaliteration);
	// console.log(marioposition);

	// Machine Learning part
	if(data.score.amount > currentscore) {
		fitness += (data.score.amount - currentscore);
		currentscore = data.score.amount;
		learningRate = .12;
	} else {
		learningRate = .06;
	}

	if(mario.right > currentright) {
		fitness += (mario.right - currentright);
		currentright = mario.right;
	}

	if(!machine) {
		// if(fitness > totalFitness) {
			totalFitness = fitness;
			localStorage.setItem('savedPerceptron', btoa(JSON.stringify(percievedActions)));
			localStorage.setItem('savedPerceptronFitness', fitness);
		// }
	}

	if(lastfitness == marioposition) {
		totaliteration++;
	} else {
		totaliteration = 0;
	}

	lastfitness = marioposition;

	var mapReset = false;

	if(totaliteration > fpsstart*3) {
		mapReset = true;
	}

	if(mario.dying) {
		mapReset = true;
	}

	if(mapReset) {
		console.log(1);
		$.post('/setTestCase.php', {
			cost: fitness,
			code: rawActions
		}, function(response) {
			location.href = location.href;
		});
	} else {
		console.log(2);
		setTimeout(function(){startLoop(percievedActions, machine);}, 1000/fpsstart);
	}
}

var jumpenabled = true;
var execute = function(action, timeout) {
	switch(action) {
		case '1':
			// console.log('action');
		 	keydown(65); //left
		 	break;
		case '2':
			// console.log('action');
			if(jumpenabled){
				jumpenabled = false;
			 	keydown(32); //up
			 	setTimeout(function(){
			 		keyup(32);
			 		jumpenabled = true;
			 	},timeout);
			}
		 	break;
		case '3':
			// console.log('action');
			fitness++;
		 	keydown(68); //right
		 	break;
		case '4':
			// console.log('action');
		 	keydown(83); //down
		 	break;
		case '5':
			// console.log('action');
		 	keydown(16); //shift
		 	break;
		case '6':
			keydown(65); //left
			if(jumpenabled){
				jumpenabled = false;
			 	keydown(32); //up
			 	setTimeout(function(){
			 		keyup(32);
			 		jumpenabled = true;
			 	},timeout);
			}
			break;
		case '7':
			keydown(65); //left
			fitness++;
		 	keydown(68); //right
			break;
		case '8':
			keydown(65); //left
			keydown(16); //shift
			break;
		case '9':
			if(jumpenabled){
				jumpenabled = false;
			 	keydown(32); //up
			 	setTimeout(function(){
			 		keyup(32);
			 		jumpenabled = true;
			 	},timeout);
			}
			fitness++;
		 	keydown(68); //right
			break;
		case 'A':
			if(jumpenabled){
				jumpenabled = false;
			 	keydown(32); //up
			 	setTimeout(function(){
			 		keyup(32);
			 		jumpenabled = true;
			 	},timeout);
			}
			keydown(16); //shift
			break;
		case 'B':
			fitness++;
		 	keydown(68); //right
		 	keydown(16); //shift
			break;
		default:
			keyup(65);
			keyup(32);
			keyup(68);
			keyup(83);
			keyup(16);
		 	break;
	}
}

var getSymbol = function(x,y) {
	if(inBetween(mario, x, y)) {
		return 1;
	}

	var charSymbol = false;
	$.each(characters,function(){
		if(inBetween(this, x, y)) {
			if(this.group == 'enemy') {
				charSymbol = 2;
			} else {
				charSymbol = 3;
			}
		}
	});

	if(charSymbol) {
		return charSymbol;
	}

	var solidSymbol = false;
	$.each(solids,function(){
		if(inBetween(this, x, y)) {
			if(this.name == 'floor')  {
				solidSymbol = 4;
			} else if(this.name == 'Block unused')  {
				solidSymbol = 5;
			} else if(this.name == 'brick unused')  {
				solidSymbol = 6;
			} else if(this.name == 'pipe')  {
				solidSymbol = 7;
			} else {
				solidSymbol = 8;
			}
		}
	});

	if(solidSymbol) {
		return solidSymbol;
	}

	return 0;
}

var inBetween = function(obj,x,y) {
	var widthPercent  = {
		min: (obj.right/canvas.width),
		max: ((obj.right-obj.width)/canvas.width)
	};
	var heightPercent = {
		min: (obj.top/canvas.height),
		max: ((obj.top-obj.height)/canvas.height)
	};

	var obj = {
		x: {
			min: Math.round(widthPercent.min*perimeter),
			max: Math.round(widthPercent.max*perimeter)
		},
		y: {
			min: Math.round(heightPercent.min*perimeter),
			max: Math.round(heightPercent.max*perimeter)
		}
	};

	if(
		obj.x.min >= x &&
		obj.x.max <= x &&
		obj.y.min >= y &&
		obj.y.max <= y
	) {
		return true;
	}

	return false;
}