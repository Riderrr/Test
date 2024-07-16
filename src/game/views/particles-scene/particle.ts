import { Point, Sprite } from "pixi.js";
import { Texture } from "pixi.js/lib/rendering/renderers/shared/texture/Texture";
import { SpriteOptions } from "pixi.js/lib/scene/sprite/Sprite";
import { EmitterConfig } from "./emitter";

// Particle class
export class Particle extends Sprite {
    public dead: boolean = false;
    private _lifeTime: number = 0;
    private _emitterConfig: EmitterConfig;

    private _startColor: number;
    private _endColor: number;
    private _velocity: Point;
    private _startScale: Point;
    private _endScale: Point;

    constructor(options: SpriteOptions | Texture, emitterConfig: EmitterConfig) {
        super(options);
        this._emitterConfig = emitterConfig;

        //get random from array emitterConfig.startColor
        this._startColor = emitterConfig.startColor[Math.floor(Math.random() * emitterConfig.startColor.length)];
        //get random from array emitterConfig.endColor
        this._endColor = emitterConfig.endColor[Math.floor(Math.random() * emitterConfig.endColor.length)];

        this._velocity = new Point(0, 0);
        //get random value between emitterConfig.velocity[0] and emitterConfig.velocity[1]
        this._velocity.x = this.GetRandomBetween(emitterConfig.velocity[0].x, emitterConfig.velocity[1].x);
        this._velocity.y = this.GetRandomBetween(emitterConfig.velocity[0].y, emitterConfig.velocity[1].y);

        //get random from array emitterConfig.startScale and endScale
        this._startScale =
            emitterConfig.startScale instanceof Point
                ? emitterConfig.startScale
                : emitterConfig.startScale[Math.floor(Math.random() * emitterConfig.startScale.length)];

        this._endScale =
            emitterConfig.endScale instanceof Point
                ? emitterConfig.endScale
                : emitterConfig.endScale[Math.floor(Math.random() * emitterConfig.endScale.length)];

        //set anchor to blendMode
        this.anchor.set(0.5);
        this.blendMode = emitterConfig.blendMode;
    }

    private GetRandomBetween(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    // Maps a value from one range to another
    private MapNumber(value: number, start1: number, stop1: number, start2: number, stop2: number): number {
        return ((value - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    }

    // Maps a value to a color between two colors
    private MapColor(value: number, start1: number, stop1: number, startColor: number, stopColor: number): number {
        const startR = (startColor >> 16) & 0xff;
        const startG = (startColor >> 8) & 0xff;
        const startB = startColor & 0xff;

        const stopR = (stopColor >> 16) & 0xff;
        const stopG = (stopColor >> 8) & 0xff;
        const stopB = stopColor & 0xff;

        const mappedR = this.MapNumber(value, start1, stop1, startR, stopR);
        const mappedG = this.MapNumber(value, start1, stop1, startG, stopG);
        const mappedB = this.MapNumber(value, start1, stop1, startB, stopB);

        return (mappedR << 16) + (mappedG << 8) + mappedB;
    }

    //update particle behaviours
    //TODO: add more behaviours and seperate to additional classes, use deltaTime for smooth animations
    public Update(delta: number): void {
        this.x += this._velocity.x;
        this.y += this._velocity.y - this._emitterConfig.gravity;

        this.alpha = this.MapNumber(
            this._lifeTime,
            0,
            this._emitterConfig.lifeTime,
            this._emitterConfig.startAlpha,
            this._emitterConfig.endAlpha,
        );

        this.tint = this.MapColor(this._lifeTime, 0, this._emitterConfig.lifeTime, this._startColor, this._endColor);

        this.scale.x = this.MapNumber(
            this._lifeTime,
            0,
            this._emitterConfig.lifeTime,
            this._startScale.x,
            this._endScale.x,
        );

        this.scale.y = this.MapNumber(
            this._lifeTime,
            0,
            this._emitterConfig.lifeTime,
            this._startScale.y,
            this._endScale.y,
        );

        this._lifeTime += delta;
        if (this._lifeTime >= this._emitterConfig.lifeTime) {
            this.dead = true;
        }
    }
}
