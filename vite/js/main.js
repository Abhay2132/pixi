import {
	Application,
	Graphics,
	TextStyle,
	Ticker,
	Container,
	Text,
} from "pixi.js";
import {$, loadAssets, requestAnimationFrame, cancelAnimationFrame, wait, getLogger, config, log, clamp, resize, save, rand } from "./utilz.js";
//import BallScene from "./scenes/player.js";
//import Mob from "./scenes/mob.js";
import assets from "./asset.js";

var Player, Mob;

window.app = new Application(config);
app.renderer.background.alpha = 0;
$("#game").appendChild(app.view);
window.onresize = () => {
	app.resize();
	ball && ball.setXYmm(ball.o);
	resize()
};
resize()
const root = new Container();
var ball
app.stage.addChild(root);
const clog = getLogger(root);

app.view.addEventListener("touchstart", move);
app.view.addEventListener("touchmove", move);

var mi = 0; // Mob timer interval
var te = 0;
var pause = 1;
var score = 0;
var lastMobSpawn = 0;
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
	lastMobSpawn += dt;
	if(lastMobSpawn > mi) mobSpawner();
});

function move(e) {
	let { clientX: x, clientY: y } = e.touches[0];
	ball.loc[0] = x;
	ball.loc[1] = y;
}

var go = false; // game over 
var mobsOff = false;
const mobs = new Map();
//const getMobTimer = () => {setInterval(() => {
const mobSpawner = () => {
	lastMobSpawn=0;
	if(mobsOff) return;
	const { x, y } = Mob.randPos(0, app.view.width, 0, app.view.height);
	const mob = new Mob({x,y,clr: 0xff0000,
		showShape: false,
		speed : rand(ball.speed*0.4, ball.speed*0.9),
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
			gameOver(me);
			},
		loc : [ball.x, ball.y]
	});
	mobs.set(mob.uid, mob);
	root.addChild(mob);
}//, mi);

var mobTimer// = getMobTimer()

function gameOver (mob) {
	pause = true;
	//clearInterval(mobTimer);
	mobsOff = 0;
	mobs.forEach(mob => {
		//mob.speed = 0;
		mob.p.stop()
		mob.p.currentFrame = 0; 
	});
	ball.idle()
	setTimeout(startGame, 1000);
}

function startGame () {
		
		if(!Mob) {
			return import("./scenes/mob.js")
			.then(i => {
				Mob = i.default;
				startGame ()
			})
		}
	if(!ball){
		if(!Player) {
			return import("./scenes/player.js")
			.then(i => {
				Player = i.default;
				startGame ()
			})
		}
		ball = new Player({ showShape: 0,clr: 0x22aa15 })
		root.addChild(ball);
	}
	
	mobs.forEach(mob => mob.kill(mob));
	pause = false;
	//mobTimer = getMobTimer();
	mobsOff = 0;
	score = 0
	ball.loc[0] = app.view.width/2 //rand(30, app.view.width-40)
	ball.loc[1] = app.view.height/2//rand(30,app.view.height-40)
}

async function play(m) {
	mi = m;
	await hideHud();
	loadAssets(assets).then(startGame)
}

const hud = $("#hud");
const ss = $("#start-screen");
const lvl = $("#lvl");
const hideHud = async () => {
	hud.style.opacity = 0;
	await wait(1000);
	hud.style.display = "none";
}

function showLvl () {
	ss.setAttribute("state", "");
	lvl.setAttribute("state", "active");
}

$("#play").addEventListener("click", showLvl);
$("#easy").addEventListener("click", ()=>play(2000));
$("#medium").addEventListener("click", ()=>play(1500));
$("#hard").addEventListener("click", ()=>play(1000));
$("#asian").addEventListener("click", ()=>play(500));