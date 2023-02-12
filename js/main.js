import {
	Application,
	Graphics,
	TextStyle,
	Ticker,
	Container,
	Text,
} from "pixi.js";
import { getLogger, config, log, clamp, resize, save } from "./utilz.js";
import BallScene from "./scenes/ball.js";

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

var tk = 0;
requestAnimationFrame(function tick(t) {
	requestAnimationFrame(tick);
	let dt = t - tk;
	clog(`fps : ${parseInt(tk ? 1000 / dt : 0)}`,`x : ${ball.ball.x.toFixed(2)}`,`y : ${ball.ball.y.toFixed(2)}`);
	tk = t;
	ball.animate();
});

function move(e) {
	let { clientX: x, clientY: y } = e.touches[0];
	ball.loc[0] = x;
	ball.loc[1] = y;
}

root.addChild(texty);
