import {
	Application,
	Graphics,
	TextStyle,
	Ticker,
	Container,
	Text,
} from "pixi.js";
import { wait, getLogger, config, log, clamp, resize, save } from "./utilz.js";
import BallScene from "./scenes/ball.js";
import Mob from "./scenes/mob.js";
window.app = new Application(config);
app.renderer.background.color = 0x6495ed;
document.body.appendChild(app.view);
window.onresize = app.resize;

const root = new Container();
const ball = new BallScene({ clr: 0x22aa15 });
app.stage.addChild(root);
root.addChild(ball);
const clog = getLogger(root);

app.view.addEventListener("touchstart", move);
app.view.addEventListener("touchmove", move);

var te = 0;
requestAnimationFrame(function tick(t) {
	requestAnimationFrame(tick);
	let dt = t - te;
	clog(`fps : ${parseInt(te ? 1000 / dt : 0)}`,`x : ${ball.ball.x.toFixed(2)}`,`y : ${ball.ball.y.toFixed(2)}`);
	te = t;
	ball.animate(dt);
	for(let [uid, mob] of mobs) 
		mob.animate(dt);
});

function move(e) {
	let { clientX: x, clientY: y } = e.touches[0];
	ball.loc[0] = x;
	ball.loc[1] = y;
}

const mobs = new Map();
const mobTimer = setInterval(() => {
	const {x,y} = Mob.randPos(0, app.view.width, 0, app.view.height);
	const mob = new Mob({x,y,clr: 0xff0000, kill(me){
		mobs.delete(me.uid);
		me.destroy()
	}});
	mob.loc = [ball.ball.x, ball.ball.y]
	mobs.set(mob.uid, mob);
	root.addChild(mob);
}, 200);

