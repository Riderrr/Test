import { CardsSceneView } from "../views/cards-screen/cards-scene-view";
import { CardModel, CardSuitType, CardValueType } from "../models/card-model";
import { CardView } from "../views/cards-screen/card-view";
import { EventEmitter } from "../../utils/event-emitter";

// Cards scene controller class
export class CardsSceneController {
    public onBackBtnClick = new EventEmitter();
    private _maxCards = 144;
    private _deckCardsOffset = 0.5;
    private _leftCards: CardView[] = [];
    private _cardsSceneView: CardsSceneView;

    constructor(cardsSceneView: CardsSceneView) {
        this._cardsSceneView = cardsSceneView;

        //Back button click event
        this._cardsSceneView.on("backButtonClick", () => {
            this.HideCardsScene();
            this.onBackBtnClick.emit("backButtonClick");
        });
    }

    //Show cards scene
    public ShowCardsScene(): void {
        this._cardsSceneView.Show();
        this.GenerateDeckCards();
        this.AnimateCards();
    }

    //Hide cards scene
    public HideCardsScene(): void {
        this._cardsSceneView.Hide();
        this._leftCards = [];
    }

    //Generate deck cards
    private GenerateDeckCards(): void {
        //Generate cards
        let totalCardsGenerated = 0;
        const _allCards = new Set<CardModel>();
        //Generate this._maxCards cards
        while (totalCardsGenerated < this._maxCards) {
            for (let i = 0; i < Object.keys(CardSuitType).length / 2; i++) {
                for (let j = 0; j < Object.keys(CardValueType).length / 2; j++) {
                    _allCards.add(new CardModel(i, j));

                    totalCardsGenerated++;

                    if (totalCardsGenerated >= this._maxCards - 1) {
                        break;
                    }
                }
            }
        }

        //Shuffle cards
        const shuffledCards = this.ShuffleSet(_allCards);
        let addedCardsCounter = 0;

        //Add cards to left deck
        for (const card of shuffledCards) {
            const cardView = this._cardsSceneView.AddCard(card.suit, card.value);
            cardView.position.set(
                addedCardsCounter * this._deckCardsOffset,
                addedCardsCounter * -this._deckCardsOffset,
            );
            addedCardsCounter++;
            this._leftCards.push(cardView);
        }
    }

    private AnimateCards(): void {
        //get last element from left deck
        const cardView = this._leftCards.pop();

        if (cardView == undefined) return;

        //Move card to right deck and animate it
        this._cardsSceneView
            .MoveCardToRightDeck(cardView, this._deckCardsOffset * (this._maxCards - this._leftCards.length))
            .then(() => {
                this.AnimateCards();
            });
    }

    private ShuffleSet<T>(inputSet: Set<T>): Set<T> {
        const array = Array.from(inputSet);

        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }

        // Convert the Array back to a Set
        return new Set(array);
    }
}
