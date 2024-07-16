import { Application, Assets } from "pixi.js";

// Assets to load.
const atlases = ["./assets/texture-0.json", "./assets/texture-1.json"];
const fonts = ["./assets/baloo.ttf"];

export class PreloaderScene {
    private app: Application;
    private onAssetsLoaded: () => void;

    constructor(app: Application, onAssetsLoaded: () => void) {
        this.app = app;
        this.onAssetsLoaded = onAssetsLoaded;
        this.loadAssets();
    }

    private loadAssets(): void {
        Assets.add({ alias: "bg", src: "./assets/background.jpg" });

        Assets.load([...atlases, "bg", ...fonts]).then(() => {
            this.onAssetsLoaded();
        });
    }
}
