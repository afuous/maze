startGame({
	"width" : 800,
	"height" : 600,
	"radius" : 20,
	"accel" : 0.05,
	"deaccel" : 0.1,
	"border" : 10,
	"friction" : 0,
	"color" : {
		"player" : "#ff6600",
		"walls" : "black",
		"end" : "green"
	},
	"start" : {
		"x" : 50,
		"y" : 50
	},
	"end" : {
		"x" : 650,
		"y" : 550,
		"width" : 150,
		"height" : 50
	},
	"score" : {
		"x" : 790,
		"y" : 30,
		"align" : "right",
		"font" : "30px Arial"
	},
	"walls" : [
		{
			"x" : 100,
			"y" : 0,
			"width" : 10,
			"height" : 500
		}, {
			"x" : 210,
			"y" : 100,
			"width" : 10,
			"height" : 500
		}, {
			"x" : 210,
			"y" : 100,
			"width" : 210,
			"height" : 10
		}, {
			"x" : 530,
			"y" : 0,
			"width" : 10,
			"height" : 490
		}, {
			"x" : 420,
			"y" : 100,
			"width" : 10,
			"height" : 290
		}, {
			"x" : 330,
			"y" : 490,
			"width" : 210,
			"height" : 10
		}, {
			"x" : 320,
			"y" : 210,
			"width" : 10,
			"height" : 290
		}, {
			"x" : 640,
			"y" : 100,
			"width" : 10,
			"height" : 500
		}
	]
});