// src/types/roles.ts
export type RoleDefinition = {
    id: string;
    name: string;
    edition?: string;
    team?: string;
    firstNight?: number;
    firstNightReminder?: string;
    otherNight?: number;
    otherNightReminder?: string;
    reminders?: string[];
    remindersGlobal?: string[];
    setup?: boolean;
    ability?: string;
    abilityShort?: string;
};

export type FabledDefinition = RoleDefinition;

export {};
