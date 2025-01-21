export namespace GameServiceMessage {
    export class InstantGameConfigs {
        defaultBetLevel: number;
        chips: number[];

        static eventName = "gameConfigs";
    }

    export class Player {
        name: string;
        betWin: number;
        bigWin: boolean;

        static eventName = "player";
    }
}
