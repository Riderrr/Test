import { Container, Sprite, Texture } from "pixi.js";
import { CardSuitType, CardValueType } from "../../models/card-model";

export class CardView extends Container {
    private _cardSuitType: CardSuitType;
    private _cardValueType: CardValueType;
    private _sprite: Sprite | undefined;
    private _valueSpriteName: string = "";
    private _isFlipped: boolean = true;
    private _cardBackSprite = "atlas/cards/BackColor_Red.png";

    // Card view constructor
    constructor(cardSuitType: CardSuitType, cardValueType: CardValueType) {
        super();
        this._cardSuitType = cardSuitType;
        this._cardValueType = cardValueType;
        this._valueSpriteName = this.GetValueSpriteName();
        this._isFlipped = false;
        this.Init();
    }

    //Set card texture to flipped or not
    public Flip(): void {
        this._isFlipped = !this._isFlipped;
        if (this._sprite != null)
            this._sprite.texture = Texture.from(this._isFlipped ? this._valueSpriteName : this._cardBackSprite);
    }

    private Init() {
        //Draw card sprite
        this._sprite = new Sprite({
            texture: Texture.from(this._cardBackSprite),
        });

        this._sprite.x = -this._sprite.width / 2;
        this._sprite.anchor.set(0.5);

        this.addChild(this._sprite);
    }

    //Get card value sprite name
    public GetValueSpriteName(): string {
        let cardSuitName = "";
        let cardValueName = "";

        switch (this._cardSuitType) {
            case CardSuitType.Clubs:
                cardSuitName = "Club";
                break;
            case CardSuitType.Diamonds:
                cardSuitName = "Diamond";
                break;
            case CardSuitType.Hearts:
                cardSuitName = "Heart";
                break;
            case CardSuitType.Spades:
                cardSuitName = "Spade";
                break;
        }

        switch (this._cardValueType) {
            case CardValueType.Ace:
                cardValueName = "01";
                break;
            case CardValueType.Two:
                cardValueName = "02";
                break;
            case CardValueType.Three:
                cardValueName = "03";
                break;
            case CardValueType.Four:
                cardValueName = "04";
                break;
            case CardValueType.Five:
                cardValueName = "05";
                break;
            case CardValueType.Six:
                cardValueName = "06";
                break;
            case CardValueType.Seven:
                cardValueName = "07";
                break;
            case CardValueType.Eight:
                cardValueName = "08";
                break;
            case CardValueType.Nine:
                cardValueName = "09";
                break;
            case CardValueType.Ten:
                cardValueName = "10";
                break;
            case CardValueType.Jack:
                cardValueName = "11";
                break;
            case CardValueType.Queen:
                cardValueName = "12";
                break;
            case CardValueType.King:
                cardValueName = "13";
                break;
            default:
                console.log(this._cardValueType, CardValueType);
                break;
        }

        return `atlas/cards/${cardSuitName}${cardValueName}.png`;
    }
}
