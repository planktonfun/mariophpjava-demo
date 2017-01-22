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

