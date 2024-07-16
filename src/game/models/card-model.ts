export enum CardSuitType {
    Spades,
    Hearts,
    Diamonds,
    Clubs,
}

export enum CardValueType {
    Two,
    Three,
    Four,
    Five,
    Six,
    Seven,
    Eight,
    Nine,
    Ten,
    Jack,
    Queen,
    King,
    Ace,
}

// Card model class
export class CardModel {
    private _suit: CardSuitType;
    private _value: CardValueType;
    constructor(suit: CardSuitType, value: CardValueType) {
        this._suit = suit;
        this._value = value;
    }
    get suit() {
        return this._suit;
    }
    get value() {
        return this._value;
    }
}
