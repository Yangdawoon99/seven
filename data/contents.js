export const contents = [
    {
        id: "farming",
        name: "쫄작 (Farming)",
        description: "4쫄 + 1딜러. 속공과 광역기가 중요합니다.",
        partySize: 5, // 1 Driver + 4 Fodder logic handled in optimizer
        requirements: [
            { role: "driver", count: 1, statPriority: ["speed", "attack", "crit_rate"] },
            { role: "fodder", count: 4, statPriority: [] }
        ]
    },
    {
        id: "raid",
        name: "레이드 (Raid)",
        description: "단일 딜링 극대화. 약공, 치명타 필수.",
        partySize: 5,
        requirements: [
            { role: "dealer", count: 1, statPriority: ["weakness_rate", "crit_rate", "attack"] },
            { role: "buffer", count: 4, statPriority: ["hp", "defense", "speed"] }
        ]
    },
    {
        id: "siege",
        name: "공성전 (Siege)",
        description: "3인 파티. 생존과 점수 극대화.",
        partySize: 3,
        requirements: [
            { role: "dealer", count: 1, statPriority: ["weakness_rate", "crit_rate"] },
            { role: "buffer", count: 2, statPriority: ["hp", "defense"] }
        ]
    },
    {
        id: "advent",
        name: "강림원정대 (Advent)",
        description: "상태이상 대응 및 생존력 중요.",
        partySize: 5,
        requirements: [
            { role: "all", count: 5, statPriority: ["hp", "effect_resist", "defense"] }
        ]
    }
];
