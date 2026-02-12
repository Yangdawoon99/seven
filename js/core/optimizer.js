import { heroes } from '/data/heroes.js';
import { userEquipment } from '/js/ui/equipment.js';
import { contents } from '/data/contents.js';

export function optimizeEquipment(hero, contentId, customPriorities = []) {
    // Single Hero Optimization Logic
    console.log(`Optimizing for ${hero.name}...`);

    // 1. Determine Target Stats 
    let targetStats = [];

    if (customPriorities && customPriorities.length > 0) {
        targetStats = customPriorities;
        console.log(`Using Custom UI Priorities:`, targetStats);
    } else if (hero.priority && hero.priority.length > 0) {
        targetStats = [...hero.priority];
    } else {
        // Fallback Heuristics
        let simpleTargets = [];
        if (hero.type === 'physical') {
            simpleTargets = ['physical_attack', 'crit_rate', 'speed'];
        } else {
            simpleTargets = ['magic_attack', 'crit_rate', 'speed'];
        }
        targetStats = simpleTargets.map(t => ({ stat: t, type: 'max' }));
    }

    const usedEquipmentIds = new Set();

    // 2. Find Best Weapons (Need 2)
    const availableWeapons = userEquipment.filter(e =>
        e.category === 'weapon' && !e.isEquipped &&
        (hero.type === 'physical' ? e.subType === 'physical' : e.subType === 'magic')
    );

    const bestWeapons = selectTopEquipment(availableWeapons, targetStats, 2);

    // Fallback: Fill if less than 2
    if (bestWeapons.length < 2) {
        const others = availableWeapons.filter(w => !bestWeapons.includes(w));
        if (others.length > 0) {
            bestWeapons.push(...others.slice(0, 2 - bestWeapons.length));
        }
    }

    bestWeapons.forEach(w => usedEquipmentIds.add(w.id));

    // 3. Find Best Armors (Need 2)
    const availableArmors = userEquipment.filter(e =>
        e.category === 'armor' && !e.isEquipped && !usedEquipmentIds.has(e.id)
    );

    const bestArmors = selectTopEquipment(availableArmors, targetStats, 2);

    // Fallback
    if (bestArmors.length < 2) {
        const others = availableArmors.filter(a => !bestArmors.includes(a));
        if (others.length > 0) {
            bestArmors.push(...others.slice(0, 2 - bestArmors.length));
        }
    }
    bestArmors.forEach(a => usedEquipmentIds.add(a.id));

    return {
        hero: hero,
        weapons: bestWeapons,
        armors: bestArmors,
        score: calculateTotalScore([...bestWeapons, ...bestArmors], targetStats)
    };
}

function selectTopEquipment(equipmentList, preferenceList, count) {
    if (equipmentList.length === 0) return [];

    // Calculate score for each item based on pure summation of preferred stats
    const scoredList = equipmentList.map(item => {
        let score = 0;

        preferenceList.forEach(pref => {
            const statName = pref.stat;

            // Check Main Option
            if (item.mainOption.name === statName) {
                score += parseFloat(item.mainOption.value) || 0;
            }

            // Check Sub Options
            item.subOptions.forEach(sub => {
                if (sub.name === statName) {
                    score += parseFloat(sub.value) || 0;
                }
            });
        });

        return { item, score };
    });

    // Sort descending by score. If tied, can be arbitrary or by ID
    scoredList.sort((a, b) => b.score - a.score);

    return scoredList.slice(0, count).map(s => s.item);
}

function calculateTotalScore(items, targetStats) {
    // Just for debug/display purposes
    return items.reduce((acc, item) => acc + 1, 0);
}
