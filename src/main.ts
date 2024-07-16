import "./style.css";
import { Application, Ticker, UPDATE_PRIORITY } from "pixi.js";
import Stats from "stats.js";
import { PreloaderScene } from "./game/preloader";
import { GameManager } from "./game/game-manager";

// Create a PixiJS application.
const app = new Application();

// Add FPS meter from stats.js
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);
const ticker: Ticker = Ticker.shared;
ticker.add(stats.update, stats, UPDATE_PRIORITY.UTILITY);

(async () => {
    // Init the application.
    await app.init({ background: "#000000", resizeTo: window });

    // Then adding the application's canvas to the DOM body.
    document.body.appendChild(app.canvas);

    // Load the preloader scene, then the game manager.
    new PreloaderScene(app, () => {
        new GameManager(app);
    });
})();
