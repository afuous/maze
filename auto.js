function auto() {
	keyUp("up");
	keyUp("down");
	keyUp("left");
	keyUp("right");

	keyDown("down");
	keyDown("right");
	wait(7);
	keyUp("right");
	keyDown("left");
	wait(2);
	keyUp("left");
	wait(103);
	keyUp("down");
	keyDown("up");
	wait(40);
	keyDown("right");
	wait(33);
	keyUp("right");
	keyDown("left");
	wait(20);
	keyUp("left");
	keyDown("right");
	wait(1);
	keyUp("right");
	wait(51);
	keyDown("right");
	wait(27);
	keyUp("up");
	keyDown("down");
	wait(66);
	keyUp("right");
	keyDown("left");
	wait(47);
	keyUp("left");
	wait(46);
	keyUp("down");
	keyDown("up");
	wait(22);
	keyDown("left");
	wait(51);
	keyUp("left");
	keyDown("right");
	wait(26);
	keyUp("right");
	wait(30);
	keyUp("up");
	keyDown("down");
	wait(12);
	keyDown("left");
	wait(54);
	keyUp("left");
	keyDown("right");
	wait(27);
	keyUp("right");
	wait(14);
	keyDown("right");
	wait(32);
	keyUp("down");
	keyDown("up");
	wait(67);
	keyUp("right");
	keyDown("left");
	wait(50);
	keyUp("left");
	wait(48);
	keyUp("up");
	keyDown("down");
	wait(27);
	keyDown("right");
	wait(65);
	keyUp("right");
	keyDown("left");
	wait(53);
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
