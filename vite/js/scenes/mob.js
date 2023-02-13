import Ball from "./ball.js";
import { rand } from "../utilz.js"

export default class Mob extends Ball {
	constructor(opt) {
		super(opt);
		this.keepMoving = true;
	}
	
	animate(tick) {
		if(this.ball.x < this.minX - (2*this.r) || this.ball.x > this.maxX + (2*this.r) || 
			this.ball.y < this.minY - (2*this.r) || this.ball.y > this.maxY + (2*this.r) )
			return this.kill(this);
		if(!( this.dx || this.y)) {
		let { x, y } = this.ball;
		let [X, Y] = this.loc;
		const ds = this.speed * tick * 0.001;
		let a = Math.atan((y - Y) / (X - x)).toFixed(2);
		if (!a) return;
		this.dx = (X - x > 0 ? 1 : -1) * Math.abs(ds * Math.cos(a) || 0);
		this.dy = (Y - y > 0 ? 1 : -1) * Math.abs(ds * Math.sin(a) || 0);
		if (!(this.dx && this.dy)) return;
		}
		this.ball.x += this.dx//clamp(this.ball.x + dx, this.minX, this.maxX);
		this.ball.y += this.dy//clamp(this.ball.y + dy, this.minY, this.maxY);
	}
	
	static randPos (minX, maxX, minY, maxY) {
		let x,y;
		let ver = parseInt(Math.random()*1000)%2 == 0;
		if(ver) {
			y = parseInt(Math.random()*1000)%2 == 0 ? minY : maxY;
			x = rand(minX, maxX);
		} else {
			x = parseInt(Math.random()*1000)%2 == 0 ? minY : maxY;
			y = rand(minX, maxX);
		}
		
		return {x, y};
	}
}
