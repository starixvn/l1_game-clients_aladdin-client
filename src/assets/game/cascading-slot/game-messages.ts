export namespace GameServiceMessage {
    export class CascadingSlotConfigs {
        defaultCoinValue: number;
        betLevels: number[];
        betMultiplier: number;
        coinValues: number[];
        maxWinPerRound: number;
        odds: {};
        totalMultiplier: number;

        static eventName = "gameConfigs";
    }

    export class CascadingSlotFinish {
        roundId: number;
        result: string;

        multiplier: number;
        totalMultiplier: number;

        actualBetwin: number;
        win: number;
        bigWin: boolean;
        totalFreeSpins: number;
        freeSpins: number;
        isFreeSpin: boolean;

        tumbles: Tumble[];
        m: number[];
        reachMaxWin: boolean;
        static eventName = "finish";
    }
}

export interface Settlement {
    explode: number[];
    new: number[];
}

export interface Tumble {
    icons: any;
    win: number;
    settlement: Settlement;
    result: string;
    multipliers: number[];
}
