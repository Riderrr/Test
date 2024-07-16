import { BLEND_MODES, Container, Point, Texture } from "pixi.js";
import { Particle } from "./particle";

//Custom emitter config
export type EmitterConfig = {
    textures: string[];
    blendMode: BLEND_MODES;
    emissionRate: number;
    lifeTime: number;
    startAlpha: number;
    endAlpha: number;
    startColor: number[];
    endColor: number[];
    velocity: [Point, Point];
    startScale: Point[] | Point;
    endScale: Point[] | Point;
    gravity: number;
};

//Emitter class
export class Emitter extends Container {
    private _emmit: boolean = false;
    private _particles: Particle[] = [];
    public _textureNames: string[] = [];
    private _config: EmitterConfig;

    private _timer = 0;

    private _lastSpriteNumber = 0;

    constructor(config: EmitterConfig) {
        super();

        this._config = config;
        this._textureNames = config.textures;
    }

    public Start(): void {
        this._emmit = true;
        this._timer = Date.now();

        this.SpawnParticle();
    }

    public Stop(): void {
        this._emmit = false;
    }

    private GetNextSpriteName(): string {
        return this._textureNames[this._lastSpriteNumber++ % this._textureNames.length];
    }

    //TODO use pool for particles spawning
    private SpawnParticle(): void {
        //Add particle sprites by this._config.emissionRate time value
        const particle = new Particle(
            {
                texture: Texture.from(this.GetNextSpriteName()),
            },
            this._config,
        );

        this.addChild(particle);
        this._particles.push(particle);
    }

    //Update particles loop
    private UpdateParticles(delta: number) {
        this._particles.forEach((particle, index) => {
            particle.Update(delta);

            //if particle is dead remove it from the container and update loop
            if (particle.dead) {
                this.removeChild(particle);
                this._particles.splice(index, 1);
            }
        });
    }

    public Update(delta: number): void {
        //Emit particles
        if (this._emmit) {
            this._timer += delta;
            if (this._timer >= this._config.emissionRate) {
                this._timer = 0;
                this.SpawnParticle();
            }

            this.UpdateParticles(delta);
        }
    }
}
