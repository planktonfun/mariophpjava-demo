var Neuron = synaptic.Neuron,
    Layer = synaptic.Layer,
    Network = synaptic.Network,
    Trainer = synaptic.Trainer,
    Architect = synaptic.Architect;

// display size
var perimeter = 13;

// Machine Learning settings
var perceptron = null;
var learningRate = .12;

// All the actions mario can do
var actions = [
	1, // keydown(65) left
	2, // keydown(32) up
	3, // keydown(68) right
	// 4, // keydown(83) down
	5, // keydown(16) shift
	0  // unpress keys
];

// Frames Per Second
var fpsstart = 30;

// Fitness
var fitness  = 0;

// Current Score
var currentscore = 0;
var currentright = 0;

// Symbols
var symbols = [
	0,
	1,
	2,
	3,
	4,
	5,
	6,
	7,
	8
];

// Perceived Actions
var percievedActions = {};

// total fitness
var totalFitness     = 0;

// last fitness
var lastFitness     = 0;

// total iterations
var totaliteration   = 0;

var rawActions = "";

var Gene = function(code) {
    if (code.length > 0) this.code = code;
    this.cost = 9999;
};

Gene.prototype.code = [];

Gene.prototype.random = function() {
	this.code = generateActions();
};

Gene.prototype.mutate = function(chance) {
    if (Math.random() > chance) return;

    var index = Math.floor(Math.random() * this.code.length) - 1;
    var upOrDown = Math.random() <= 0.5 ? -1 : 1;
    var newAction = this.getShiftedLetters(index, upOrDown);
    var newCode = [];

    for (i = 0; i < this.code.length; i++) {
        if (i == index) {
            this.code[i].action = newAction;
        }

        newCode.push(this.code[i]);
    }

    this.code = newCode;
};

Gene.prototype.getShiftedLetters = function(character, upOrDown) {
    var shiftedIndex = index + upOrDown;

    if(shiftedIndex < 0) {
        shiftedIndex = actions.length - 1;
    }

    if(shiftedIndex >= actions.length) {
        shiftedIndex = 0;
    }

    return actions[shiftedIndex];
}

Gene.prototype.mate = function(gene) {
    var pivot = Math.round(this.code.length / 2) - 1;

    var codeHalf1 = this.code.slice(0, pivot);
    var codeHalf2 = this.code.slice(pivot);

    var geneHalf1 = gene.code.slice(0, pivot);
    var geneHalf2 = gene.code.slice(pivot);

    var child1 = codeHalf1.concat(geneHalf2);
    var child2 = geneHalf1.concat(codeHalf2);

    return [new Gene(child1), new Gene(child2)];
};

Gene.prototype.calcCost = function() {
    // Move Mutation testing in service workers to retain variables upon refresh
    this.cost = start(compileGeneratedActions(this.code));
};

var generateActions = function() {
	var perceptron = [];

	for (var i = symbols.length - 1; i >= 0; i--) {
		var symbol = symbols[i];
		var action = actions[Math.floor(Math.random()*actions.length)];

		if(symbols[i] == 0) {
			var action = false;
		}

		for (var y = 1; y <= perimeter; y++) {
			for (var x = 1; x <= perimeter; x++) {
				if(action != false) {
					perceptron.push({
                        x: x,
                        y: y,
                        symbol: symbol,
                        action: action
                    });
				}
			}
		}
	}

	return perceptron;
}

var compileGeneratedActions = function(generateActions) {
    var compiledGeneration = {};

    $.each(function(obj) {
        compiledGeneration[obj.x + '-' + obj.y + '-' + obj.symbol] = obj.action;
    });

    return compiledGeneration;
}

var Population = function(goal, size) {
    this.members = [];
    this.goal = goal;
    this.generationNumber = 0;
    while (size--) {
        var gene = new Gene([]);
        gene.random();
        this.members.push(gene);
    }
};

Population.prototype.display = function() {
    console.log("<h2>Generation: " + this.generationNumber + "</h2>");
    console.log("<ul>");
    for (var i = 0; i < this.members.length; i++) {
        for (var z = 0; z < this.members[i].code.length; z++) {
            console.log("<li>" + this.members[i].code[z].action + " (" + this.members[i].cost + ")(" + this.members[i].code.length + ")");
        }
    }
    console.log("</ul>");
};

Population.prototype.sort = function() {
    this.members.sort(function(a, b) {
        return a.cost - b.cost;
    });
}

Population.prototype.generation = function() {
    for (var i = 0; i < this.members.length; i++) {
        console.log(this.members[i].code);
        // this.members[i].calcCost();
    }

    this.members[0].calcCost();

    // this.sort();
    // this.display();

    // var children1 = this.members[0].mate(this.members[1]);
    // this.members.splice(this.members.length - 2, 2, children1[0], children1[1]);
    // var children2 = this.members[2].mate(this.members[3]);
    // this.members.splice(this.members.length - 4, 2, children2[0], children2[1]);
    // var children3 = this.members[4].mate(this.members[5]);
    // this.members.splice(this.members.length - 6, 2, children3[0], children3[1]);

    // for (var i = 0; i < this.members.length; i++) {
    //     this.members[i].mutate(0.5);
    //     this.members[i].calcCost();
    //     if (this.members[i].code == this.goal) {
    //         this.sort();
    //         this.display();
    //         return true;
    //     }
    // }

    // this.generationNumber++;

    // var scope = this;

    // setTimeout(function() {
    //     scope.generation();
    // }, 20);
};

