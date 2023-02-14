import Ball from "./ball.js";
import {log, rand } from "../utilz.js";
import { AnimatedSprite, Texture } from 'pixi.js';

var mob_run = []
for(let i=0; i<20;i++) mob_run.push(`/sprites/girl/Run (${i+1}).png`)
const textureArray = [];
mob_run.forEach(texture => textureArray.push(Texture.from(texture)))

export default class Mob extends Ball {
	constructor(opt) {
		//opt.showShape = true
		super(opt);
		this.keepMoving = true;
		this.isCollided = opt?.isCollided
		this.onCollide = opt?.onCollide
		this.setup()
		
		let maxDist = Math.sqrt(this.maxX * this.maxX + this.maxY * this.maxY)
		let time = maxDist / this.speed * 1000
		
		//log({maxDist, time})
		setTimeout(() => this.kill(this), time);
	}

	animate(tick) {
		/*
		if (
			this.x < this.minX - 2 * this.r ||
			this.x > this.maxX + 2 * this.r ||
			this.y < this.minY - 2 * this.r ||
			this.y > this.maxY + 2 * this.r
		) {
			log("Killed")
			return this.kill(this);
		}
		*/
		
		//log(this.x , this.y)
		if (!(this.dx && this.y)) {
			let { x, y } = this
			let [X, Y] = this.loc;
			
			const ds = this.speed * tick * 0.001;
			let a = Math.atan((y - Y) / (X - x)).toFixed(2) || 0;
			
			if (!a) return;
			this.dx = (X - x > 0 ? 1 : -1) * Math.abs(ds * Math.cos(a) || 0);
			this.dy = (Y - y > 0 ? 1 : -1) * Math.abs(ds * Math.sin(a) || 0);
			if (!(this.dx && this.dy)) return;
		}
		this.x += this.dx; //clamp(this.x + dx, this.minX, this.maxX);
		this.y += this.dy; //clamp(this.y + dy, this.minY, this.maxY);
		
		if(this.isCollided(this)) this.onCollide()
	}

	static randPos(minX, maxX, minY, maxY) {
		let x, y;
		let ver = parseInt(Math.random() * 1000) % 2 == 0;
		if (ver) {
			y = parseInt(Math.random() * 1000) % 2 == 0 ? minY : maxY;
			x = rand(minX, maxX);
		} else {
			x = parseInt(Math.random() * 1000) % 2 == 0 ? minY : maxY;
			y = rand(minX, maxX);
		}

		return { x, y };
	}
	
	setup() {
		const p = new AnimatedSprite(textureArray);
		p.height = 50
		p.width = 50
		
		super.scale.x = this.x < this.loc[0] ? 1 : -1;
		p.play()
		p.x = -30;
		p.y = -25;
		p.animationSpeed = 0.6;
		this.addChild(p)
		this.p = p;
	}
}

