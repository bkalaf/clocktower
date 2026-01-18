// src/data/scripts.ts
export const builtinScripts = [
    {
        scriptId: 'trouble-brewing',
        name: 'Trouble Brewing',
        isBuiltin: true,
        characters: [
            { id: 'barista', name: 'Barista', team: 'town', icon: '☕' },
            { id: 'baker', name: 'Baker', team: 'town', icon: '🥐' },
            { id: 'slave-owner', name: 'Slave Owner', team: 'evil', icon: '🔪' }
        ]
    },
    {
        scriptId: 'sects-and-violets',
        name: 'Sects & Violets',
        isBuiltin: true,
        characters: [
            { id: 'master', name: 'Master', team: 'evil', icon: '⚔️' },
            { id: 'violet', name: 'Violet', team: 'town', icon: '🌸' },
            { id: 'pilgrim', name: 'Pilgrim', team: 'town', icon: '🛐' }
        ]
    },
    {
        scriptId: 'bad-moon-rising',
        name: 'Bad Moon Rising',
        isBuiltin: true,
        characters: [
            { id: 'werewolf', name: 'Werewolf', team: 'evil', icon: '🐺' },
            { id: 'citizen', name: 'Villager', team: 'town', icon: '🏡' },
            { id: 'seer', name: 'Seer', team: 'town', icon: '🔮' }
        ]
    },
    {
        scriptId: 'experimental-shadowplay',
        name: 'Experimental Shadowplay',
        isBuiltin: true,
        characters: [
            { id: 'archon', name: 'Archon', team: 'neither', icon: '🪐' },
            { id: 'shadow', name: 'Shadow', team: 'evil', icon: '🌑' },
            { id: 'lookout', name: 'Lookout', team: 'town', icon: '👁️' }
        ]
    }
];
