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
	wait(36);
	keyUp("right");
	wait(1);
	keyDown("right");
	wait(8);
	keyUp("right");
	wait(1);
	keyDown("left");
	keyDown("right");
	wait(1);
	keyUp("left");
	wait(1);
	keyUp("right");
	wait(23);
	keyDown("left");
	wait(6);
	keyUp("left");
	wait(1);
	keyDown("left");
	wait(45);
	keyUp("left");
	wait(2);
	keyDown("left");
	wait(1);
	keyUp("left");
	wait(2);
	keyDown("right");
	wait(27);
	keyUp("up");
	wait(4);
	keyDown("down");
	wait(81);
	keyUp("right");
	keyDown("left");
	wait(35);
	keyUp("left");
	wait(1);
	keyDown("left");
	wait(11);
	keyUp("left");
	wait(1);
	keyDown("left");
	wait(3);
	keyUp("left");
	wait(18);
	keyDown("left");
	wait(3);
	keyUp("down");
	keyDown("up");
	wait(19);
	keyUp("left");
	wait(1);
	keyDown("left");
	wait(37);
	keyUp("left");
	wait(1);
	keyDown("right");
	wait(27);
	keyUp("right");
	wait(1);
	keyDown("right");
	wait(9);
	keyUp("right");
	wait(1);
	keyDown("right");
	wait(9);
	keyUp("right");
	wait(2);
	keyDown("left");
	wait(5);
	keyDown("right");
	wait(1);
	keyUp("right");
	wait(13);
	keyUp("up");
	keyDown("down");
	wait(34);
	keyUp("left");
	wait(1);
	keyDown("left");
	wait(5);
	keyUp("left");
	wait(20);
	keyDown("right");
	wait(20);
	keyUp("right");
	wait(1);
	keyDown("right");
	wait(2);
	keyUp("right");
	wait(1);
	keyDown("right");
	wait(3);
	keyUp("right");
	wait(21);
	keyDown("right");
	wait(28);
	keyUp("down");
	keyDown("up");
	wait(65);
	keyUp("right");
	wait(6);
	keyDown("right");
	wait(2);
	keyUp("right");
	wait(1);
	keyDown("left");
	wait(37);
	keyUp("left");
	wait(1);
	keyDown("left");
	wait(8);
	keyUp("left");
	wait(1);
	keyDown("left");
	wait(3);
	keyUp("left");
	wait(9);
	keyDown("left");
	wait(22);
	keyUp("left");
	wait(1);
	keyDown("left");
	wait(3);
	keyUp("up");
	wait(1);
	keyUp("left");
	keyDown("right");
	wait(2);
	keyDown("down");
	wait(56);
	keyUp("right");
	wait(46);
	keyDown("left");
	wait(10);
	keyUp("left");
	wait(1);
	keyDown("left");
	wait(13);
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
