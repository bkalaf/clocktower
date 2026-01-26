export interface Signals {
    eachNight: boolean;
    eachDay: boolean;
    oncePerGame: boolean;
    youLearn: boolean;
    choose: boolean;
    dies: boolean;
}

export interface JinxEntry {
    with: string;
    withKey: string;
    alignment: string;
    text: string;
}

export interface NormalizedWikiPage {
    roleKey: string;
    title: string;
    url: string;
    categoryHint?: string;
    categories: string[];
    editionTags: string[];
    abilityText: string;
    summary: string;
    howToRun?: string;
    examples: string[];
    jinxes: JinxEntry[];
    otherSections: Record<string, string>;
    signals: Signals;
    sections: {
        summary?: string;
        how_to_run?: string;
        examples: string[];
        other: Record<string, string>;
    };
}

export interface RoleRecord {
    roleKey: string;
    title: string;
    url: string;
    categoryHint?: string;
    editionTags: string[];
    abilityText: string;
    summary: string;
    howToRun?: string;
    examples: string[];
    jinxes: JinxEntry[];
    signals: Signals;
}

export interface JinxIndexEntry {
    roles: [string, string];
    roleTitles: [string, string];
    alignmentTag: string;
    text: string;
    sourceRole: string;
}
