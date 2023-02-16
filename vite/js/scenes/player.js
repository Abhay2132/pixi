import { Event, log } from "../utilz";
import Ball from "./ball.js";

import { AnimatedSprite, Texture, Assets } from 'pixi.js';

export default class Player extends Ball {
	constructor(opt) {
		super(opt);
		this.setup()
		.then(() => {this.isReady = 1});
		this.moving = false;
	}
	
	animate(tick){
		if(!this.isReady) return;
		(this.moving ? this.p.play() : this.idle())
		super.scale.x = this.x < this.loc[0] ? 1 : -1;
		super.animate(tick)
	}
	
	idle () {
		this.p.currentFrame = 0;
		this.p.stop()
	}
	
	pause () {
		this.idle()
		this.speed = 0;
	}
	
	resume () {
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
