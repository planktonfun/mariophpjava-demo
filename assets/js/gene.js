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