import { Pattern } from './enginePrimitives'

export type RoleCategory =
  | 'townsfolk'
  | 'outsider'
  | 'minion'
  | 'demon'
  | 'traveller'
  | 'fabled'
  | 'loric'
  | 'experimental'

export type Edition = 'TB' | 'SnV' | 'BMR' | 'Experimental' | 'N/A'

export interface RoleSpec {
  roleKey: string
  title?: string
  url?: string
  category: RoleCategory
  edition: Edition
  patterns: Pattern[]
  hooks: {
    firstNight?: { beforeWake?: boolean; afterWake?: boolean }
    otherNights?: { beforeWake?: boolean; afterWake?: boolean }
    onEvents?: string[]
  }
  claimKinds: string[]
  stKinds: string[]
  effectTypes: string[]
  requiredMoments: string[]
  jinxKeys: string[]
  notes: string[]
}

export interface PromptRoleContext {
  roleKey: string
  title?: string
  summary: string
  howToRunHighlights: string[]
  exampleHighlights: string[]
  jinxNotes: string[]
  engineConstraints: {
    hiddenInfoRules: string[]
    allowedClaimKinds: string[]
  }
  stKindHints: {
    infoKind?: string
    resolveKinds?: string[]
    triggerKinds?: string[]
  }
}

export const EMPTY_ROLE_SPEC_CATALOG: RoleSpec[] = []
export const EMPTY_PROMPT_CONTEXT_CATALOG: PromptRoleContext[] = []
