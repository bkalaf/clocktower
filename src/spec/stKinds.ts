export type STKind = string

const INFO_KIND_PREFIX = 'INFO'
const TRIGGER_KIND_PREFIX = 'TRIGGER'
const RESOLVE_KIND_PREFIX = 'RESOLVE'
const RULES_KIND_PREFIX = 'RULES'
const ENFORCE_KIND_PREFIX = 'ENFORCE'
const WINCHECK_KIND_PREFIX = 'WINCHECK'

export function infoKind(roleKey: string): STKind {
  return `${INFO_KIND_PREFIX}/${roleKey}`
}

export function triggerKind(roleKey: string, triggerName: string): STKind {
  return `${TRIGGER_KIND_PREFIX}/${roleKey}/${triggerName}`
}

export function resolveKind(roleKey: string, actionName: string): STKind {
  return `${RESOLVE_KIND_PREFIX}/${roleKey}/${actionName}`
}

export function rulesKind(ruleKey: string): STKind {
  return `${RULES_KIND_PREFIX}/${ruleKey}`
}

export function enforceKind(mechanic: string): STKind {
  return `${ENFORCE_KIND_PREFIX}/${mechanic}`
}

export function winCheckKind(ruleKey: string): STKind {
  return `${WINCHECK_KIND_PREFIX}/${ruleKey}`
}

const InfoKindRegex = new RegExp(`^${INFO_KIND_PREFIX}/[^/]+$`)
const TriggerKindRegex = new RegExp(`^${TRIGGER_KIND_PREFIX}/[^/]+/[^/]+$`)
const ResolveKindRegex = new RegExp(`^${RESOLVE_KIND_PREFIX}/[^/]+/[^/]+$`)
const RulesKindRegex = new RegExp(`^${RULES_KIND_PREFIX}/[^/]+$`)
const EnforceKindRegex = new RegExp(`^${ENFORCE_KIND_PREFIX}/[^/]+$`)
const WinCheckKindRegex = new RegExp(`^${WINCHECK_KIND_PREFIX}/[^/]+$`)

export function isInfoKind(candidate: STKind): candidate is STKind {
  return InfoKindRegex.test(candidate)
}

export function isTriggerKind(candidate: STKind): candidate is STKind {
  return TriggerKindRegex.test(candidate)
}

export function isResolveKind(candidate: STKind): candidate is STKind {
  return ResolveKindRegex.test(candidate)
}

export function isRulesKind(candidate: STKind): candidate is STKind {
  return RulesKindRegex.test(candidate)
}

export function isEnforceKind(candidate: STKind): candidate is STKind {
  return EnforceKindRegex.test(candidate)
}

export function isWinCheckKind(candidate: STKind): candidate is STKind {
  return WinCheckKindRegex.test(candidate)
}
