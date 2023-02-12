import * as particleSettings from "../emitter.json";

const particleContainer = new ParticleContainer();
app.stage.addChild(particleContainer);

const emitter = new particles.Emitter(
	particleContainer,
	Texture.from("particleTexture.png"),
	particleSettings
);
emitter.autoUpdate = true; // If you keep it false, you have to update your particles yourself.
emitter.updateSpawnPos(200, 100);
emitter.emit = true;
