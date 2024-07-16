import { Container, Sprite, Texture, Text } from "pixi.js";
import { ButtonType } from "./start-screen-view";

// Button view class
export class ButtonView extends Container {
    public buttonType: ButtonType | undefined;
    private readonly _spriteName: string;
    private readonly _buttonName: string | undefined;
    private _buttonBackSprite: Sprite | undefined;

    constructor(spriteName: string, buttonName?: string, buttonType?: ButtonType) {
        super();
        this._spriteName = spriteName;
        this._buttonName = buttonName;
        this.buttonType = buttonType;

        this.Init();
    }

    private Init(): void {
        //Draw button's background and add text if needed
        this.DrawBackground();

        if (this._buttonName !== undefined) {
            this.DrawButtonText();
        }

        this.SetInteractable(true);
    }

    private DrawBackground(): void {
        this._buttonBackSprite = new Sprite({
            texture: Texture.from(this._spriteName),
        });

        this._buttonBackSprite.anchor.set(0.5);
        this.addChild(this._buttonBackSprite);
    }

    private DrawButtonText(): void {
        const buttonText = new Text({
            text: this._buttonName,
            style: {
                fontFamily: "baloo",
                fontSize: 35,
                fill: 0xffffff,
                align: "center",
                stroke: { color: "#000000", width: 5, join: "round" },
            },
        });

        buttonText.anchor.set(0.5);
        this.addChild(buttonText);
    }

    //Set button interactable
    public SetInteractable(interactable: boolean): void {
        this.eventMode = interactable ? "static" : "none";
        this.alpha = interactable ? 1 : 0.85;
    }
}
