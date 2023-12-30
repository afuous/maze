function dgid(id) {
	return document.getElementById(id);
}

var maze = defaultMaze;

var inputs;
function assignInputs() {
	inputs = {
		border : [maze, "border"],
		width: [maze, "width"],
		height: [maze, "height"],
		radius: [maze, "radius"],
		accel: [maze, "accel"],
		deaccel: [maze, "deaccel"],
		friction: [maze, "friction"],
		startX: [maze.start, "x"],
		startY: [maze.start, "y"],
		playerColor: [maze.color, "player"],
		wallColor: [maze.color, "walls"],
		endColor: [maze.color, "end"],
		endX: [maze.end, "x"],
		endY: [maze.end, "y"],
		endWidth: [maze.end, "width"],
		endHeight: [maze.end, "height"],
		scoreX: [maze.score, "x"],
		scoreY: [maze.score, "y"],
		scoreAlign: [maze.score, "align"],
		scoreFont: [maze.score, "font"]
	};
}
assignInputs();

for(var id in inputs) {
	dgid(id).onchange = dgid(id).onkeyup = function() {
		inputs[this.id][0][inputs[this.id][1]] = this.type == "number" ? parseFloat(this.value) : this.value.split(" ").join("");
		draw();
	};
}

dgid("vertical").onclick = function() {
	maze.walls.push({
		x: maze.width / 2 - maze.border / 2,
		y: maze.height / 2 - 50,
		width: maze.border,
		height: 100
	});
	draw();
};
dgid("horizontal").onclick = function() {
	maze.walls.push({
		x: maze.width / 2 - 50,
		y: maze.height / 2 - maze.border / 2,
		width: 100,
		height: maze.border
	});
	draw();
}

dgid("blank").onclick = function() {
	maze = blankMaze;
	assignInputs();
	loadMaze();
};

dgid("clipboard").onclick = function() {
	var input = prompt("Paste maze data below", "");
	try {
		var json = input.substring(input.indexOf("{"));
		maze = JSON.parse(json);
		assignInputs();
		loadMaze();
	} catch (e) {}
};

dgid("jsonp").onclick = function() {
	prompt("", "loadedMaze=" + JSON.stringify(maze));
};

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

function draw() {
	canvas.width = maze.width;
	canvas.height = maze.height;
	canvas.style.border = maze.border + "px solid " + maze.color.walls;
	ctx.clearRect(0, 0, canvas.width, canvas.height);

	ctx.fillStyle = maze.color.walls;
	for(var i = 0; i < maze.walls.length; i++) {
		var wall = maze.walls[i];
		ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
	}

	ctx.fillStyle = maze.color.end;
	ctx.fillRect(maze.end.x, maze.end.y, maze.end.width, maze.end.height);

	ctx.fillStyle = maze.color.player;
	ctx.beginPath();
	ctx.arc(maze.start.x, maze.start.y, maze.radius, 0, Math.PI * 2);
	ctx.fill();

	ctx.fillStyle = "black";
	ctx.textAlign = maze.score.align;
	ctx.font = maze.score.font + "px Arial";
	ctx.fillText("0.00", maze.score.x, maze.score.y);
}

function loadMaze() {
	selected = -1;
	dgid("selected").style.display = "none";
	for(var id in inputs) {
		dgid(id).value = inputs[id][0][inputs[id][1]];
	}
	draw();
}

loadMaze();

var selected = -1;

canvas.onclick = function(event) {
	var x = event.x - canvas.offsetLeft - maze.border;
	var y = event.y - canvas.offsetTop - maze.border;
	var index = -1;
	for(var i = 0; i < maze.walls.length; i++) {
		var wall = maze.walls[i];
		if(wall.x <= x && x <= wall.x + wall.width && wall.y <= y && y <= wall.y + wall.height) {
			index = i;
			break;
		}
	}
	if(~index) {
		selected = index;
		dgid("wallX").value = maze.walls[index].x;
		dgid("wallY").value = maze.walls[index].y;
		dgid("wallWidth").value = maze.walls[index].width;
		dgid("wallHeight").value = maze.walls[index].height;
		dgid("selected").style.display = "block";
	}
}

dgid("wallX").onchange = dgid("wallX").onkeyup = function() {
	maze.walls[selected].x = parseInt(this.value);
	draw();
};
dgid("wallY").onchange = dgid("wallY").onkeyup = function() {
	maze.walls[selected].y = parseInt(this.value);
	draw();
};
dgid("wallWidth").onchange = dgid("wallWidth").onkeyup = function() {
	maze.walls[selected].width = parseInt(this.value);
	draw();
};
dgid("wallHeight").onchange = dgid("wallHeight").onkeyup = function() {
	maze.walls[selected].height = parseInt(this.value);
	draw();
};
dgid("remove").onclick = function() {
	maze.walls.splice(selected, 1);
	selected = -1;
	dgid("selected").style.display = "none";
	draw();
};
dgid("done").onclick = function() {
	selected = -1;
	dgid("selected").style.display = "none";
};
