import Box from "./box.js";
import {fc, log, rand } from "../utilz.js";
import { AnimatedSprite, Texture, Assets } from 'pixi.js';

var mob_run = []
for(let i=0; i<20;i++) mob_run.push(`sprites/girl/Run (${i+1}).png`)
const textureArray = [];
mob_run.forEach(texture => textureArray.push(Texture.from(texture)))

export default class Mob extends Box {
	constructor(opt) {
		opt.h = 40;
		opt.w = 30;
		//opt.showShape = true
		super(opt);
		this.isCollided = opt?.isCollided
		this.onCollide = opt?.onCollide
		this.setup()
		.then(() => {this.isReady = 1});
		
		this.isReady = 1;
	}

	animate(tick) {
		if(!this.isReady) return;
		//(this.moving ? this.p.play() : this.idle())
		if(this.o.dev) this.log(parseInt(this.ix),parseInt(this.iy))
		if (
			this.x < 0 ||
			this.x > app.view.width ||
			this.y < 0 ||
			this.y > app.view.height
		) return this.kill(this);
		
		let { x, y } = this
		if (!(this.dx && this.y)) {
			let {x:X, y:Y} = this.loc;
			
			const ds = this.speed * tick * 0.001;
			let a = Math.atan((y - Y) / (X - x)).toFixed(2) || 0;
			
			if (!a) return;
			this.dx = (X - x > 0 ? 1 : -1) * Math.abs(ds * Math.cos(a) || 0);
			this.dy = (Y - y > 0 ? 1 : -1) * Math.abs(ds * Math.sin(a) || 0);
			if (!(this.dx && this.dy)) return;
		}
		this.x += this.dx; //clamp(this.x + dx, this.minX, this.maxX);
		this.y += this.dy; //clamp(this.y + dy, this.minY, this.maxY);
		if(this.isCollided(this)) this.onCollide(this)
	}

	static randPos(minX, maxX, minY, maxY) {
		let x, y;
		let ver = fc()
		if (ver) {
			y = fc() ? minY : maxY;
			x = rand(minX, maxX);
		} else {
			x = fc() ? minY : maxY;
			y = rand(minX, maxX);
		}

		return { x, y };
	}
	
	async setup() {
		const ta = []
		for(let i=0; i<20;i++){ 
			let  t = await Assets.load(`sprites/girl/Run (${i+1}).png`); 
			ta.push(t)
		}
		const p = new AnimatedSprite(ta);
		p.height = 50
		p.width = 50
		
		super.scale.x = this.x < this.loc.x ? 1 : -1;
		p.play()
		p.x = -30;
		p.y = -30;
		p.animationSpeed = 0.6;
		this.addChild(p)
		this.p = p;
	}
	
	idle () {
		this.p.currentFrame = 0;
		this.p.stop()
		this.speed =0;
		this.dy =0
		this.dx =0;
	}
	
	resume(){
		this.p.play()
		this.speed = this.o.speed
	}
}

