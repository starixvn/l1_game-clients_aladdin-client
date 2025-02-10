import { Label, Node, Prefab, _decorator, instantiate } from "cc";
import { ObserverComponent } from "db://shared-components/shared/common-components/observer-component/scripts/observer-component";

import gc from "@sg/game-client-base";
import Observer from "observer";
import { BaseResultBodyItem } from "db://shared-components/game/bet-history/scripts/components/bet-history-body-item";
import { LabelCopyComponent } from "db://shared-components/shared/common-components/copy-label/scripts/label-copy-component";
import { ClientSeedInfo } from "db://shared-components/shared/common-components/provably-fair/client-seed-info";
import { FunctionUtils } from "db://shared-components/shared/utils";
const { ccclass, property } = _decorator;
const { render, handle } = Observer;

const { Shared, RoundBasePF } = gc;
const { utils } = Shared;

@ccclass()
export class ProvablyFairPopup extends ObserverComponent {
    @property(Label)
    lblRoundId: Label = null;

    @property(Label)
    lblCrashPoint: Label = null;

    @property(Label)
    lblClientSeed: Label = null;

    @property(LabelCopyComponent)
    lblServerSeed: LabelCopyComponent = null;

    @property(LabelCopyComponent)
    lblServerSeedHash: LabelCopyComponent = null;

    @property(LabelCopyComponent)
    lblFinalHash: LabelCopyComponent = null;

    @property(Label)
    lblParaVerification: Label = null;

    @property(Node)
    nodeDisabledVerification: Node = null;

    onLoad() {
        super.onLoad();
        const para = `${gc.Translator.commonTranslate("pf_provably_fair_para_2")}`;
        this.lblParaVerification.string = para;
        this.handleGATracking();
    }

    handleGATracking() {
        utils.AnalyticsManager.trackEvent(gc.Shared.utils.TrackingEvent.Button, {
            location: FunctionUtils.getNamespace(),
            action: gc.Shared.utils.TrackingAction.Show,
            object_name: utils.PFObjectName.PFUseGuide,
            game_name: FunctionUtils.getNamespace(),
        });
    }

    @render(RoundBasePF.PFVerificationStore, (store) => store.verification)
    private renderVerification(verification: gc.GameServiceMessage.ProvablyFair) {
        if (!verification) {
            return;
        }

        const { serverSeed, serverSeedHash, finalHash, clientSeeds, result, roundId } = verification;
        this.lblRoundId.string = roundId.toString();
        this.lblCrashPoint.string = result.toString();

        if (clientSeeds) {
            this.lblClientSeed.string = clientSeeds[0].toString();
        }

        serverSeed && this.lblServerSeed.setString(serverSeed);
        this.lblServerSeed.setActive(!!serverSeed);

        serverSeedHash && this.lblServerSeedHash.setString(serverSeedHash);
        this.lblServerSeedHash.setActive(!!serverSeedHash);

        // finalHash && this.lblFinalHash.setString(finalHash);
        // this.lblFinalHash.setActive(!!finalHash);

        this.nodeDisabledVerification.active = !result;
    }

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    @handle(RoundBasePF.ProvablyFairHandler, (handle) => handle.closeVerification())
    onClickClose() {}

    @handle(gc.Audios.AudioHandler, (handle) => handle.playSFX(gc.Audios.AudioIds.CLICK))
    clickVerify() {
        this.openVerificationPopup();
    }

    @handle(gc.PFVerification.WebViewPFVerificationHandlers.VerificationPopupHandler)
    openVerificationPopup() {
        return true;
    }
}
