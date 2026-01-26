export type JinxKey = string

export interface JinxRule {
  key: JinxKey
  roles: [string, string]
  summary: string
  stNotes: string
}

export const KNOWN_JINX_RULES: JinxRule[] = []

export function computeActiveJinxes(inPlayRoleKeys: string[]): JinxKey[] {
  const normalizedSet = new Set(inPlayRoleKeys)
  return KNOWN_JINX_RULES.filter((rule) =>
    rule.roles.every((roleKey) => normalizedSet.has(roleKey))
  ).map((rule) => rule.key)
}
