document.getElementById("loadDefault").onclick = function() {
	useMaze(defaultMaze);
};

document.getElementById("loadFile").onclick = function() {
	var file = document.getElementById("file").files[0];
	if(file) {
		var reader = new FileReader();
		reader.onload = function() {
			try {
				var json = reader.result.substring(reader.result.indexOf("{"));
				useMaze(JSON.parse(json));
			}
			catch(e) {
				useMaze(null);
			}
		};
		reader.readAsText(file);
	}
};

document.getElementById("loadClipboard").onclick = function() {
	var input = prompt("Paste maze data below", "");
	try {
		var json = input.substring(input.indexOf("{"));
		useMaze(JSON.parse(json));
	} catch (e) {
		useMaze(null);
	}
};

document.getElementById("loadPrebuilt").onclick = function() {
	var name = document.getElementById("prebuilt").value;
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "mazes/" + name + ".js";
	document.body.appendChild(script);
	script.onload = function() {
		useMaze(loadedMaze);
	};
}

function objMatch(a, b) {
	if(typeof(a) != "object") return typeof(a) == typeof(b);
	if(a == null || b == null) return false;
	if(a instanceof Array) {
		if(!(b instanceof Array)) return false;
		for(var i = 0; i < b.length; i++) {
			if(!objMatch(a[0], b[i])) return false;
		}
	}
	else for(var key in a) {
		if(!objMatch(a[key], b[key])) return false;
	}
	return true;
}

Array.prototype.some = function(func) {
	if(!func) {
		func = function(a) {
			return a;
		};
	}
	for(var i = 0; i < this.length; i++) {
		if(func(this[i])) {
			return true;
		}
	}
	return false;
};

Array.prototype.contains = function(elem) {
	for(var i = 0; i < this.length; i++) {
		if(this[i] == elem) {
			return true;
		}
	}
	return false;
};

function useMaze(maze) {
	if(!objMatch(defaultMaze, maze)) {
		alert("invalid maze");
		return;
	}

	maze.walls = maze.walls.concat([
		{
			x: 0,
			y: 0,
			width: 0,
			height: maze.height
		}, {
			x: 0,
			y: 0,
			width: maze.width,
			height: 0
		}, {
			x: maze.width,
			y: 0,
			width: 0,
			height: maze.height
		}, {
			x: 0,
			y: maze.height,
			width: maze.width,
			height: 0
		}
	]);

	var controls = {
		movement: {
			// arrows, wasd, vim
			left: [37, "A".charCodeAt(), "H".charCodeAt()],
			right: [39, "D".charCodeAt(), "L".charCodeAt()],
			up: [38, "W".charCodeAt(), "K".charCodeAt()],
			down: [40, "S".charCodeAt(), "J".charCodeAt()]
		},
		restart: [32], // space
	};
	function anyKeyDown(dir) {
		return controls.movement[dir].some(function(key) {
			return keys[key];
		});
	}

	document.getElementById("load").style.display = "none";
	document.getElementById("game").style.display = "block";

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	canvas.style.border = maze.border + "px solid " + maze.color.walls;
	canvas.width = maze.width;
	canvas.height = maze.height;

	var keys = {};
	window.onkeydown = function(event) {
		var key = (event || window.event).keyCode;
		keys[key] = true;
		if(!playing && controls.restart.contains(key)) {
			start();
		}
	};
	window.onkeyup = function(event) {
		var key = (event || window.event).keyCode;
		keys[key] = false;
	};

	function dist(a, b) {
		return Math.sqrt((a.x - b.x) * (a.x - b.x) + (a.y - b.y) * (a.y - b.y));
	}

	function collide(ball, rect) {
		if(ball.x + ball.radius >= rect.x && ball.x - ball.radius <= rect.x + rect.width && ball.y >= rect.y && ball.y <= rect.y + rect.height) return true;
		if(ball.x >= rect.x && ball.x <= rect.x + rect.width && ball.y + ball.radius >= rect.y && ball.y - ball.radius <= rect.y + rect.height) return true;
		if(dist(ball, rect) < ball.radius) return true;
		if(dist(ball, {x: rect.x + rect.width, y: rect.y}) < ball.radius) return true;
		if(dist(ball, {x: rect.x, y: rect.y + rect.height}) < ball.radius) return true;
		if(dist(ball, {x: rect.x + rect.width, y: rect.y + rect.height}) < ball.radius) return true;
		return false;
	}

	var x;
	var y;
	var dx;
	var dy;

	var radius = maze.radius;
	var accel = maze.accel;
	var deaccel = maze.deaccel;
	var friction = 1 - maze.friction;

	var time;
	var playing;
	var didWin;
	var interval;

	var locations;

	function start() {
		x = maze.start.x;
		y = maze.start.y;
		dx = 0;
		dy = 0;
		time = 0;
		playing = true;
		var lastUpdate = Date.now();
		interval = setInterval(function() {
			while (playing && Date.now() - lastUpdate > 10) {
				runAuto(keys, time);
				physics();
				lastUpdate += 10;
				locations.push({
					x: x,
					y: y,
				});
			}
			draw(playing ? (Date.now() - lastUpdate) / 10 : 0);
		}, 1000 / 120);
		locations = [];
		document.getElementById("showPath").style.visibility = "hidden";
	}

	function stop() {
		playing = false;
		clearInterval(interval);
		document.getElementById("showPath").style.visibility = "visible";
	}

	start();

	// should add hide path button
	document.getElementById("showPath").onclick = function() {
		drawBoard();
		for (var i = 0; i < locations.length; i++) {
			drawPlayer(locations[i].x, locations[i].y);
		}
		drawTime();
	};

	function getNextDx() {
		var nextDx = dx;
		if(anyKeyDown("left")) nextDx -= nextDx < 0 ? accel : deaccel;
		if(anyKeyDown("right")) nextDx += nextDx > 0 ? accel : deaccel;
		return nextDx;
	}

	function getNextDy() {
		var nextDy = dy;
		if(anyKeyDown("up")) nextDy -= nextDy < 0 ? accel : deaccel;
		if(anyKeyDown("down")) nextDy += nextDy > 0 ? accel : deaccel;
		return nextDy;
	}

	function physics() {
		dx = getNextDx();
		dy = getNextDy();
		x += dx;
		y += dy;
		if(x < radius) {
			x = radius;
			dx = 0;
		}
		if(x > canvas.width - radius) {
			x = canvas.width - radius;
			dx = 0;
		}
		if(y < radius) {
			y = radius;
			dy = 0;
		}
		if(y > canvas.height - radius) {
			y = canvas.height - radius;
			dy = 0;
		}
		dx *= friction;
		dy *= friction;

		for(var i = 0; i < maze.walls.length; i++) {
			if(collide({x: x, y: y, radius: radius}, maze.walls[i])) {
				didWin = false;
				stop();
				break;
			}
		}
		if(collide({x: x, y:y, radius: radius}, maze.end)) {
			didWin = true;
			stop();
		}

		if(time > 0 || anyKeyDown("left") || anyKeyDown("right") || anyKeyDown("up") || anyKeyDown("down")) time++;
	}

	function drawBoard() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = maze.color.walls;
		for(var i = 0; i < maze.walls.length; i++) {
			var wall = maze.walls[i];
			ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
		}

		ctx.fillStyle = maze.color.end;
		ctx.fillRect(maze.end.x, maze.end.y, maze.end.width, maze.end.height);
	}

	function drawPlayer(xPos, yPos) {
		ctx.fillStyle = maze.color.player;
		ctx.beginPath();
		ctx.arc(xPos, yPos, radius, 0, Math.PI * 2);
		ctx.fill();
	}

	function drawTime() {
		ctx.fillStyle = "black";
		ctx.textAlign = maze.score.align;
		ctx.font = maze.score.font + "px Arial";
		ctx.fillText((time / 100).toFixed(2).toString(), maze.score.x, maze.score.y);
	}

	function draw(fraction) {
		drawBoard();
		drawPlayer(x + getNextDx() * fraction, y + getNextDy() * fraction);
		drawTime();
	}
}
