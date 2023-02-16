import { Event, log } from "../utilz";
import box from "./box.js";

import { AnimatedSprite, Texture, Assets } from 'pixi.js';

export default class Player extends box {
	constructor(opt) {
		opt.h = 50
		opt.w = 20
		//opt.showShape = 1
		super(opt);
		this.setup()
		.then(() => {this.isReady = 1});
		this.isReady = 1
		this.moving = false;
	}
	
	animate(tick){
		if(!this.isReady) return;
		(this.moving ? this.p.play() : this.idle())
		super.scale.x = this.x < this.loc.x ? 1 : -1;
		super.animate(tick)
	}
	
	idle () {
		//return
		this.p.currentFrame = 0;
		this.p.stop()
	}
	
	pause () {
		//return
		this.idle()
		this.speed = 0;
	}
	
	resume () {
		//return
		this.p && this.p.play()
		this.speed = this.o.speed;
	}
	
	async setup() {
		const ta = []
		for(let i=0; i<8;i++) { 
			let  t = await Assets.load(`sprites/run/Run (${i+1}).png`); 
			ta.push(t)
		}
		const p = new AnimatedSprite(ta);
		p.anchor.set(0.5)
		p.height = 70
		p.width = 70
		p.stop()
		
		p.x = -8;
		p.animationSpeed = 0.4;
		this.addChild(p)
		this.p = p;
	}
}
