import { Graphics, Container } from "pixi.js";
import { log, clamp } from "../utilz.js";
export default class Scene extends Container {
	constructor(opt) {
		super();

		const radius = 20;
		const bdr = 3;
		this.r = radius + bdr - 2;

		const { showShape = false, x = 200, y = 1100, speed = 400, clr = 0xff0033, loc = [] } = opt || {};
		
		this.ball = new Graphics();
		this.ball.beginFill(clr);
		this.ball.lineStyle(bdr, 0x000000);
		this.ball.drawCircle(0, 0, radius);
		this.ball.endFill();
		if(showShape) this.addChild(this.ball);
		
		this.x = x;
		this.y = y;
		this.speed = speed ;
		this.loc = loc

		this.setXYmm(opt)
		this.uid = opt?.uid || Date.now().toString(36);
		this.kill = opt?.kill || (() => {});
	}

	animate(tick) {
		let { x, y } = this;
		let [X, Y]= this.loc;
		let h = (X - x) * (X - x) + (Y - y) * (Y - y);
		let s = Math.abs(Math.sqrt(h));
		const ds = this.speed * tick * 0.001;
		if (s < ds) {
			this.x = clamp(X, this.minX, this.maxX);
			this.y = clamp(Y, this.minY, this.maxY);
			this.moving = !(parseInt(x) == parseInt(this.x) && parseInt(y) == parseInt(this.y))
			return;
		}
		let a = Math.atan((y - Y) / (X - x)).toFixed(2);
		if (!a) return;

		let dx = (X - x > 0 ? 1 : -1) * Math.abs(ds * Math.cos(a) || 0);
		let dy = (Y - y > 0 ? 1 : -1) * Math.abs(ds * Math.sin(a) || 0);
		if (!(dx && dy)) return;
		this.x = clamp(this.x + dx, this.minX, this.maxX);
		this.y = clamp(this.y + dy, this.minY, this.maxY);
		
		this.moving = !(parseInt(x) == parseInt(this.x) && parseInt(y) == parseInt(this.y))
		//log("x : %i , this.x : %i , y : %i , this.y : %i",parseInt(x), parseInt(this.x), parseInt(y) , parseInt(this.y))
	}
	
	setXYmm (opt) {
		this.maxX = opt?.maxX || app.view.width - this.r;
		this.minX = opt?.minX || this.r;
		this.maxY = opt?.maxY || app.view.height - this.r;
		this.minY = opt?.minY || this.r;
	}
}
