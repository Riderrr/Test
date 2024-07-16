import { Application, Container, ContainerChild, Sprite, Texture } from "pixi.js";
import { CardSuitType, CardValueType } from "../../models/card-model";
import { CardView } from "./card-view";
import { Easing, Tweener } from "pixi-tweener";
import { ButtonView } from "../button-view";
import { gameConfig } from "../../data/game-config";

// Cards scene view class
export class CardsSceneView extends Container {
    private _app: Application;

    private _animationTime = 2;
    private _backButton: ButtonView | undefined;
    private _background: Sprite | undefined;
    private _cardsContainer: Container<ContainerChild> | undefined;

    private _leftDeckContainer: Container<ContainerChild> | undefined;
    private _rightDeckContainer: Container<ContainerChild> | undefined;

    constructor(app: Application) {
        super();
        this._app = app;
        this.Init();
        this.OnResize();
        this.visible = false;
    }

    private Init(): void {
        // Draw background and decks containers
        this.DrawBackground();
        this._cardsContainer = new Container();
        this._leftDeckContainer = new Container();
        this._rightDeckContainer = new Container();

        this.addChild(this._cardsContainer);
        this._cardsContainer.addChild(this._leftDeckContainer);
        this._cardsContainer.addChild(this._rightDeckContainer);

        // Draw back button
        this.DrawBackButton();
    }

    private DrawBackground(): void {
        if (this._background !== undefined) return;

        this._background = new Sprite({
            texture: Texture.from("bg"),
        });
        this._background.anchor.set(0.5);

        this.addChild(this._background);
    }

    private DrawBackButton() {
        this._backButton = new ButtonView("atlas/back_btn.png");
        this._backButton.position.set(50, 50);
        this.addChild(this._backButton);

        this._backButton.on("pointertap", () => {
            this.emit("backButtonClick");
        });
    }

    // Add card to the left deck
    public AddCard(cardSuitType: CardSuitType, cardValueType: CardValueType): CardView {
        const cardView = new CardView(cardSuitType, cardValueType);
        this._leftDeckContainer?.addChild(cardView);
        return cardView;
    }

    // Move card to the right deck animation
    public async MoveCardToRightDeck(cardView: CardView, offset: number): Promise<void> {
        const worldPosition = cardView.getGlobalPosition();
        this._leftDeckContainer?.disableRenderGroup();
        this._leftDeckContainer?.removeChild(cardView);
        this._leftDeckContainer?.enableRenderGroup();

        this._rightDeckContainer?.addChild(cardView);
        const newPositionInRightContainer = this._rightDeckContainer?.toLocal(worldPosition);
        cardView.position.set(newPositionInRightContainer?.x, newPositionInRightContainer?.y);

        Tweener.add(
            { target: cardView.scale, duration: this._animationTime / 2, delay: 0, ease: Easing.easeInExpo },
            {
                x: 0,
                y: 1.25,
            },
        ).then(() => {
            cardView.Flip();
            Tweener.add(
                { target: cardView.scale, duration: this._animationTime / 2, delay: 0, ease: Easing.easeOutExpo },
                {
                    x: 1,
                    y: 1,
                },
            ).then(() => {});
        });

        return Tweener.add(
            { target: cardView, duration: this._animationTime, delay: 0, ease: Easing.easeInOutCubic },
            {
                x: this._rightDeckContainer ? this._rightDeckContainer.position.x + offset : 0,
                y: this._rightDeckContainer ? this._rightDeckContainer.position.y - offset : 0,
            },
        );
    }

    //Show screen animation
    public Show(): void {
        this.visible = true;
        this.alpha = 0;
        Tweener.add(
            { target: this, duration: 0.5, delay: 0, ease: Easing.easeOutSine },
            {
                alpha: 1,
            },
        );
    }

    //Hide screen animation
    public Hide() {
        Tweener.add(
            { target: this, duration: 0.5, delay: 0, ease: Easing.easeOutSine },
            {
                alpha: 0,
            },
        ).then(() => {
            this.visible = false;

            this._leftDeckContainer?.removeChildren();
            this._rightDeckContainer?.removeChildren();
            Tweener.killTweensOf(this);
        });
    }

    public OnResize(): void {
        const distanceBetweenDecks = 400;

        //Fit background to screen
        if (this._background !== undefined) {
            this._background.scale.set(1);
            this._background.position.x = this._app.screen.width / 2;
            this._background.position.y = this._app.screen.height / 2;
            const maxScaleX = this._app.screen.width / this._background.width;
            const maxScaleY = this._app.screen.height / this._background.height;
            const scale = Math.max(maxScaleX, maxScaleY);
            this._background.scale.set(scale);
        }
        // Resize cards container to fit in base container size
        if (this._cardsContainer !== undefined) {
            this._cardsContainer.scale.set(1);
            this._cardsContainer.position.x = this._app.screen.width / 2;
            this._cardsContainer.position.y = this._app.screen.height / 2;

            const maxScaleX = this._app.screen.width / gameConfig.baseContainerSize.x;
            const maxScaleY = this._app.screen.height / gameConfig.baseContainerSize.y;

            const scale = Math.min(maxScaleX, maxScaleY);
            this._cardsContainer.scale.set(scale);
        }

        // Update left and right deck positions
        if (this._leftDeckContainer !== undefined && this._cardsContainer !== undefined) {
            this._leftDeckContainer.position.x = -distanceBetweenDecks / 2;
            this._leftDeckContainer.position.y = 0;
        }

        if (this._rightDeckContainer !== undefined && this._cardsContainer !== undefined) {
            this._rightDeckContainer.position.x = distanceBetweenDecks / 2;
            this._rightDeckContainer.position.y = 0;
        }

        //
        if (this._backButton !== undefined) {
            const btnSideOffset = 16;
            this._backButton.scale.set(1);

            this._backButton.scale.set(this._cardsContainer?.scale.x);

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
