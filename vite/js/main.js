import {
	Application,
	Graphics,
	TextStyle,
	Ticker,
	Container,
	Text,
	Assets
} from "pixi.js";
import { Sound } from "@pixi/sound";
import {$,$$,inR, requestAnimationFrame, cancelAnimationFrame, wait, getLogger, config, log, clamp, resize, save, rand } from "./utilz.js";
import assets from "./asset.js";
var Player, Mob;

const sb = $("#scoreboard")
const setScore = s => {sb.textContent=parseInt(s||0)};
window.app = new Application(config);
app.renderer.background.alpha = 0;
$("#game").appendChild(app.view);
window.onresize = () => {
	app.resize();
	p && p.setXYmm(p.o);
	resize()
};
resize()
const root = new Container();
var p
app.stage.addChild(root);
const clog = getLogger(root);

app.view.addEventListener("touchstart", move);
app.view.addEventListener("touchmove", move);

var mi = 1000; // Mob timer interval
var te = 0;
var pause = 1;
var score = 0, ds = 1;
var lastMobSpawn = 0;
const gameLoop = requestAnimationFrame(function tick(t) {
	requestAnimationFrame(tick);
	let dt = t - te;
	location.href.startsWith("http://localhost") && clog(
		`fps : ${parseInt(te ? 1000 / dt : 0)}`,
		`mi : ${mi.toFixed(2)}`,
		`mobs : ${mobs.size}`,
		`ds : ${ds}`
	);
	te = t;
	if(pause) return;
	p.animate(dt);
	mobs.forEach(mob => mob.animate(dt))
	lastMobSpawn += dt;
	if(lastMobSpawn > mi) mobSpawner();
	setScore(score);
	if(mi > 300) mi += -0.2
	ds = mi / 2000;
});

function move(e) {
	if(!p) return;
	let { clientX: x, clientY: y } = e.touches[0];
	p.loc = {x,y};
}

var go = false; // game over 
var mobsOff = 1;
const mobs = new Map();

const mobSpawner = () => {
	lastMobSpawn=0;
	if(mobsOff) return;
	const { x, y } = Mob.randPos(-p.o.w, app.view.width, -p.o.h, app.view.height);
	const mob = new Mob({x,y,clr: 0xff0000,
		showShape: false,
		speed : rand(p.speed*0.4, p.speed*0.7),
		kill(me) {
			mobs.delete(me.uid);
			me.destroy();
			score += ds
		},
		isCollided(me){
			let {x,y} = p
			let {w,h} = p.o
			let {x:X, y:Y} = me
			let {w:W,h:H} = me.o
			
			let x1 = x-w/2
			let x2 = x+w/2
			let y1 = y-h/2
			let y2 = y+h/2
			
			let X1 = X-W/2
			let X2 = X+W/2
			let Y1 = Y-H/2
			let Y2 = Y+H/2
			
			if((inR(x1, X1,X2) || inR(x2, X1,X2)) &&
				(inR(y1, Y1,Y2) || inR(y2, Y1,Y2)))
				return 1
			return 0
		},
		onCollide(me){
			gameOver(me);
			},
		loc : {x : p.x, y:p.y}
	});
	mobs.set(mob.uid, mob);
	root.addChild(mob);
}//, mi);
var uwu
var mobTimer// = getMobTimer()

async function gameOver (mob) {
	bgm.stop();
	if(!uwu) uwu = await Sound.from((await Assets.load("audio/uwu.mp3")))
	uwu.play()
	pause = true;
	//clearInterval(mobTimer);
	mobsOff = 0;
	mobs.forEach(mob => {
		mob.idle()
	});
	p.idle()
	
	setHud("#over")
	hud.style.display = "block";
	await wait(1000);
	hud.style.opacity = 1;
}
const over = $("#over");
var bgm;
async function startGame () {
	if(!p){
		p = new Player({ showShape: 0,clr: 0x22aa15 })
		root.addChild(p);
	}
	
	mobs.forEach(mob => mob.kill(mob));
	pause = false;
	
	mobsOff = 0;
	score = 0;
	p.loc.x = app.view.width/2 //rand(30, app.view.width-40)
	p.loc.y = app.view.height/2//rand(30,app.view.height-40)
	sb.style.display = "block";
	
	bgm.play();
}

//startGame()
async function play(m, s) {
	mi = m;
	await hideHud();
	startGame();
}

async function loadAssets(cb){
	const l = assets.length + 2;
	for(let i=0; i<assets.length; i++){
		let asset = assets[i];
		await Assets.load(asset);
		cb && cb(i+1,l)
	}
	Player = (await import("./scenes/player.js")).default;
	cb && cb(l-1,l)
	Mob = (await import("./scenes/mob.js")).default;
	cb && cb(l,l);
	bgm = await Sound.from((await Assets.load("audio/bgm.mp3")))
};

loadAssets( (i,l) => {
	$("#loading").setAttribute("value", i/l*100);
	if(l ==i)  setTimeout(() => $("#start-screen").setAttribute("ss-state", "loaded"), 200);
})

const hud = $("#hud");
const ss = $("#start-screen");
const lvl = $("#lvl");
const hideHud = async () => {
	hud.style.opacity = 0;
	await wait(500);
	hud.style.display = "none";
}

function setHud ( id , cb ) {
	$$("#hud > [state=active]").forEach(t => t.setAttribute("state", ""))
	$(id).setAttribute("state", "active");
	cb && cb()
}

function rs () {
	$("#scoreboard").style.display = "none";
	$("#scoreboard").textContent = 0;
}

$("#play").addEventListener("click", () => setHud("#lvl"));

$("#easy").addEventListener("click", ()=>play(2000, 1));
$("#medium").addEventListener("click", ()=>play(1500, 0.8));
$("#hard").addEventListener("click", ()=>play(1000,0.5));
$("#asian").addEventListener("click", ()=>play(400,0.15));

$("#restart").addEventListener("click",  () => setHud("#lvl", rs));
$("#home").addEventListener("click",  () => setHud("#start-screen", rs));