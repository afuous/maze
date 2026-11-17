function auto() {
	keyUp("up");
	keyUp("down");
	keyUp("left");
	keyUp("right");

	keyDown("right");
	keyDown("down");
	wait(2);
	keyUp("right");
	keyDown("left");
	wait(1);
	keyUp("left");
	wait(25);
	keyDown("left");
	wait(4);
	keyUp("left");
	wait(10);
	keyDown("right");
	wait(4);
	keyUp("right");
	keyDown("left");
	wait(1);
	keyUp("left");
	wait(22);
	keyDown("left");
	wait(3);
	keyUp("left");
	wait(10);
	keyDown("right");
	wait(2);
	keyUp("right");
	wait(21);
	keyUp("down");
	wait(1);
	keyDown("down");
	wait(5);
	keyUp("down");
	keyDown("up");
	wait(1);
	keyDown("left");
	wait(4);
	keyUp("left");
	keyDown("right");
	wait(2);
	keyUp("right");
	wait(2);
	keyDown("right");
	wait(9);
	keyUp("up");
	wait(1);
	keyDown("up");
	wait(16);
	keyUp("right");
	wait(1);
	keyDown("right");
	wait(18);
	keyUp("right");
	wait(1);
	keyDown("left");
	wait(12);
	keyUp("left");
	wait(1);
	keyDown("left");
	wait(9);
	keyUp("left");
	keyDown("right");
	wait(5);
	keyUp("right");
	wait(2);
	keyDown("left");
	wait(6);
	keyUp("left");
	wait(9);
	keyDown("right");
	wait(4);
	keyUp("right");
	wait(13);
	keyDown("left");
	wait(3);
	keyUp("left");
	wait(26);
	keyDown("right");
	wait(2);
	keyUp("right");
	wait(1);
	keyDown("right");
	wait(5);
	keyUp("right");
	wait(1);
	keyDown("right");
	wait(12);
	keyUp("up");
	wait(2);
	keyDown("down");
	wait(2);
	keyUp("down");
	wait(2);
	keyDown("down");
	wait(71);
	keyUp("right");
	wait(1);
	keyDown("left");
	wait(49);
	keyUp("left");
	keyDown("right");
	wait(8);
	keyUp("right");
	keyDown("left");
	wait(8);
	keyUp("down");
	wait(1);
	keyDown("down");
	wait(9);
	keyUp("left");
	keyDown("right");
	wait(2);
	keyUp("down");
	wait(1);
	keyDown("down");
	wait(1);
	keyUp("down");
	keyDown("up");
	wait(3);
	keyUp("up");
	wait(1);
	keyUp("right");
	keyDown("left");
	keyDown("up");
	wait(14);
	keyUp("left");
	wait(1);
	keyDown("left");
	wait(10);
	keyUp("left");
	wait(2);
	keyDown("left");
	wait(19);
	keyUp("left");
	keyDown("right");
	wait(2);
	keyUp("right");
	wait(6);
	keyDown("right");
	wait(18);
	keyUp("right");
	wait(34);
	keyDown("right");
	wait(2);
	keyUp("right");
	keyDown("left");
	wait(10);
	keyUp("up");
	wait(5);
	keyDown("down");
	wait(7);
	keyUp("down");
	keyDown("up");
	wait(1);
	keyUp("up");
	keyDown("down");
	wait(36);
	keyUp("left");
	keyDown("right");
	wait(1);
	keyUp("right");
	wait(1);
	keyDown("right");
	wait(8);
	keyUp("right");
	keyDown("left");
	wait(2);
	keyUp("left");
	keyDown("right");
	wait(8);
	keyUp("right");
	wait(1);
	keyDown("right");
	wait(5);
	keyUp("right");
	wait(1);
	keyDown("right");
	wait(5);
	keyUp("right");
	keyDown("left");
	wait(6);
	keyUp("left");
	wait(20);
	keyDown("right");
	wait(31);
	keyUp("down");
	wait(1);
	keyDown("up");
	wait(2);
	keyUp("up");
	keyDown("down");
	wait(1);
	keyUp("down");
	wait(1);
	keyDown("up");
	wait(68);
	keyUp("right");
	keyDown("left");
	wait(79);
	keyUp("left");
	keyDown("right");
	wait(10);
	keyUp("up");
	wait(2);
	keyDown("down");
	wait(52);
	keyUp("right");
	keyDown("left");
	wait(24);
	keyUp("left");
	wait(113);
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
