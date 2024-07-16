import { Application, Container, ContainerChild } from "pixi.js";
import { Tweener } from "pixi-tweener";
import { ButtonView } from "../button-view";
import { Emitter } from "./emitter";
import {
    fire1EmitterConfig,
    fire2EmitterConfig,
    fire3EmitterConfig,
    fire4EmitterConfig,
} from "../../data/fire-particles-config";
import { gameConfig } from "../../data/game-config";

// Particles screen view class
export class ParticlesScreenView extends Container {
    private _app: Application;
    private _backButton: ButtonView | undefined;
    private _fire1Emitter: Emitter | undefined;
    private _fire2Emitter: Emitter | undefined;
    private _fire3Emitter: Emitter | undefined;
    private _fire4Emitter: Emitter | undefined;
    private _fireEmitterContainer: Container<ContainerChild> | undefined;

    constructor(app: Application) {
        super();
        this._app = app;
        this.Init();
        this.OnResize();
        this.visible = false;
    }

    private Init(): void {
        // Draw back button and particles
        this.DrawBackButton();
        // Draw particles
        this.DrawParticles();
    }

    private DrawBackButton() {
        this._backButton = new ButtonView("atlas/back_btn.png");
        this._backButton.position.set(50, 50);
        this.addChild(this._backButton);

        this._backButton.on("pointertap", () => {
            this.emit("backButtonClick");
        });
    }

    private DrawParticles() {
        this._fireEmitterContainer = new Container();

        //Make fire effect with 4 particles: fire, start fire bloom, smoke and small fire particles
        //Here we create custom emitter class to simulate particles with config from date/fire-particles-config.ts
        this._fire1Emitter = new Emitter(fire1EmitterConfig);
        this._fire2Emitter = new Emitter(fire2EmitterConfig);
        this._fire3Emitter = new Emitter(fire3EmitterConfig);
        this._fire4Emitter = new Emitter(fire4EmitterConfig);

        this._fire1Emitter.Start();
        this._fire2Emitter.Start();
        this._fire3Emitter.Start();
        this._fire4Emitter.Start();

        this._fireEmitterContainer.addChild(this._fire4Emitter);
        this._fireEmitterContainer.addChild(this._fire2Emitter);
        this._fireEmitterContainer.addChild(this._fire1Emitter);
        this._fireEmitterContainer.addChild(this._fire3Emitter);

        this.addChild(this._fireEmitterContainer);
    }

    //Show screen animation
    public Show(): void {
        this.alpha = 0;
        this.visible = true;
        Tweener.add({ target: this, duration: 0.5 }, { alpha: 1 });
    }

    //Hide screen animation
    public Hide(): void {
        Tweener.add({ target: this, duration: 0.5 }, { alpha: 0 }).then(() => {
            this.visible = false;
        });
    }

    public OnResize(): void {
        // Resize fire effect container to fit the base container size
        this._fireEmitterContainer?.scale.set(1);
        const maxScaleX = this._app.screen.width / gameConfig.baseContainerSize.x;
        const maxScaleY = this._app.screen.height / gameConfig.baseContainerSize.y;

        const scale = Math.min(maxScaleX, maxScaleY);
        this._fireEmitterContainer?.scale.set(scale);

        this._fireEmitterContainer?.position.set(this._app.screen.width / 2, this._app.screen.height / 1.5);

        // Resize back button and update its position
        if (this._backButton !== undefined) {
            const btnSideOffset = 16;
            this._backButton.scale.set(1);

            this._backButton.scale.set(this._fireEmitterContainer?.scale.x);

            if (this._app.screen.width < this._app.screen.height) {
                this._backButton.position.set(
                    this._app.screen.width / 2,
                    this._app.screen.height - btnSideOffset - this._backButton.height / 2,
                );
            } else {
                this._backButton.position.set(
                    btnSideOffset + this._backButton.height / 2,
                    this._app.screen.height - btnSideOffset - this._backButton.height / 2,
                );
            }
        }
    }

    //Update particles while screen is visible
    public Update(delta: number): void {
        if (!this.visible) return;
        this._fire1Emitter?.Update(delta);
        this._fire2Emitter?.Update(delta);
        this._fire3Emitter?.Update(delta);
        this._fire4Emitter?.Update(delta);
    }
}
