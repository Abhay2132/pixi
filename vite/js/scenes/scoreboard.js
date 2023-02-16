import {Container, Text,TextStyle } from "pixi.js";

export default class SB extends Container {
	constructor() {
		super()
		const styly = new TextStyle({
			align: "left",
			fill: "#000000",
			fontSize: 20,
			fontFamily: "sans",
		});
		const texty = new Text("Logs", styly); // Text supports unicode!
		texty.text = "Score : 0";
		texty.backgroundColor = 0x000000;
		texty.position.set(0,0);
		
		this.x = app.view.width / 2;
		this.y = 10;
		this.sb = texty

		this.addChild(this.sb);
	}
	
	set score (s) {
		//console.log(s)
		this.sb.text = "SCORE : " + parseInt(s || 0);
	}
}