import { Event, log } from "../utilz";
import Ball from "./ball.js";

import { AnimatedSprite, Texture } from 'pixi.js';

var player_run = [
	"Run (1).png",
	"Run (2).png",
	"Run (3).png",
	"Run (4).png",
	"Run (5).png",
	"Run (6).png",
	"Run (7).png",
	"Run (8).png",
]
player_run = player_run.map((a) => "/sprites/run/"+a);

log(player_run)
const textureArray = [];
player_run.forEach(texture => textureArray.push(Texture.from(texture)))

export default class Player extends Ball {
	constructor(opt) {
		super(opt);
		const p = new AnimatedSprite(textureArray);
		p.height = 50
		p.width = 50
		
		//p.scale.x = -1
		p.stop()
		p.x = -30;
		p.y = -25;
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
}
