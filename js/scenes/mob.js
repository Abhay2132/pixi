import Ball from "./ball.js";

export default class Mob extends Ball {
	constructor(opt) {
		super(opt);
	}
	animate(loc) {
		let { x, y } = this.ball;
		let [X, Y] = this.loc;
		let h = (X - x) * (X - x) + (Y - y) * (Y - y);
		let s = Math.abs(Math.sqrt(h));
		if (s < this.speed) {
			this.ball.x = clamp(X, this.r, app.view.width - this.r);
			this.ball.y = clamp(Y, this.r, app.view.height - this.r);
			return;
		}
		let a = Math.atan((y - Y) / (X - x)).toFixed(2);
		if (!a) return;
		let dx = (X - x > 0 ? 1 : -1) * Math.abs(this.speed * Math.cos(a) || 0);
		let dy = (Y - y > 0 ? 1 : -1) * Math.abs(this.speed * Math.sin(a) || 0);
		if (!(dx && dy)) return;
		this.ball.x = clamp(this.ball.x + dx, this.r, app.view.width - this.r);
		this.ball.y = clamp(this.ball.y + dy, this.r, app.view.height - this.r);
	}
}
