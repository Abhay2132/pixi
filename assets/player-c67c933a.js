import{A as a}from"./index-d9a6c702.js";import{B as h,A as p}from"./box-8b9def56.js";class o extends h{constructor(s){s.h=50,s.w=20,super(s),this.setup().then(()=>{this.isReady=1}),this.isReady=1,this.moving=!1}animate(s){this.isReady&&(this.moving?this.p.play():this.idle(),super.scale.x=this.x<this.loc.x?1:-1,super.animate(s))}idle(){this.p.currentFrame=0,this.p.stop()}pause(){this.idle(),this.speed=0}resume(){this.p&&this.p.play(),this.speed=this.o.speed}async setup(){const s=[];for(let e=0;e<8;e++){let i=await a.load(`sprites/run/Run (${e+1}).png`);s.push(i)}const t=new p(s);t.anchor.set(.5),t.height=70,t.width=70,t.stop(),t.x=-8,t.animationSpeed=.4,this.addChild(t),this.p=t}}export{o as default};
