import { TextStyle, Text } from "pixi.js";

export const $ = (a) => document.querySelector(a);
export const rand = (a, z) => Math.floor(Math.random() * (z - a) + a + 1);

const h = window.innerHeight;
const w = window.innerWidth;

export const log = console.log;
export const config = {
	height: h,
	width: w,
	antialias: true,
	transparent: true,
	resolution: 1,
	autoDensity: true,
	resizeTo: window,
	backgroundAlpha : 0,
};

export function resize(cb) {
	const x = window.innerHeight;
	const y = window.innerWidth;
	let s = document.documentElement.style;
	s.setProperty("--wh", y + "px");
	s.setProperty("--ww", x + "px");
	cb && cb(x, y);
}

export function clamp(a, p, q) {
	if (a < p) return p;
	if (a > q) return q;
	return a;
}

const a = $("a.d-no");
export function save(canvas) {
	log({ canvas });
	const data = canvas.toDataURL("image/png");
	a.download = "image" + rand(0, 99) + ".png";
	a.href = data;
	a.click();
}

const styly = new TextStyle({
	align: "left",
	fill: "#000000",
	fontSize: 10,
	fontFamily: "sans",
});
const texty = new Text("Logs", styly); // Text supports unicode!
texty.text = "Logs";
texty.backgroundColor = 0x000000;
texty.position.set(10, 10);

export const getLogger = (c) => {
	c.addChild(texty);
	return function (...a) {
		let txt = a.join("\n");
		texty.text = txt;
	};
};

export const wait = (t) => new Promise((a) => setTimeout(a, t || 0));
export class Event {
	#events = new Map();
	constructor() {}
	on(name, cb) {
		this.#events.set(name, cb);
		return this;
	}
	emit(name) {
		let cb = this.#events.get(name);
		if (cb) cb();
		return this;
	}
	remove(name) {
		if (this.#events.get(name)) this.#events.delete(name);
		return this;
	}
}

export const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
                            window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;

export const cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;