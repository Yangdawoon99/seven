export const equipmentData = {
    weapon_type: ["physical", "magic"],
    sets: [
        "vanguard", "tracker", "paladin", "gatekeeper", "guardian",
        "assassin", "avenger", "shaman", "arbiter"
    ],
    setIcons: {
        vanguard: "assets/sets/SetIcon_1.png",
        tracker: "assets/sets/SetIcon_2.png",
        guardian: "assets/sets/SetIcon_3.png",
        paladin: "assets/sets/SetIcon_4.png",
        assassin: "assets/sets/SetIcon_5.png",
        gatekeeper: "assets/sets/SetIcon_6.png",
        shaman: "assets/sets/SetIcon_7.png",
        arbiter: "assets/sets/SetIcon_8.png",
        avenger: "assets/sets/SetIcon_9.png"
    },
    options: {
        weapon: {
            main: [
                "physical_attack", "weakness_rate", "crit_rate", "crit_damage", "attack_percent",
                "defense_percent", "defense", "hp_percent", "hp", "effect_hit"
            ],
            sub: [
                "physical_attack", "attack_percent", "defense_percent", "hp_percent", "crit_rate",
                "weakness_rate", "effect_hit", "speed", "crit_damage", "block_rate", "effect_resist"
            ]
        },
        armor: {
            main: [
                "damage_reduce", "block_rate", "attack_percent", "attack",
                "defense_percent", "defense", "hp_percent", "hp", "effect_resist"
            ],
            sub: [
                "damage_reduce", "attack_percent", "defense_percent", "hp_percent", "crit_rate",
                "weakness_rate", "effect_hit", "speed", "crit_damage", "block_rate", "effect_resist"
            ]
        }
    }
};
