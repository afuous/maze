Array.prototype.some = function(func) {
	if (!func) {
		func = function(a) {
			return a;
		};
	}
	for (var i = 0; i < this.length; i++) {
		if (func(this[i])) {
			return true;
		}
	}
	return false;
};

Array.prototype.contains = function(elem) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == elem) {
			return true;
		}
	}
	return false;
};

(function() {
	var controls = {
		movement: {
			// arrows, wasd
			left: [37, "A".charCodeAt()],
			right: [39, "D".charCodeAt()],
			up: [38, "W".charCodeAt()],
			down: [40, "S".charCodeAt()],
		},
		restart: [32], // space
	};
	function anyKeyDown(dir) {
		return controls.movement[dir].some(function(key) {
			return keys[key];
		});
	}

	var canvas = document.getElementById("canvas");
	var ctx = canvas.getContext("2d");

	canvas.width = document.body.clientWidth;
	canvas.height = document.body.clientHeight;
	// canvas.width = 1900;
	// canvas.height = 900;

	var keys = {};
	window.onkeydown = function(event) {
		var key = (event || window.event).keyCode;
		keys[key] = true;
		if (!playing && controls.restart.contains(key)) {
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

	function collideBallRect(ball, rect) {
		if (ball.x + ball.radius >= rect.x && ball.x - ball.radius <= rect.x + rect.width && ball.y >= rect.y && ball.y <= rect.y + rect.height) return true;
		if (ball.x >= rect.x && ball.x <= rect.x + rect.width && ball.y + ball.radius >= rect.y && ball.y - ball.radius <= rect.y + rect.height) return true;
		if (dist(ball, rect) < ball.radius) return true;
		if (dist(ball, {x: rect.x + rect.width, y: rect.y}) < ball.radius) return true;
		if (dist(ball, {x: rect.x, y: rect.y + rect.height}) < ball.radius) return true;
		if (dist(ball, {x: rect.x + rect.width, y: rect.y + rect.height}) < ball.radius) return true;
		return false;
	}

	function collideRectRect(r1, r2) {
		return r1.x + r1.width > r2.x && r2.x + r2.width > r1.x && r1.y + r1.height > r2.y && r2.y + r2.height > r1.y;
	}

	var player;

	var radius = 20;
	var accel = 0.05;
	var deaccel = 0.1;
	var friction = 0;

	var time;
	var playing;
	var interval;

	var locations;

	var wallThickness = 10;
	var tunnelWidth = 100;
	var startOffset = 50;

	var RIGHT = 0;
	var UP = 1;
	var LEFT = 2;
	var DOWN = 3;
	// can add numbers mod 4 to directions, group structure is like angles

	var START = 0;
	var TURN_LEFT = 1;
	var TURN_RIGHT = 2;
	var U_TURN_LEFT = 3;
	var U_TURN_RIGHT = 4;

	var tunnels; // each tunnel object stores the transition into the tunnel along with the tunnel itself
	var walls; // this is the actual wall drawn on the screen
	var passages; // a passage is just the rectangular space occupied along with direction, including the walls themselves, and with overlap

	// obj has the form { x, y, dir }
	function toRefDir(refDir, obj) {
		// this is very weird for UP and DOWN since the y coordinate on computers is flipped
		if (refDir == RIGHT) {
			return obj;
		} else if (refDir == LEFT) {
			return {
				x: -obj.x,
				y: -obj.y,
				dir: (obj.dir + 2) % 4,
			};
		} else if (refDir == UP) {
			return {
				x: -obj.y,
				y: obj.x,
				dir: (obj.dir + 3) % 4,
			};
		} else if (refDir == DOWN) {
			return {
				x: obj.y,
				y: -obj.x,
				dir: (obj.dir + 1) % 4,
			};
		}
	}

	function fromRefDir(refDir, obj) {
		return toRefDir((4 - refDir) % 4, obj);
	}

	function getWall(refDir, x, y, dir, length) {
		var unRotated = fromRefDir(refDir, { x: x, y: y, dir: dir });
		if (unRotated.dir == RIGHT) {
			return {
				x: unRotated.x - wallThickness / 2,
				y: unRotated.y - wallThickness / 2,
				width: length,
				height: wallThickness,
			};
		} else if (unRotated.dir == LEFT) {
			return {
				x: unRotated.x + wallThickness / 2 - length,
				y: unRotated.y - wallThickness / 2,
				width: length,
				height: wallThickness,
			};
		} else if (unRotated.dir == DOWN) {
			return {
				x: unRotated.x - wallThickness / 2,
				y: unRotated.y - wallThickness / 2,
				width: wallThickness,
				height: length,
			};
		} else if (unRotated.dir == UP) {
			return {
				x: unRotated.x - wallThickness / 2,
				y: unRotated.y + wallThickness / 2 - length,
				width: wallThickness,
				height: length,
			};
		}
	}

	function addWallsForTunnel(tunnel) {
		walls = walls.concat(getWallsForTunnel(tunnel));
	}

	function getWallsForTunnel(tunnel) {
		var refDir = tunnel.dir;
		var rotated = toRefDir(refDir, tunnel);
		// rotated always has dir RIGHT
		if (tunnel.type == START) {
			return [
				getWall(refDir, rotated.x - startOffset - wallThickness / 2, rotated.y - tunnelWidth / 2 - wallThickness / 2, DOWN, tunnelWidth + wallThickness * 2),
				getWall(refDir, rotated.x - startOffset - wallThickness / 2, rotated.y - tunnelWidth / 2 - wallThickness / 2, RIGHT, wallThickness + tunnel.length),
				getWall(refDir, rotated.x - startOffset - wallThickness / 2, rotated.y + tunnelWidth / 2 + wallThickness / 2, RIGHT, wallThickness + tunnel.length),
			];
		} else if (tunnel.type == TURN_LEFT) {
			return [
				getWall(refDir, rotated.x - wallThickness / 2, rotated.y - tunnelWidth / 2 - wallThickness / 2, UP, tunnel.length + wallThickness),
				getWall(refDir, rotated.x + wallThickness / 2, rotated.y + tunnelWidth / 2 + wallThickness / 2, RIGHT, tunnelWidth + wallThickness),
				getWall(refDir, rotated.x + tunnelWidth + wallThickness / 2, rotated.y + tunnelWidth / 2 + wallThickness / 2, UP, tunnel.length + tunnelWidth + wallThickness * 2),
			];
		} else if (tunnel.type == TURN_RIGHT) {
			return [
				getWall(refDir, rotated.x - wallThickness / 2, rotated.y + tunnelWidth / 2 + wallThickness / 2, DOWN, tunnel.length + wallThickness),
				getWall(refDir, rotated.x + wallThickness / 2, rotated.y - tunnelWidth / 2 - wallThickness / 2, RIGHT, tunnelWidth + wallThickness),
				getWall(refDir, rotated.x + tunnelWidth + wallThickness / 2, rotated.y - tunnelWidth / 2 - wallThickness / 2, DOWN, tunnel.length + tunnelWidth + wallThickness * 2),
			];
		} else if (tunnel.type == U_TURN_LEFT) {
			return [
				getWall(refDir, rotated.x + wallThickness / 2, rotated.y + tunnelWidth / 2 + wallThickness / 2, RIGHT, tunnelWidth + wallThickness),
				getWall(refDir, rotated.x + tunnelWidth + wallThickness / 2, rotated.y + tunnelWidth / 2 + wallThickness / 2, UP, tunnelWidth * 2 + wallThickness * 3),
				getWall(refDir, rotated.x + tunnelWidth + wallThickness / 2, rotated.y - tunnelWidth * 3 / 2 - wallThickness * 3 / 2, LEFT, tunnel.length + tunnelWidth + wallThickness),
				getWall(refDir, rotated.x - wallThickness / 2, rotated.y - tunnelWidth / 2 - wallThickness / 2, LEFT, tunnel.length),
			];
		} else if (tunnel.type == U_TURN_RIGHT) {
			return [
				getWall(refDir, rotated.x + wallThickness / 2, rotated.y - tunnelWidth / 2 - wallThickness / 2, RIGHT, tunnelWidth + wallThickness),
				getWall(refDir, rotated.x + tunnelWidth + wallThickness / 2, rotated.y - tunnelWidth / 2 - wallThickness / 2, DOWN, tunnelWidth * 2 + wallThickness * 3),
				getWall(refDir, rotated.x + tunnelWidth + wallThickness / 2, rotated.y + tunnelWidth * 3 / 2 + wallThickness * 3 / 2, LEFT, tunnel.length + tunnelWidth + wallThickness),
				getWall(refDir, rotated.x - wallThickness / 2, rotated.y + tunnelWidth / 2 + wallThickness / 2, LEFT, tunnel.length),
			];
		}
	}

	function getPassage(refDir, x, y, dir, length) {
		var unRotated = fromRefDir(refDir, { x: x, y: y, dir: dir });
		unRotated.length = length;
		return unRotated;
	}

	function addPassagesForTunnel(tunnel) {
		passages = passages.concat(getPassagesForTunnel(tunnel));
	}

	function getPassagesForTunnel(tunnel) {
		var refDir = tunnel.dir;
		var rotated = toRefDir(refDir, tunnel);
		// rotated always has dir RIGHT
		if (tunnel.type == START) {
			return [
				getPassage(refDir, rotated.x - startOffset - wallThickness, rotated.y, RIGHT, tunnel.length + wallThickness),
			];
		} else if (tunnel.type == TURN_LEFT) {
			return [
				getPassage(refDir, rotated.x, rotated.y, RIGHT, tunnelWidth + wallThickness),
				getPassage(refDir, rotated.x + tunnelWidth / 2, rotated.y + tunnelWidth / 2 + wallThickness, UP, tunnel.length + tunnelWidth + wallThickness * 2),
			];
		} else if (tunnel.type == TURN_RIGHT) {
			return [
				getPassage(refDir, rotated.x, rotated.y, RIGHT, tunnelWidth + wallThickness),
				getPassage(refDir, rotated.x + tunnelWidth / 2, rotated.y - tunnelWidth / 2 - wallThickness, DOWN, tunnel.length + tunnelWidth + wallThickness * 2),
			];
		} else if (tunnel.type == U_TURN_LEFT) {
			return [
				getPassage(refDir, rotated.x, rotated.y, RIGHT, tunnelWidth + wallThickness),
				getPassage(refDir, rotated.x + tunnelWidth / 2, rotated.y + tunnelWidth / 2 + wallThickness, UP, tunnelWidth * 2 + wallThickness * 2),
				getPassage(refDir, rotated.x + tunnelWidth + wallThickness, rotated.y - tunnelWidth - wallThickness, LEFT, tunnel.length + tunnelWidth + wallThickness),
			];
		} else if (tunnel.type == U_TURN_RIGHT) {
			return [
				getPassage(refDir, rotated.x, rotated.y, RIGHT, tunnelWidth + wallThickness),
				getPassage(refDir, rotated.x + tunnelWidth / 2, rotated.y - tunnelWidth / 2 - wallThickness, DOWN, tunnelWidth * 2 + wallThickness * 2),
				getPassage(refDir, rotated.x + tunnelWidth + wallThickness, rotated.y + tunnelWidth + wallThickness, LEFT, tunnel.length + tunnelWidth + wallThickness),
			];
		}
	}

	function addTunnel(tunnel) {
		console.log(tunnel)
		addWallsForTunnel(tunnel);
		addPassagesForTunnel(tunnel);
		tunnels.push(tunnel);
	}

	function isTunnelValid(tunnel) {
		// to check if two tunnels collide, it suffices to check if any of their walls collide
		// should check for overlapping passages here instead
		var newWalls = getWallsForTunnel(tunnel);
		for (var i = 0; i < walls.length - getWallsForTunnel(tunnels[tunnels.length - 1]).length; i++) {
			for (var j = 0; j < newWalls.length; j++) {
				if (collideRectRect(walls[i], newWalls[j])) {
					return false;
				}
			}
		}
		return true;

		var minDistance = tunnelWidth * 2 + wallThickness * 4; // min distance between parallel passages
		var newPassages = getPassagesForTunnel(tunnel);
		for (var i = 0; i < passages.length; i++) {
			for (var j = 0; j < newPassages; j++) {
				var p1 = passages[i];
				var p2 = newPassages[j];
				var refDir = p1.dir;
				var r1 = toRefDir(refDir, p1);
				var r2 = toRefDir(refDir, p2);
				// r1 and r2 have dir RIGHT
				if (r1.x + r1.length > r2.x && r2.x + r2.length > r1.x && Math.abs(r1.y - r2.y) < minDistance) {
					return false;
				}
			}
		}
	}

	function getNextState(tunnel) {
		var refDir = tunnel.dir;
		var rotated = toRefDir(refDir, tunnel);
		var result;
		if (tunnel.type == START) {
			result = {
				x: rotated.x - startOffset + tunnel.length,
				y: rotated.y,
				dir: RIGHT,
			};
		} else if (tunnel.type == TURN_LEFT) {
			result = {
				x: rotated.x + tunnelWidth / 2,
				y: rotated.y - tunnelWidth / 2 - tunnel.length - wallThickness,
				dir: UP,
			};
		} else if (tunnel.type == TURN_RIGHT) {
			result = {
				x: rotated.x + tunnelWidth / 2,
				y: rotated.y + tunnelWidth / 2 + tunnel.length + wallThickness,
				dir: DOWN,
			};
		} else if (tunnel.type == U_TURN_LEFT) {
			result = {
				x: rotated.x - tunnel.length,
				y: rotated.y - tunnelWidth - wallThickness,
				dir: LEFT,
			};
		} else if (tunnel.type == U_TURN_RIGHT) {
			result = {
				x: rotated.x - tunnel.length,
				y: rotated.y + tunnelWidth + wallThickness,
				dir: RIGHT,
			};
		}
		return fromRefDir(refDir, result);
	}

	a=0
	function generateTunnels(minX, minY, maxX, maxY) {
		var attempts = 0;
		while (true) {
			if(a>100)return
			attempts++;
			if (attempts > 100) {
				console.log("infinite loop");
				break;
			}

			var lastTunnel = tunnels[tunnels.length - 1];
			if (lastTunnel.x < minX || lastTunnel.y < minY || lastTunnel.x > maxX || lastTunnel.y > maxY) {
				break;
			}

			var turnType;
			if (Math.random() < 0.7) {
				if (Math.random() < 0.5) {
					turnType = TURN_LEFT;
				} else {
					turnType = TURN_RIGHT;
				}
			} else {
				if (Math.random() < 0.5) {
					turnType = U_TURN_LEFT;
				} else {
					turnType = U_TURN_RIGHT;
				}
			}

			var minLength = 100;
			var maxLength = 600;
			var length = Math.floor(minLength + Math.random() * (maxLength - minLength));

			var nextState = getNextState(lastTunnel);
			var tunnel = {
				x: nextState.x,
				y: nextState.y,
				dir: nextState.dir,
				type: turnType,
				length: length,
			};
			if (isTunnelValid(tunnel)) {
				a++
				addTunnel(tunnel);
			}
		}
	}

	function start() {
		player = {
			x: 0,
			y: 0,
			dx: 0,
			dy: 0,
		};

		a=0

		tunnels = [];
		walls = [];
		passages = []
		addTunnel({
			x: 0,
			y: 0,
			dir: Math.floor(Math.random() * 4),
			type: START,
			length: 100 + Math.floor(Math.random() * 300),
		});

		time = 0;
		playing = true;
		var lastUpdate = Date.now();
		interval = setInterval(function() {
			generateTunnels(player.x - canvas.width * 2, player.y - canvas.height * 2, player.x + canvas.width * 2, player.y + canvas.height * 2)
			while (Date.now() - lastUpdate > 10) {
				physics();
				lastUpdate += 10;
				locations.push({
					x: player.x,
					y: player.y,
				});
			}
			draw();
		}, 1000 / 60);
		locations = [];
	}

	function stop() {
		playing = false;
		clearInterval(interval);
	}

	start();

	function physics() {
		if (anyKeyDown("left")) player.dx -= player.dx < 0 ? accel : deaccel;
		if (anyKeyDown("right")) player.dx += player.dx > 0 ? accel : deaccel;
		if (anyKeyDown("up")) player.dy -= player.dy < 0 ? accel : deaccel;
		if (anyKeyDown("down")) player.dy += player.dy > 0 ? accel : deaccel;
		player.x += player.dx;
		player.y += player.dy;
		player.dx *= 1 - friction;
		player.dy *= 1 - friction;

		for (var i = 0; i < walls.length; i++) {
			if (collideBallRect({x: player.x, y: player.y, radius: radius}, walls[i])) {
				stop();
				break;
			}
		}

		if (time > 0 || anyKeyDown("left") || anyKeyDown("right") || anyKeyDown("up") || anyKeyDown("down")) time++;
	}

	function drawRect(x, y, width, height) {
		var offsetX = canvas.width / 2 - player.x;
		var offsetY = canvas.height / 2 - player.y;

		ctx.fillRect(x + offsetX, y + offsetY, width, height);
	}

	function drawCircle(x, y, radius) {
		var offsetX = canvas.width / 2 - player.x;
		var offsetY = canvas.height / 2 - player.y;

		ctx.beginPath();
		ctx.arc(x + offsetX, y + offsetY, radius, 0, Math.PI * 2);
		ctx.fill();
	}

	function draw() {
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.fillStyle = "black";
		for (var i = 0; i < walls.length; i++) {
			var wall = walls[i];
			drawRect(wall.x, wall.y, wall.width, wall.height);
		}

		ctx.fillStyle = "orange";
		drawCircle(player.x, player.y, radius);
	}

})();
