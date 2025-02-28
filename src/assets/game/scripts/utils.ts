export const MULTIPLIER_THRESHOLDS = {
    LEVEL_4: 100,
    LEVEL_3: 10,
    LEVEL_2: 1.1,
    LEVEL_1: 0,
};

export const getCurrentAnimationLevel = (multiplier: number): number => {
    const { LEVEL_4, LEVEL_3, LEVEL_2 } = MULTIPLIER_THRESHOLDS;
    if (multiplier >= LEVEL_4) return 4;
    if (multiplier >= LEVEL_3) return 3;
    if (multiplier >= LEVEL_2) return 2;
    return 1;
};
