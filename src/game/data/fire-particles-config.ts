import { Point } from "pixi.js";
import { EmitterConfig } from "../views/particles-scene/emitter";

// Fire particles config
export const fire1EmitterConfig: EmitterConfig = {
    textures: [
        "atlas/fireParticles/fire6.png",
        "atlas/fireParticles/fire7.png",
        "atlas/fireParticles/fire8.png",
        "atlas/fireParticles/fire9.png",
    ],
    blendMode: "screen",
    emissionRate: 0.05,
    lifeTime: 3,
    startAlpha: 1,
    endAlpha: 0,
    startColor: [0xffa218, 0xffffff],
    endColor: [0xffa218, 0xff1e00],

    velocity: [new Point(-0.1, -1), new Point(0.1, -2)],

    startScale: [new Point(1.5, 1.5), new Point(1, 1), new Point(0.5, 0.5)],
    endScale: new Point(0, 0),
    gravity: 0,
};

export const fire2EmitterConfig: EmitterConfig = {
    textures: [
        "atlas/fireParticles/cloud_1.png",
        "atlas/fireParticles/cloud_2.png",
        "atlas/fireParticles/cloud_3.png",
        "atlas/fireParticles/cloud_4.png",
    ],
    blendMode: "add",
    emissionRate: 0.01,
    lifeTime: 3,
    startAlpha: 1,
    endAlpha: 0,
    startColor: [0xffa218, 0xffffff],
    endColor: [0xffa218, 0xff1e00],

    velocity: [new Point(-0.5, -0.3), new Point(0.5, -3)],

    startScale: [new Point(0.05, 0.05), new Point(0.1, 0.1)],
    endScale: new Point(0, 0),
    gravity: -0.1,
};

export const fire3EmitterConfig: EmitterConfig = {
    textures: ["atlas/fireParticles/glow1.png"],
    blendMode: "add",
    emissionRate: 1.5,
    lifeTime: 3,
    startAlpha: 1,
    endAlpha: 0,
    startColor: [0xffaa4f],
    endColor: [0xfffffff],

    velocity: [new Point(0, 0), new Point(0, 0)],

    startScale: new Point(1, 1),
    endScale: new Point(2, 2),
    gravity: 0,
};

export const fire4EmitterConfig: EmitterConfig = {
    textures: [
        "atlas/fireParticles/cloud_1.png",
        "atlas/fireParticles/cloud_2.png",
        "atlas/fireParticles/cloud_3.png",
        "atlas/fireParticles/cloud_4.png",
    ],
    blendMode: "screen",
    emissionRate: 0.5,
    lifeTime: 3,
    startAlpha: 0.35,
    endAlpha: 0,
    startColor: [0xffaa4f],
    endColor: [0xfffffff],

    velocity: [new Point(0, -1), new Point(0, -3)],

    startScale: new Point(0.5, 0.5),
    endScale: [new Point(2, 2), new Point(3, 3)],
    gravity: 0,
};
