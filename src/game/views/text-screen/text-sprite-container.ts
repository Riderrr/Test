import { Container, Sprite, Text, Texture } from "pixi.js";
import { spritePaths } from "../../data/text-data";

// Text sprite container class
// this class parse text string and replace <sprite="silly"/> tags with appropriate sprite name
export class TextSpriteContainer extends Container {
    private _text: string = "";
    private _fontSize: number = 35;
    private _imageSize: number = 50;

    constructor(text: string, fontSize: number = 35, imageSize: number = 50) {
        super();
        this._text = text;
        this._fontSize = fontSize;
        this._imageSize = imageSize;
        this.Init();
    }

    private Init(): void {
        this.DrawText();
    }

    // Draw the text with sprites
    private DrawText(): void {
        // Split the text by spaces to handle words and placeholders
        const parts = this._text.split(" ");
        let currentX = 0;
        parts.forEach((part: string) => {
            const spriteMatch = part.match(/<sprite="([^"]+)"\/>/);

            if (spriteMatch) {
                const spriteName = spriteMatch[1];
                const spritePath = spritePaths[spriteName];

                if (spritePath) {
                    // Create the sprite
                    const texture = Texture.from(spritePath);
                    const sprite = new Sprite(texture);
                    sprite.width = this._imageSize;
                    sprite.height = this._imageSize;

                    sprite.x = currentX;
                    this.addChild(sprite);

                    // Update current X position
                    currentX += sprite.width + this._fontSize * 0.1; // Adjust spacing as needed
                }
            } else {
                const textObj = new Text({
                    text: part,
                    style: {
                        fontFamily: "baloo",
                        fontSize: this._fontSize,
                        fill: 0xffffff,
                        align: "center",
                        stroke: { color: "#000000", width: 5, join: "round" },
                    },
                });
                textObj.x = currentX;
                this.addChild(textObj);

                // Update current X position
                currentX += textObj.width + this._fontSize * 0.1; // Adjust spacing as needed
            }
        });

        // Center the text
        this.pivot.set(this.width / 2, this.height / 2);
    }
}
