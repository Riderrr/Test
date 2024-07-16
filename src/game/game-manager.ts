import { Application } from "pixi.js";
import { StartScreenView } from "./views/start-screen-view";
import { StartScreenController } from "./controllers/start-screen-controller";
import { Tweener } from "pixi-tweener";
import { CardsSceneView } from "./views/cards-screen/cards-scene-view";
import { CardsSceneController } from "./controllers/cards-scene-controller";
import { TextScreenController } from "./controllers/text-screen-controller";
import { TextScreenView } from "./views/text-screen/text-screen-view";
import { ParticlesScreenController } from "./controllers/particles-screen-controller";
import { ParticlesScreenView } from "./views/particles-scene/particles-screen-view";

export class GameManager {
    private readonly _app: Application;

    //Declare views and controllers
    private _startScreenView: StartScreenView | undefined;
    private _cardsScreenView: CardsSceneView | undefined;
    private _textScreenView: TextScreenView | undefined;
    private _particlesScreenView: ParticlesScreenView | undefined;

    private _startScreenController: StartScreenController | undefined;
    private _cardsScreenController: CardsSceneController | undefined;
    private _textScreenController: TextScreenController | undefined;
    private _particlesScreenController: ParticlesScreenController | undefined;

    constructor(app: Application) {
        this._app = app;
        this.initScene();
    }

    public initScene(): void {
        //Create views and controllers
        this._startScreenView = new StartScreenView(this._app);
        this._cardsScreenView = new CardsSceneView(this._app);
        this._textScreenView = new TextScreenView(this._app);
        this._particlesScreenView = new ParticlesScreenView(this._app);

        this._startScreenController = new StartScreenController(this._startScreenView);
        this._cardsScreenController = new CardsSceneController(this._cardsScreenView);
        this._textScreenController = new TextScreenController(this._textScreenView);
        this._particlesScreenController = new ParticlesScreenController(this._particlesScreenView);

        this._startScreenController.ShowStartScreen();

        this.AddListeners();

        this._app.stage.addChild(this._startScreenView);
        this._app.stage.addChild(this._cardsScreenView);
        this._app.stage.addChild(this._textScreenView);
        this._app.stage.addChild(this._particlesScreenView);

        //Add resize listener
        window.addEventListener("resize", () => {
            this.OnResize();
        });

        //Start the update loop
        this._app.ticker.add((delta) => {
            this.Update(delta.deltaMS * 0.001);
        });

        Tweener.init(this._app.ticker);
    }

    //Add listeners to the start screen and back buttons of the other screens
    private AddListeners(): void {
        this._startScreenController?.onShowCardsScreen.on("showCardsScreen", () => {
            this._cardsScreenController?.ShowCardsScene();
        });

        this._startScreenController?.onShowTextScreen.on("showTextScreen", () => {
            this._textScreenController?.ShowTextScreen();
        });

        this._startScreenController?.onShowParticlesScreen.on("showParticlesScreen", () => {
            this._particlesScreenController?.ShowParticlesScreen();
        });

        this._cardsScreenController?.onBackBtnClick.on("backButtonClick", () => {
            this._startScreenView?.Show();
        });

        this._textScreenController?.onBackBtnClick.on("backButtonClick", () => {
            this._startScreenView?.Show();
        });

        this._particlesScreenController?.onShowStartScreen.on("backButtonClick", () => {
            this._startScreenView?.Show();
        });
    }

    private OnResize() {
        this._startScreenView?.OnResize();
        this._cardsScreenView?.OnResize();
        this._textScreenView?.OnResize();
        this._particlesScreenView?.OnResize();
    }

    private Update(delta: number): void {
        this._textScreenController?.Update(delta);
        this._particlesScreenView?.Update(delta);
    }
}
