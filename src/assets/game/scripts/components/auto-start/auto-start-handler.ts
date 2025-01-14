import gc from "@sg/game-client-base";
import { FunctionUtils } from "db://shared-components/shared/utils";
import inversify from "inversify";
import { BetAmountStore } from "../bet-amount/bet-amount-store";
import { BetHandler } from "../bets/bet-handler";
import { AutoStartStore } from "./auto-start-store";

const { injectable, inject } = inversify;

@injectable()
export class AutoStartHandler implements gc.Shared.IHandler<number> {
    @inject(AutoStartStore) protected readonly autoStartStore: AutoStartStore;
    @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;
    @inject(BetAmountStore) protected readonly betAmountStore: BetAmountStore;
    @inject(gc.Notices.NoticeStore) private readonly noticeStore: gc.Notices.NoticeStore;
    @inject(BetHandler) private readonly betHandler: BetHandler;
    @inject(gc.Rounds.RoundStore) private readonly roundStore: gc.Rounds.RoundStore;

    handle() {}

    async handleAutoStart() {
    }
}