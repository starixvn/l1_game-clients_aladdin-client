import gc from "@sg/game-client-base";
import inversify from "inversify";
import { BetAmountStore } from "../bet-amount/bet-amount-store";
import { BetHandler } from "../bets/bet-handler";
import { AutoPlayStore } from "./auto-play-store";

const { injectable, inject } = inversify;

@injectable()
export class AutoPlayHandler implements gc.Shared.IHandler<number> {
    @inject(AutoPlayStore) protected readonly autoPlayStore: AutoPlayStore;
    @inject(gc.Bet.BetStore) private readonly betStore: gc.Bet.BetStore;
    @inject(BetAmountStore) protected readonly betAmountStore: BetAmountStore;
    @inject(gc.Notices.NoticeStore) private readonly noticeStore: gc.Notices.NoticeStore;
    @inject(BetHandler) private readonly betHandler: BetHandler;

    handle() {}

    handleAutoPlaceBet() {
        if (this.checkFinishedAutoPlay()) {
            this.autoPlayStore.isAutoPlay = false;
            return;
        }
        this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoPlay - 1);
        this.betHandler.autoPlaceBet();
    }

    openAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = true;
        if (this.autoPlayStore.roundConfirmedOnPopup !== 0) {
            this.autoPlayStore.selectedRoundOnPopup = this.autoPlayStore.roundConfirmedOnPopup;
        } else {
            this.autoPlayStore.selectedRoundOnPopup = this.autoPlayStore.roundsList[0];
        }
    }

    clickAutoPlay() {
        if (!this.autoPlayStore.isAutoPlay && this.isValidBet()) {
            this.openAutoPlayPopup();
        } else {
            this.cancelAutoPlay();
        }
    }

    cancelAutoPlay() {
        this.autoPlayStore.isAutoPlay = false;
        this.updateAutoPlayRounds(0);
    }

    isValidBet() {
        // if (!this.isEnoughMoney()) {
        //     this.showNotEnoughMoney();
        //     return false;
        // }

        // if (!this.betInputStore.isAmountGreaterMinBet) {
        //     this.showMsgMinBet();
        //     return false;
        // }

        return true;
    }

    isEnoughMoney() {
        return this.betAmountStore.betAmount <= this.betStore.availableBalance;
    }

    private showNotEnoughMoney() {
        const { freebetEnabled } = this.betStore;
        const message = freebetEnabled
            ? gc.Translator.commonTranslate("not_enough_scoin")
            : gc.Translator.commonTranslate("not_enough_money");
        this.noticeStore.addWarning(message);
    }

    closeAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoPlayPopup = false;
    }

    updateNoOfRounds(rounds: number) {
        this.autoPlayStore.selectedRoundOnPopup = rounds;
    }

    confirmRoundAndStart() {
        this.autoPlayStore.roundsAutoPlay = this.autoPlayStore.roundConfirmedOnPopup = this.autoPlayStore.selectedRoundOnPopup;
        this.autoPlayStore.isOpenAutoPlayPopup = false;
        if (this.isValidBet()) {
            this.autoPlayStore.isAutoPlay = true;
            this.betHandler.autoPlaceBet();
            this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoPlay - 1);
        } else {
            this.cancelAutoPlay();
        }
    }

    updateAutoPlayRounds(rounds: number) {
        this.autoPlayStore.roundsAutoPlay = rounds;
    }

    checkFinishedAutoPlay() {
        return this.autoPlayStore.isAutoPlay && this.autoPlayStore.roundsAutoPlay <= 0;
    }

    checkSpinNextRound() {
        if (!this.autoPlayStore.isAutoPlay) {
            return;
        }
        this.handleAutoPlaceBet();
    }
}
