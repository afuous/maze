document.getElementById("loadDefault").onclick = function() {
	useMaze(defaultMaze);
};

document.getElementById("loadFile").onclick = function() {
	var file = document.getElementById("file").files[0];
	if(file) {
		var reader = new FileReader();
		reader.onload = function() {
			try {
				useMaze(JSON.parse(reader.result));
			}
			catch(e) {
				useMaze(null);
			}
		};
		reader.readAsText(file);
	}
};

document.getElementById("loadURL").onclick = function() {
	var url = document.getElementById("url").value;
	var script = document.createElement("script");
	script.type = "text/javascript";
	script.src = "http://thevoidpigeon.heliohost.org/maze.php?url=" + escape(url);
	document.body.appendChild(script);
};

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
		if(!playing && (key == 32 || key == 16)) {
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
	var interval;
	
	function start(beginning) {
		x = maze.start.x;
		y = maze.start.y;
		dx = 0;
		dy = 0;
		time = 0;
		if(beginning) {
			playing = false;
			draw();
		}
		else {
			playing = true;
			interval = setInterval(function() {
				physics();
				draw();
			}, 10);
		}
	}
	
	function stop() {
		playing = false;
		clearInterval(interval);
	}
	
	start(true);
	
	function physics() {
		if(keys[37] || keys[65]) dx -= dx < 0 ? accel : deaccel;
		if(keys[39] || keys[68]) dx += dx > 0 ? accel : deaccel;
		if(keys[38] || keys[87]) dy -= dy < 0 ? accel : deaccel;
		if(keys[40] || keys[83]) dy += dy > 0 ? accel : deaccel;
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
				stop();
				break;
			}
		}
		if(collide({x: x, y:y, radius: radius}, maze.end)) stop();

		if(time > 0 || keys[37] || keys[38] || keys[39] || keys[40] || keys[87] || keys[65] || keys[83] || keys[68]) time++;
	}
	
	function draw() {
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
		ctx.arc(x, y, radius, 0, Math.PI * 2);
		ctx.fill();
		
		ctx.fillStyle = "black";
		ctx.textAlign = maze.score.align;
		ctx.font = maze.score.font + "px Arial";
		ctx.fillText((time / 100).toFixed(2).toString(), maze.score.x, maze.score.y);
	}
}