function getDiv() {
	var div = document.createElement("div");
	for(var i = 0; i < arguments.length; i++) {
		var elem = arguments[i];
		if(typeof(elem) == "string") div.innerHTML = elem;
		else div.appendChild(elem);
	}
	div.add = function() {
		document.body.appendChild(div);
	};
	return div;
}

function getButton(text, input, click) {
	var button = document.createElement("input");
	button.type = "button";
	button.value = text;
	button.onclick = function() {
		click(input.value);
	};
	return button;
}

var inputs = [];

function getInput(type, value, step, modifyStep) {
	var input = document.createElement("input");
	input.type = type;
	input.value = value;
	input.style = "width:" + (type == "number" ? 50 : 100) + "px;";
	if(step) input.step = step;
	if(type == "number") input.onchange = function() {
		if(parseInt(input.value < 0)) input.value = 0;
	};
	input.modifyStep = modifyStep;
	inputs.push(input);
	return input;
}

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

var maze = {
	width: 800,
	height: 600,
	radius: 20,
	border: 10,
	color: {
		player: "blue",
		walls: "black",
		end: "green"
	},
	start: {
		x: 300,
		y: 300
	},
	end: {
		x: 500,
		y: 250,
		width: 100,
		height: 100
	},
	score: {
		x: 400,
		y: 300,
		align: "right",
		font: 30
	},
	walls: []
}

var selected = null;

/*
var border = getInput("number", maze.border);
getDiv("Border:<br>", border, getButton("Edit", border, function(border) {
	maze.border = parseInt(border);
	for(var i = 0; i < inputs.length; i++) {
		if(inputs[i].modifyStep) inputs[i].step = maze.border;
	}
})).add();
*/

var width = getInput("number", maze.width, 1);

function draw() {
	canvas.width = maze.width;
	canvas.height = maze.height;
	canvas.border = maze.border + "px solid " + maze.color.walls;
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	//
}