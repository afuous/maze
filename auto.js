function auto() {
	keyUp("up");
	keyUp("down");
	keyUp("left");
	keyUp("right");

	keyDown("down");
	wait(111);
	keyUp("down");
	keyDown("up");
	wait(11);
	keyDown("right");
	wait(46);
	keyUp("right");
	keyDown("left");
	wait(25);
	keyUp("left");
	keyDown("right");
	wait(1);
	keyUp("right");
	wait(65);
	keyDown("right");
	wait(21);
	keyUp("up");
	keyDown("down");
	wait(73);
	keyUp("right");
	keyDown("left");
	wait(44);
	keyUp("left");
	wait(37);
	keyUp("down");
	wait(2);
	keyDown("up");
	wait(1);
	keyDown("left");
	wait(54);
	keyUp("left");
	keyDown("right");
	wait(25);
	keyUp("right");
	wait(38);
	keyDown("left");
	wait(8);
	keyUp("up");
	keyDown("down");
	wait(53);
	keyUp("left");
	keyDown("right");
	wait(31);
	keyUp("right");
	wait(25);
	keyDown("right");
	wait(28);
	keyUp("down");
	keyDown("up");
	wait(69);
	keyUp("right");
	keyDown("left");
	wait(50);
	keyUp("left");
	wait(43);
	keyUp("up");
	keyDown("down");
	wait(14);
	keyDown("right");
	wait(56);
	keyUp("right");
	keyDown("left");
	wait(30);
	keyUp("left");
}

window.autoMoves = [];

function keyDown(dir) {
	autoMoves.push({
		type: "keyDown",
		dir: dir,
	});
}

function keyUp(dir) {
	autoMoves.push({
		type: "keyUp",
		dir: dir,
	});
}

function wait(t) {
	autoMoves.push({
		type: "wait",
		t: t,
	});
}

auto();

function runAuto(keys, time) {
	var keyMap = {
		left: 37,
		right: 39,
		up: 38,
		down: 40,
	};

	var elapsed = 0;
	var i = 0;
	while (time >= elapsed && i < autoMoves.length) {
		var move = autoMoves[i];
		if (move.type == "keyDown") {
			keys[keyMap[move.dir]] = true;
		}
		if (move.type == "keyUp") {
			keys[keyMap[move.dir]] = false;
		}
		if (move.type == "wait") {
			elapsed += move.t;
		}
		i++;
	}
}
