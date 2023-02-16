import { Graphics, Container ,Text,TextStyle} from "pixi.js";
import { log, clamp } from "../utilz.js";
export default class Box extends Container {
	constructor(opt) {
		super();
		opt = this.normalize(opt)
		this.o = opt		
		const {h,w,showShape,x,y,speed,clr,loc} = opt
		
		let box = new Graphics();
		box.beginFill(clr);
		//box.lineStyle(bdr, 0x000000);
		box.drawRect(-w/2, -h/2, w,h);
		box.endFill();
		if(showShape) this.addChild(box);
		this.box = box;
		this.x = x;
		this.y = y;
		this.speed = speed ;
		this.loc = loc
		this.ix = x;
		this.iy = y;
		this.setXYmm(opt)
		if(opt.dev) this.addLogger();
		this.uid = opt?.uid || Date.now().toString(36);
		this.kill = opt?.kill || (() => {});
	}

	animate(tick) {
		let { x, y } = this;
		if(this.o.dev) this.log(parseInt(x),parseInt(y))
		let {x:X, y:Y}= this.loc;
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
		if(!opt) opt = this.o
		this.maxX = opt?.maxX || app.view.width - this.w;
		this.minX = opt?.minX || this.w;
		this.maxY = opt?.maxY || app.view.height - this.h;
		this.minY = opt?.minY || this.h;
	}
	
	normalize(opt){
		if(! opt.h) opt.h = 60;
		if(!opt.w) opt.w = 40;
		if(!opt.showShape) opt.showShape = 0;
		if(!opt.x) opt.x = 0
		if(!opt.y) opt.y = 0
		if(!opt.speed) opt.speed = 400
		if(!opt.clr) opt.clr = 0x00ff00
		if(!opt.loc) opt.loc = {x:app.view.width /2, y : app.view.height /2 }
		
		if(!opt.dev) opt.dev = 0;
		return opt
	}
	
	addLogger() {
		const styly = new TextStyle({
			align: "left",
			fill: "#000000",
			fontSize: 10,
			fontFamily: "sans",
		});
		const texty = new Text("Logs", styly); // Text supports unicode!
		texty.text = "Logs";
		texty.backgroundColor = 0x000000;
		texty.position.set(-10,-40);
		
		this.log = function (...a) {
		let txt = a.join("\n");
		texty.text = txt;
	};
		this.addChild(texty);
		this.logger = texty
	}
}
