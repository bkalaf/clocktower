import {
  enforceKind,
  infoKind,
  isEnforceKind,
  isInfoKind,
  isResolveKind,
  isRulesKind,
  isTriggerKind,
  isWinCheckKind,
  resolveKind,
  rulesKind,
  triggerKind,
  winCheckKind
} from '../stKinds'

describe('ST kind helpers', () => {
  it('builds kind strings with predictable prefixes', () => {
    expect(infoKind('seer')).toBe('INFO/seer')
    expect(triggerKind('seer', 'wake')).toBe('TRIGGER/seer/wake')
    expect(resolveKind('seer', 'action')).toBe('RESOLVE/seer/action')
    expect(rulesKind('night-rule')).toBe('RULES/night-rule')
    expect(enforceKind('claim')).toBe('ENFORCE/claim')
    expect(winCheckKind('good-victory')).toBe('WINCHECK/good-victory')
  })

  it('validates kinds correctly', () => {
    expect(isInfoKind('INFO/seer')).toBe(true)
    expect(isTriggerKind('TRIGGER/seer/wake')).toBe(true)
    expect(isResolveKind('RESOLVE/seer/action')).toBe(true)
    expect(isRulesKind('RULES/night-rule')).toBe(true)
    expect(isEnforceKind('ENFORCE/claim')).toBe(true)
    expect(isWinCheckKind('WINCHECK/good-victory')).toBe(true)

    // false positives should be rejected
    expect(isInfoKind('INFO/seer/extra')).toBe(false)
    expect(isTriggerKind('TRIGGER/seer')).toBe(false)
    expect(isResolveKind('RESOLVE/seer')).toBe(false)
    expect(isRulesKind('RULES')).toBe(false)
    expect(isEnforceKind('ENFORCE')).toBe(false)
    expect(isWinCheckKind('WINCHECK')).toBe(false)
  })
})
