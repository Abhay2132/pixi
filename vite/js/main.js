import {
	Application,
	Graphics,
	TextStyle,
	Ticker,
	Container,
	Text,
} from "pixi.js";
import { requestAnimationFrame, cancelAnimationFrame, wait, getLogger, config, log, clamp, resize, save } from "./utilz.js";
import BallScene from "./scenes/player.js";
import Mob from "./scenes/mob.js";
window.app = new Application(config);
app.renderer.background.alpha = 0;
document.body.appendChild(app.view);
window.onresize = () => {
	app.resize();
	ball.setXYmm();
};

const root = new Container();
const ball = new BallScene({ showShape: 0,clr: 0x22aa15 });
app.stage.addChild(root);
root.addChild(ball);
const clog = getLogger(root);

app.view.addEventListener("touchstart", move);
app.view.addEventListener("touchmove", move);

var te = 0;
var pause = !1;
var score = 0
const gameLoop = requestAnimationFrame(function tick(t) {
	requestAnimationFrame(tick);
	let dt = t - te;
	clog(
		`fps : ${parseInt(te ? 1000 / dt : 0)}`,
		`score : ${score}`,
		`mobs : ${mobs.size}`
	);
	te = t;
	if(pause) return;
	ball.animate(dt);
	//for (let [uid, mob] of mobs) mob.animate(dt);
	mobs.forEach(mob => mob.animate(dt))
});

function move(e) {
	let { clientX: x, clientY: y } = e.touches[0];
	ball.loc[0] = x;
	ball.loc[1] = y;
}

const mobs = new Map();
const getMobTimer = () => setInterval(() => {
	const { x, y } = Mob.randPos(0, app.view.width, 0, app.view.height);
	const mob = new Mob({x,y,clr: 0xff0000,
		showShape: false,
		speed : ball.speed/2,
		kill(me) {
			mobs.delete(me.uid);
			me.destroy();
			score++
		},
		isCollided(me){
			let {x:x1, y:y1} = ball;
			let {x:x2, y:y2} = me;
			let Y = y2-y1 , X = x2 - x1;
			let s = Math.sqrt(Y*Y + X*X)
			let ds = ball.r + me.r;
			if(s < ds) return true;
			return false;
		},
		onCollide(me){
			gameOver();
			},
		loc : [ball.x, ball.y]
	});
	mobs.set(mob.uid, mob);
	root.addChild(mob);
}, 200);

var mobTimer// = getMobTimer()

function gameOver () {
	pause = true;
	clearInterval(mobTimer);
	mobs.forEach(mob => {
		//mob.speed = 0;
		mob.p.stop()
		mob.p.currentFrame = 0; 
	});
	setTimeout(startGame, 1000);
}

function startGame () {
	mobs.forEach(mob => mob.kill(mob));
	pause = false;
	mobTimer = getMobTimer();
	score = 0
	ball.loc[0] = app.view.width / 2;
	ball.loc[1] = app.view.height / 2;
}
startGame();

//let mob = new Mob({showShape: true,x:150,y:200, kill(me){ me.destroy() } })
//root.addChild(mob)