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
  4, // keydown(83) down
  5, // keydown(16) shift
  0  // unpress keys
];

// Frames Per Second
var fpsstart = 5;

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

var CACHE_NAME = 'cache-and-update';
var urlsToCache = [];

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
            this.code[i] = newAction;
        }

        newCode.push(this.code[i]);
    }

    this.code = newCode;
};

Gene.prototype.getShiftedLetters = function(character, upOrDown) {
    var shiftedIndex = character + upOrDown;

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

Gene.prototype.calculated = false;
Gene.prototype.calcCost = function(cost) {
    // Move Mutation testing in service workers to retain variables upon refresh
    this.cost = cost;
    this.calculated = true;
};

var generateActions = function() {
  var perceptron = [];

  for (var i = symbols.length - 1; i >= 0; i--) {
    var symbol = symbols[i];
    var action = actions[Math.floor(Math.random()*actions.length)];

    // if(symbols[i] == 0) {
    //   var action = false;
    // }

    // if(action != false) {
      perceptron.push(action);
    // }
  }

  return perceptron;
}

var compileGeneratedActions = function(generateActions) {
    var compiledGeneration = {};

    $.each(function(obj) {
        compiledGeneration[obj.x + '-' + obj.y + '-' + obj.symbol] = obj.action;
    });

    for (var i = symbols.length - 1; i >= 0; i--) {
      var symbol = symbols[i];
      var action = actions[Math.floor(Math.random()*actions.length)];

      if(symbols[i] == 0) {
        var action = false;
      }

      for (var y = 1; y <= perimeter; y++) {
        for (var x = 1; x <= perimeter; x++) {
          if(action != false) {
            compiledGeneration[x + '-' + y + '-' + symbol] = generateActions[i];
          }
        }
      }
    }

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
            console.log("<li>" + this.members[i].code[z] + " (" + this.members[i].cost + ")(" + this.members[i].code.length + ")");
        }
    }
    console.log("</ul>");
};

Population.prototype.sort = function() {
    this.members.sort(function(a, b) {
        return b.cost - a.cost;
    });
}

Population.prototype.generation = function() {

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



self.addEventListener('install', function(event) {
  // Perform install steps
  event.waitUntil(precache());

});

function precache() {
  return caches.open(CACHE_NAME).then(function (cache) {
    return cache.addAll(urlsToCache);
  });
}

self.addEventListener('fetch', function(event) {

  // You can use respondWith() to answer immediately, without waiting for the network response to reach the service worker…
  event.respondWith(
  caches.match(event.request)
    .then(function(response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      return fetch(event.request.clone()).then(
        function(response) {
          return response;
        }
      );
    })
  );

  // …and waitUntil() to prevent the worker from being killed until the cache is updated.
  if(event.request.method != "POST" && /js\?/.test(event.request.url) != true) {
    event.waitUntil(update(event.request.clone()));
  }
});

// Update consists in opening the cache, performing a network request and storing the new response data.
function update(request) {
  return caches.open(CACHE_NAME).then(function (cache) {
    return fetch(request).then(function (response) {

      if(!response || response.status !== 200 || response.type !== 'basic') {
        return response;
      }

      return cache.put(request, response);
    });
  });
}

function sendMessage(message) {
  return new Promise(function(resolve, reject) {
    // note that this is the ServiceWorker.postMessage version
    navigator.serviceWorker.controller.postMessage(message);
    window.serviceWorker.onMessage = function(e) {
      resolve(e.data);
    };
  });
}

var population = new Population(perimeter*perimeter, 20);
var halfgeneration = false;

// controlling service worker
self.addEventListener("message", function(e) {
  // e.source is a client object
  if(e.data == 'startPopulation') {
    var allCalculated = 1;
    console.log('start');
    console.log('generation ' + population.generationNumber);

    for (var i = 0; i < population.members.length; i++) {
      if(population.members[i].calculated == false) {
        console.log('sending member: ' + i);
        e.source.postMessage(['geneSent', i, population.members[i].code]);
        allCalculated = 0;
        return;
      }
    }

    population.sort();
    // population.display();

    var children1 = population.members[0].mate(population.members[1]);
    population.members.splice(population.members.length - 2, 2, children1[0], children1[1]);
    var children2 = population.members[2].mate(population.members[3]);
    population.members.splice(population.members.length - 4, 2, children2[0], children2[1]);
    var children3 = population.members[4].mate(population.members[5]);
    population.members.splice(population.members.length - 6, 2, children3[0], children3[1]);

    for (var i = 0; i < population.members.length; i++) {
        population.members[i].mutate(0.5);
        population.members[i].calculated = false;
    }

    halfgeneration = true;

    population.generationNumber++;

    console.log('half gen')
    console.log('sending another member: ' + 0);
    e.source.postMessage(['geneSent', 0, population.members[0].code]);

  } else if(e.data == 'getPercievedAction') {
    e.source.postMessage(actions);
  } else if(e.data[0] == 'done') {
    console.log(e.data);
    population.members[e.data[2]].calcCost(e.data[1]);
    e.source.postMessage(['startAgain']);
  } else {
    e.source.postMessage("Hello! Your message was: " + e.data);
  }

});