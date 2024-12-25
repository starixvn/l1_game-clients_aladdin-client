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
            this.autoPlayStore.isAutoplay = false;
            return;
        }
        this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoplay - 1);
        this.betHandler.autoPlaceBet();
    }

    openAutoPlayPopup() {
        this.autoPlayStore.isOpenAutoplayPopup = true;
        if (this.autoPlayStore.roundConfirmedOnPopup !== 0) {
            this.autoPlayStore.selectedRoundOnPopup = this.autoPlayStore.roundConfirmedOnPopup;
        } else {
            this.autoPlayStore.selectedRoundOnPopup = this.autoPlayStore.roundsList[0];
        }
    }

    clickAutoPlay() {
        if (!this.autoPlayStore.isAutoplay && this.isValidBet()) {
            this.openAutoPlayPopup();
        } else {
            this.cancelAutoPlay();
        }
    }

    cancelAutoPlay() {
        this.autoPlayStore.isAutoplay = false;
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
        this.autoPlayStore.isOpenAutoplayPopup = false;
    }

    updateNoOfRounds(rounds: number) {
        this.autoPlayStore.selectedRoundOnPopup = rounds;
    }

    confirmRoundAndStart() {
        this.autoPlayStore.roundsAutoplay = this.autoPlayStore.roundConfirmedOnPopup = this.autoPlayStore.selectedRoundOnPopup;
        this.autoPlayStore.isOpenAutoplayPopup = false;
        if (this.isValidBet()) {
            this.autoPlayStore.isAutoplay = true;
            this.betHandler.autoPlaceBet();
            this.updateAutoPlayRounds(this.autoPlayStore.roundsAutoplay - 1);
        } else {
            this.cancelAutoPlay();
        }
    }

    updateAutoPlayRounds(rounds: number) {
        this.autoPlayStore.roundsAutoplay = rounds;
    }

    checkFinishedAutoPlay() {
        return this.autoPlayStore.isAutoplay && this.autoPlayStore.roundsAutoplay <= 0;
    }

    checkSpinNextRound() {
        if (!this.autoPlayStore.isAutoplay) {
            return;
        }
        this.handleAutoPlaceBet();
    }
}
