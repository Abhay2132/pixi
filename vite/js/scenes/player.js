import { Event, log } from "../utilz";
import Ball from "./ball.js";

import { AnimatedSprite, Texture } from 'pixi.js';
var player_run = []
for(let i=0; i<8;i++) player_run.push(`sprites/run/Run (${i+1}).png`)

const textureArray = [];
player_run.forEach(texture => textureArray.push(Texture.from(texture)))

export default class Player extends Ball {
	constructor(opt) {
		super(opt);
		const p = new AnimatedSprite(textureArray);
		p.anchor.set(0.5)
		p.height = 70
		p.width = 70
		
		//p.scale.x = -1
		p.stop()
		
		p.x = -8;
		//p.y = -30;
		p.animationSpeed = 0.4;
		this.addChild(p)
		this.p = p;
		this.moving = false;
	}
	
	animate(tick){
		(this.moving ? this.p.play() : this.idle())
		super.scale.x = this.x < this.loc[0] ? 1 : -1;
		super.animate(tick)
	}
	
	idle () {
		this.p.currentFrame = 0;
		this.p.stop()
	}
	
	pause () {
		
	}
}
