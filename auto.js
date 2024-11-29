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
	wait(39);
	keyUp("down");
	keyDown("up");
	wait(4);
	keyDown("left");
	wait(51);
	keyUp("left");
	keyDown("right");
	wait(22);
	keyUp("right");
	wait(41);
	keyDown("left");
	wait(10);
	keyUp("up");
	keyDown("down");
	wait(49);
	keyUp("left");
	keyDown("right");
	wait(31);
	keyUp("right");
	wait(29);
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
	wait(10);
	keyDown("right");
	wait(60);
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
