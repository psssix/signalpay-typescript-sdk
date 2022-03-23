export interface ICard {
    pkId: string;
    encryptedPAN: string;
    encryptedCVC2: string;
    expY: number;
    expM: number;
    cardHolderName?: string;
}


export class Card implements ICard {
    pkId: string;
    encryptedCVC2: string;
    encryptedPAN: string;
    expM: number;
    expY: number;
    cardHolderName?: string;

    constructor(pkId: string, encryptedCVC2: string, encryptedPAN: string, expM: string, expY: string, cardHolderName?: string) {
        this.pkId = pkId;
        this.cardHolderName = cardHolderName;
        this.encryptedCVC2 = encryptedCVC2;
        this.encryptedPAN = encryptedPAN;
        this.expM = parseInt(expM, 10);
        this.expY = parseInt(expY, 10);
    }
}
