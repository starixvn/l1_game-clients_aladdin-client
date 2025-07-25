const win = window as any;
export const languages = {
    "Common": {},
    "cascadingslot": {
        "auto_spin": "自动旋转",
        "auto_spin_guide_text": "自动旋转次数",
        "auto_spin_left": "自动旋转剩余",
        "bet_level": "赌注级别",
        "bet_level_shorten": "赌注级别",
        "bet_multiplier_x": "投注乘数20倍",
        "big_win": "大赢",
        "coin_value": "硬币价值",
        "Common-example": "例子：",
        "congratulations": "恭喜",
        "disable_turbo_mode": "涡轮模式“关闭”",
        "enable_turbo_mode": "涡轮模式“开启”",
        "example": "例子：",
        "extra_free_spin": "额外Free Spins",
        "free_spin": "Free Spins",
        "free_spin_left_amount": "Free Spin剩余 %{amount}",
        "free_spin_title": "Free Spin",
        "FreeSpin-title": "Free Spin",
        "from_settle_to_spin1": "旋转获胜！",
        "from_settle_to_spin2": "旋转更多，赢得更多！",
        "from_settle_to_spin3": "尝试涡轮模式！",
        "gameNames.47": "宝藏岛",
        "header_no": "号",
        "header_result_board": "结果板",
        "header_tumble_win": "连续中奖",
        "header_win_amount": "获胜金额",
        "header_win_symbols": "赢符号",
        "index": "号",
        "label_on_game_icon": "级联卷轴",
        "mega_win": "巨级赢",
        "multiplier": "乘数",
        "multiplier_preview_odds": "乘数奖金将适用于翻滚获胜。",
        "Payout-title": "赔率表",
        "paytable": "赔率表",
        "press_to_continue": "按任意位置继续",
        "reach_max_win": "您达到了最大胜利",
        "real_mode": "真钱模式",
        "round_settle_msg": "祝你好运！",
        "show_msg_when_spin_desktop": "按住空格键或点击旋转",
        "show_msg_when_spin_phone": "点击或按住旋转开始",
        "start": "开始",
        "super_win": "超级赢",
        "top_message1": "符号在屏幕上的任何地方支付",
        "top_message2a": "击中",
        "top_message2b": "多次翻滚获胜",
        "top_message3": "赢取 %{maxWin}X 乘数",
        "total_bet": "总投注",
        "total_bet_shorten": "总投注",
        "total_multiplier": "总乘数",
        "total_win": "赢",
        "trial_mode": "试玩模式",
        "trial_mode_text": "您处于试用模式",
        "turbo_mode": "涡轮模式",
        "warning_trial_mode": "真玩，\\n赢真钱",
        "win_tumble_msg": "恭喜！",
        "you_win_free_spin": "您赢得"
    },
    "AladdinsWishes": {
        "game_icon_name": "阿拉丁神灯",
        "game_name": "阿拉丁神灯"
    }
};

if (!win.languages) {
    win.languages = {};
}

win.languages.zh_cn = languages;