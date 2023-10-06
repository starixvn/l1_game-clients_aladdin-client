import { _decorator } from "cc";

import { ObserverComponent } from "../../../../extensions/shared-components/assets/shared/common-components/observer-component/scripts/observer-component";

const { ccclass, property } = _decorator;

@ccclass
export class RocketFly extends ObserverComponent {
    // init() {
    //     (this.isCurrencyInitialized = !1),
    //         (this.leftHandLayoutContainers = this.findChildrenByName("left-hand-layout")),
    //         Vn.clear(),
    //         (s.Z.data = {
    //             bets: [{}, {}],
    //         }),
    //         (this.selectedBetId = 0),
    //         (s.Z.data.cashOutLevels = [1.05, 1.1, 1.15, 1.2, 1.3, 1.4, 1.5, 2, 3, 5, 10]),
    //         super.init(),
    //         (s.Z.data.countToAtoplayApplied = null),
    //         (s.Z.data.balance = void 0),
    //         (s.Z.data.totalWin = 0),
    //         (this.state = null),
    //         (this.currentTwoBetsAnimationPivot = 1),
    //         this._resetRound(),
    //         (this.playersListScroll = this.all["players-list-scroll"]),
    //         (this.rocketAnimator = this.all["rocket-animator"]),
    //         (this.rocketPoint = this.all["rocket-point"]),
    //         (this.chartLineContainer = this.all["chart-line-container"]),
    //         (this.chartLines = this.findChildrenByName("chart-line")),
    //         (this.charAxisX = this.all.charAxisX),
    //         (this.charAxisY = this.all.charAxisY),
    //         (this.rocketAnimatorBaseX = this.rocketAnimator.x),
    //         (this.chartLineContainerBaseX = this.chartLineContainer.x),
    //         this._refreshSndIcon(),
    //         this.applyScales(),
    //         Pn.initSocket(),
    //         this.stopAutoplay(),
    //         (this.appliedMultiplier = 0),
    //         this.showSettingsTab(),
    //         Cn.delay(() => {
    //             this._applyLeftHandLayout();
    //         }, 1);
    // }
    // update() {
    //     for (var t of (super.update(), this.chartLineContainer.toLocal(this.rocketPoint, this.rocketPoint.parent, jn), this.chartLines))
    //         t.scale.x = t.xRepeat = jn.x / t.texture.width;
    //     for (var e of ((this.all["multiplier-label"].tintG = this.all["rocket-tint"].tintG),
    //     this.charAxisX.toLocal(this.rocketPoint, this.rocketPoint.parent, jn),
    //     this.charAxisY.findChildrenByType(ve.Z))) {
    //         var i = s.Z.isMobile.any ? e.parent.y : 0,
    //             n = ((s.Z.data.currentMultiplier - 0.97) / jn.y) * (e.y + i) + 0.97,
    //             r = 0;
    //         n < 10 && (r = 1), (e.text = n.toFixed(r) + "×");
    //     }
    //     var a = 1;
    //     for (var o of this.charAxisX.findChildrenByType(ve.Z)) {
    //         var l = s.Z.isMobile.any ? o.parent.x : 0,
    //             h = (s.Z.data.currentTime / jn.x) * l;
    //         (h = Math.max(a++, h, h > 1 ? parseInt(o.text) : 0)), (o.text = h.toFixed(0) + "s");
    //     }
    //     var c = Math.max(0, Ln - s.Z.data.startsIn);
    //     if (
    //         ((s.Z.data.startsInBar = (0, Ne.R3)(s.Z.data.startsInBar, c, 1.15 / 60)),
    //         s.Z.data.startsInBar < c - 2 && (s.Z.data.startsInBar = c - 1),
    //         s.Z.data.startsInBar < c - 1 && (s.Z.data.startsInBar += 0.01),
    //         this.appliedMultiplier < On && s.Z.data.currentMultiplier >= On
    //             ? this.all.middle.gotoLabelRecursive("level-2")
    //             : this.appliedMultiplier < Mn && s.Z.data.currentMultiplier >= Mn && this.all.middle.gotoLabelRecursive("level-3"),
    //         (this.appliedMultiplier = s.Z.data.currentMultiplier),
    //         (this.all["wait-timer-mesh"].progress = s.Z.data.startsInBar / Ln),
    //         this.all["wait-timer-mesh"].progress > 0.95 && this.all["timer-flash"].play(),
    //         this._updateScrollHeight("players-list"),
    //         s.Z.isPortrait)
    //     )
    //         (this.rocketAnimator.x = this.rocketAnimatorBaseX), (this.chartLineContainer.x = this.chartLineContainerBaseX);
    //     else {
    //         var u = (s.Z.isMobile.any ? this.all.middle.scale.x - 1 : 0.6) * this.rocketAnimator.rotation * -Yn;
    //         (this.rocketAnimator.x = this.rocketAnimatorBaseX + u), (this.chartLineContainer.x = this.chartLineContainerBaseX + u);
    //     }
    //     var p = this.all["players-list-container"];
    //     for (var d of p.children) {
    //         var f = Math.abs(d.y + this.playersListScroll.y - qn / 2) < qn;
    //         d.visible = f;
    //     }
    //     s.Z.data.countToAtoplayApplied !== s.Z.data.countToAtoplay &&
    //         ((s.Z.data.countToAtoplayApplied = s.Z.data.countToAtoplay),
    //         (s.Z.data.countToAtoplayVisible = (0, B.Z)("space_x_y.auto")),
    //         s.Z.data.countToAtoplay &&
    //             ((s.Z.data.countToAtoplayVisible += s.Z.isPortrait && s.Z.isMobile.any ? " " : "\n"),
    //             (s.Z.data.countToAtoplayVisible += s.Z.data.countToAtoplay < 0 ? "∞" : s.Z.data.countToAtoplay)));
    //     var g = this.all["bets-count"].getLocalBounds();
    //     this.all["bets-count"].pivot.x = (g.left + g.right) / 2;
    // }
    // recalculateSize() {
    //     this.fixed && this.parent
    //         ? ((this.relativeX || this.relativeY) &&
    //               ((Ge.x = Math.round(this._xPos * s.Z.W)),
    //               (Ge.y = Math.round(this._yPos * s.Z.H)),
    //               this.parent.toLocal(Ge, s.Z.stage, Ge, !1),
    //               this.relativeX && (this.x = Ge.x),
    //               this.relativeY && (this.y = Ge.y)),
    //           (this.resizeX || this.resizeY) &&
    //               (this.parent.toLocal(We, s.Z.stage, Ge, !1),
    //               this.parent.toLocal(Ue, s.Z.stage, He, !1),
    //               this.resizeX && (this.scale.x = (s.Z.W / s.Z.projectDesc.width) * (He.x - Ge.x || 1e-6)),
    //               this.resizeY && (this.scale.y = (s.Z.H / s.Z.projectDesc.height) * (He.y - Ge.y || 1e-6))))
    //         : (this.resizeX && (this.scale.x = s.Z.W / s.Z.projectDesc.width),
    //           this.resizeY && (this.scale.y = s.Z.H / s.Z.projectDesc.height),
    //           this.relativeX && (this.x = Math.round(s.Z.W * this._xPos)),
    //           this.relativeY && (this.y = Math.round(s.Z.H * this._yPos)));
    // }
}
