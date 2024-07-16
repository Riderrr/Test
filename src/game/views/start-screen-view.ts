import { Application, Container } from "pixi.js";
import { ButtonView } from "./button-view";
import { Easing, Tweener } from "pixi-tweener";
import { gameConfig } from "../data/game-config";

// Enum for button/screen types
export enum ButtonType {
    Cards,
    Text,
    Particles,
}
export class StartScreenView extends Container {
    private _animationTime = 0.5;
    private _app: Application;
    private _cardsScreenButton: ButtonView | undefined;
    private _textScreenButton: ButtonView | undefined;
    private _particlesScreenButton: ButtonView | undefined;

    constructor(app: Application) {
        super();
        this._app = app;
        this.Init();
    }

    private Init(): void {
        // Add buttons
        this._cardsScreenButton = this.AddButton("Cards", ButtonType.Cards);
        this._textScreenButton = this.AddButton("Text", ButtonType.Text);
        this._particlesScreenButton = this.AddButton("Particles", ButtonType.Particles);

        this.addChild(this._cardsScreenButton);
        this.addChild(this._textScreenButton);
        this.addChild(this._particlesScreenButton);
    }

    public Show(): void {
        // Show the start screen
        this.visible = true;
        this.alpha = 0;
        Tweener.add({ target: this, duration: this._animationTime, ease: Easing.easeInExpo }, { alpha: 1 });

        // Resize the screen and update button positions
        this.OnResize();

        // Set the buttons not to be interactable while animating
        this._cardsScreenButton?.SetInteractable(false);
        this._textScreenButton?.SetInteractable(false);
        this._particlesScreenButton?.SetInteractable(false);

        // Animate the buttons
        this.AnimateButton(this._cardsScreenButton as ButtonView, this._animationTime / 2);
        this.AnimateButton(this._textScreenButton as ButtonView, this._animationTime / 4);
        this.AnimateButton(this._particlesScreenButton as ButtonView, 0).then(() => {
            // Set the buttons to be interactable after the animation
            this._cardsScreenButton?.SetInteractable(true);
            this._textScreenButton?.SetInteractable(true);
            this._particlesScreenButton?.SetInteractable(true);
        });
    }

    // Add a button to the screen
    private AddButton(btnName: string, buttonType: ButtonType): ButtonView {
        const button = new ButtonView("atlas/btn_green.png", btnName, buttonType);
        this.addChild(button);

        // Add a click event to the button
        button.on("pointertap", async () => {
            this.emit("buttonClick", button.buttonType);
            this.Hide();
        });

        return button;
    }

    public Hide(): void {
        // Set the buttons not to be interactable while animating
        this._cardsScreenButton?.SetInteractable(false);
        this._textScreenButton?.SetInteractable(false);
        this._particlesScreenButton?.SetInteractable(false);

        // Animate the buttons
        Tweener.add({ target: this, duration: this._animationTime / 2, ease: Easing.easeInExpo }, { alpha: 0 }).then(
            () => {
                this.visible = false;
            },
        );
    }

    // Animate the buttons to slide in from the top
    private AnimateButton(button: ButtonView, delay = 0): Promise<void> {
        const to = button.y;
        button.y = -this._app.screen.height / 4;

        return Tweener.add(
            { target: button, duration: this._animationTime, ease: Easing.easeOutExpo, delay: delay },
            {
                y: to,
            },
        );
    }

    // Resize the screen and update button positions
    public OnResize(): void {
        // Set the scale of the screen to fit th baseContainerSize
        this.scale.set(1);
        const maxScaleX = this._app.screen.width / gameConfig.baseContainerSize.x;
        const maxScaleY = this._app.screen.height / gameConfig.baseContainerSize.y;

        const scale = Math.min(maxScaleX, maxScaleY);
        this.scale.set(scale);

        this.position.set(this._app.screen.width / 2, this._app.screen.height / 2);

        //center the buttons
        [this._cardsScreenButton, this._textScreenButton, this._particlesScreenButton].forEach((button, i) => {
            if (button) {
                button.x = 0;
                button.y = (i - 1) * button.height * 1.1;
            }
        });
    }
}
