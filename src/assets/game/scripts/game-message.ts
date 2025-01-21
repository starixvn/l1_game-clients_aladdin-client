export namespace GameServiceMessage {
    export class InstantGameConfigs {
        defaultBetLevel: number;
        chips: number[];

        static eventName = "gameConfigs";
    }

    export class Bet {
        multiplier: number;

        static eventName = "multiplier";   
    }

    export class Player {
        name: string;
        betWin: number;
        bigWin: boolean;

        static eventName = "player";
    }
}
