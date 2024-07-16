import { Application, Container, ContainerChild, Graphics, Point } from "pixi.js";
import { TextSpriteContainer } from "./text-sprite-container";
import { Tweener } from "pixi-tweener";
import { ButtonView } from "../button-view";
import { gameConfig } from "../../data/game-config";

// Text with sprites screen view class
export class TextScreenView extends Container {
    private _app: Application;
    private _background: Graphics | undefined;
    private _backButton: ButtonView | undefined;
    private _textContainer: Container<ContainerChild> | undefined;

    constructor(app: Application) {
        super();
        this._app = app;

        this.Init();
        this.OnResize();
        this.visible = false;
    }

    private Init(): void {
        // Draw white background
        this._background = new Graphics();

        this._background.rect(0, 0, this._app.screen.width, this._app.screen.height);
        this._background.fill(0xffffff);
        this._textContainer = new Container();

        this.addChild(this._background);
        this.addChild(this._textContainer);
        this.DrawBackButton();
    }

    // Draw back button
    private DrawBackButton() {
        this._backButton = new ButtonView("atlas/back_btn.png");
        this._backButton.tint = 0xf1f1f1;
        this._backButton.position.set(50, 50);
        this.addChild(this._backButton);

        this._backButton.on("pointertap", () => {
            this.emit("backButtonClick");
        });
    }

    //Show screen animation
    public Show(): void {
        this.visible = true;
        this.alpha = 0;
        Tweener.add({ target: this, duration: 0.5 }, { alpha: 1 });
        this.OnResize();
    }

    //Hide screen animation
    public Hide(): void {
        Tweener.add({ target: this, duration: 0.5 }, { alpha: 0 }).then(() => {
            this.visible = false;

            Tweener.killTweensOf(this);
            this._textContainer?.removeChildren();
        });
    }

    //Draw text with sprites on the screen
    public DrawText(text: string, fontSize: number): void {
        const textSprite = new TextSpriteContainer(text, fontSize, fontSize * 1.15);

        //RandomPosition inside viewport container
        const x = Math.random() * this._app.screen.width;
        const y = Math.random() * this._app.screen.height;

        //Animate it a bit
        textSprite.position = new Point(x, y);
        const randomScale = Math.random() + 0.5;
        textSprite.alpha = 0;

        Tweener.add({ target: textSprite, duration: 1 }, { alpha: 1 });
        Tweener.add({ target: textSprite.scale, duration: 5, delay: 0 }, { x: randomScale, y: randomScale });
        Tweener.add({ target: textSprite, duration: 1, delay: 4 }, { alpha: 0 }).then(() => {
            //destroy text sprite after animation
            this.removeChild(textSprite);
        });

        this._textContainer?.addChild(textSprite);
    }

    //Resize screen and update gameObject positions
    public OnResize(): void {
        //fit background to screen
        if (this._background !== undefined) {
            this._background.width = this._app.screen.width;
            this._background.height = this._app.screen.height;
        }

        //Scale text container to fit the screen with baseContainerSize
        this._textContainer?.scale.set(1);
        const maxScaleX = this._app.screen.width / gameConfig.baseContainerSize.x;
        const maxScaleY = this._app.screen.height / gameConfig.baseContainerSize.y;

        const scale = Math.min(maxScaleX, maxScaleY);
        this._textContainer?.scale.set(scale);

        this._textContainer?.position.set(this._app.screen.width / 2, this._app.screen.height / 2);

        //Position back button
        if (this._backButton !== undefined) {
            const btnSideOffset = 16;
            this._backButton.scale.set(1);

            this._backButton.scale.set(this._textContainer?.scale.x);

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
}
