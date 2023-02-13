import { Graphics, Container } from "pixi.js";
import { log, clamp } from "../utilz.js";
export default class Scene extends Container {
	constructor(opt) {
		super();

		const radius = 20;
		const bdr = 3;
		this.r = radius + bdr - 2;

		const { x = 200, y = 100, speed = 20, clr = 0xff0033 } = opt || {};
		this.ball = new Graphics();
		this.ball.beginFill(clr);
		this.ball.lineStyle(bdr, 0x000000);
		this.ball.drawCircle(0, 0, radius);
		this.ball.endFill();
		this.ball.x = x;
		this.ball.y = y;

		this.addChild(this.ball);
		this.speed = 400;
		this.loc = [];
		
		this.keepMoving = false;
		
		this.maxX = opt?.maxX || app.view.width - this.r
		this.minX = opt?.minX || this.r
		this.maxY = opt?.maxY || app.view.height - this.r
		this.minY = opt?.minY || this.r
		this.uid = opt?.uid || Date.now().toString(36)
		this.kill = opt?.kill || (()=>{})
	}

	animate(tick) {
		let { x, y } = this.ball;
		let [X, Y] = this.loc;
		let h = (X - x) * (X - x) + (Y - y) * (Y - y);
		let s = Math.abs(Math.sqrt(h));
		const ds = this.speed * tick * 0.001;
		if (!this.keepMoving && s < ds) {
			this.ball.x = clamp(X, this.minX, this.maxX);
			this.ball.y = clamp(Y, this.minY, this.maxY);
			return 
		}
		let a = Math.atan((y - Y) / (X - x)).toFixed(2);
		if (!a) return;
		
		let dx = (X - x > 0 ? 1 : -1) * Math.abs(ds * Math.cos(a) || 0);
		let dy = (Y - y > 0 ? 1 : -1) * Math.abs(ds * Math.sin(a) || 0);
		if (!(dx && dy)) return;
		this.ball.x = clamp(this.ball.x + dx, this.minX, this.maxX);
		this.ball.y = clamp(this.ball.y + dy, this.minY, this.maxY);
	}
}
