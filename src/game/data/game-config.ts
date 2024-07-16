import { Point } from "pixi.js";

export interface GameConfig {
    baseContainerSize: Point;
}

export const gameConfig: GameConfig = {
    baseContainerSize: new Point(1060, 1060), // Base container size for the game
};
