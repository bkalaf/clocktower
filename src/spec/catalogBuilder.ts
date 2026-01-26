import path from 'node:path'
import { promises as fs } from 'node:fs'
import { Pattern, namespaceClaimKind } from './enginePrimitives'
import { infoKind, resolveKind, triggerKind } from './stKinds'
import { PromptRoleContext, RoleCategory, RoleSpec, Edition } from './roleSpecTemplate'
import rolesData from '../assets/data/roles.json'

export interface NormalizedWikiRecord {
  roleKey: string
  title: string
  url: string
  categoryHint: string
  summary: string
  howToRun: string
  examples: string
  jinxes: string
  rulings: string
  source: {
    fetchedAt: string
    pageid: number
  }
}

export interface BuildCatalogsResult {
  roleSpecCatalog: RoleSpec[]
  promptRoleContextCatalog: PromptRoleContext[]
}

export interface BuildCatalogsOptions {
  inputDir: string
  outputDir: string
}

const HIDDEN_INFO_RULES = [
  'Never reveal hidden effects (drunk/poison/madness) to players.',
  'Do not reveal true roles or alignments unless rules explicitly say so.',
  'If uncertain, ask the Storyteller (ST_REQUEST) rather than guessing.'
]

const EDITION_OVERRIDES: Record<string, Edition> = {
  tb: 'TB',
  snv: 'SnV',
  bmr: 'BMR'
}

const normalizeRoleKey = (value: string): string =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '')

const buildEditionLookup = (): Map<string, Edition> => {
  const lookup = new Map<string, Edition>()
  const entries = Array.isArray(rolesData) ? rolesData : []
  entries.forEach((entry) => {
    if (!entry || typeof entry !== 'object') return
    const key = (entry as { id?: unknown }).id
    const editionId = (entry as { edition?: unknown }).edition
    if (typeof key !== 'string') return
    if (typeof editionId !== 'string') return
    const mapped = EDITION_OVERRIDES[editionId.toLowerCase()]
    if (!mapped) return
    lookup.set(normalizeRoleKey(key), mapped)
  })
  return lookup
}

const roleEditionLookup = buildEditionLookup()

const CATEGORY_KEYWORDS: Record<RoleCategory, string[]> = {
  townsfolk: ['townsfolk'],
  outsider: ['outsider'],
  minion: ['minion'],
  demon: ['demon'],
  traveller: ['traveller', 'traveler'],
  fabled: ['fabled'],
  loric: ['loric'],
  experimental: ['experimental']
}

const determineCategory = (categoryHint: string): { category: RoleCategory; matched: boolean } => {
  const normalized = categoryHint.toLowerCase()
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((keyword) => normalized.includes(keyword))) {
      return { category: category as RoleCategory, matched: true }
    }
  }
  return { category: 'experimental', matched: false }
}

const determineEdition = (roleKey: string, category: RoleCategory): { edition: Edition; matched: boolean } => {
  const matched = roleEditionLookup.get(normalizeRoleKey(roleKey))
  if (matched) return { edition: matched, matched: true }
  if (category === 'experimental') return { edition: 'Experimental', matched: false }
  if (category === 'traveller' || category === 'fabled' || category === 'loric') {
    return { edition: 'N/A', matched: false }
  }
  return { edition: 'Experimental', matched: false }
}

const containsAny = (text: string, keywords: string[]): boolean =>
  keywords.some((keyword) => text.includes(keyword))

const gatherPatterns = (text: string): Pattern[] => {
  const patterns = new Set<Pattern>()
  if (containsAny(text, ['each night', 'each day'])) {
    patterns.add(Pattern.P2_SCHEDULED_ACTION)
  }
  if (containsAny(text, ['learn', 'you know', 'is told'])) {
    patterns.add(Pattern.P3_INFO_PROVIDER)
  }
  if (text.includes('once per game') && !text.includes('night')) {
    patterns.add(Pattern.P4_CLAIM_ACTION)
  }
  if (containsAny(text, ['becomes', 'swap', 'change character'])) {
    patterns.add(Pattern.P5_IDENTITY_MUTATION)
  }
  if (containsAny(text, ['rules', 'win', 'cannot die at night'])) {
    patterns.add(Pattern.P6_GLOBAL_RULE)
  }
  if (containsAny(text, ['mad', 'must claim', 'if you say'])) {
    patterns.add(Pattern.P7_SPEECH_ENFORCEMENT)
  }
  if (containsAny(text, ['setup', 'adds', 'extra', 'starts knowing'])) {
    patterns.add(Pattern.P8_SETUP_CONSTRAINT)
  }
  return Array.from(patterns)
}

const determineClaimKinds = (roleKey: string, patterns: Pattern[], text: string): string[] => {
  const claimKinds = new Set<string>()
  const addDefaultClaim = patterns.some((pattern) =>
    [
      Pattern.P2_SCHEDULED_ACTION,
      Pattern.P3_INFO_PROVIDER,
      Pattern.P4_CLAIM_ACTION,
      Pattern.P7_SPEECH_ENFORCEMENT
    ].includes(pattern)
  )
  if (addDefaultClaim || text.includes('claim')) {
    claimKinds.add(namespaceClaimKind(roleKey, undefined))
  }
  if (text.includes('question')) {
    claimKinds.add(namespaceClaimKind(roleKey, 'question'))
  }
  if (text.includes('guess')) {
    claimKinds.add(namespaceClaimKind(roleKey, 'guess'))
  }
  return Array.from(claimKinds)
}

const determineStKinds = (
  roleKey: string,
  patterns: Pattern[],
  text: string
): { stKinds: string[]; hints: PromptRoleContext['stKindHints'] } => {
  const kinds: string[] = []
  const hints: PromptRoleContext['stKindHints'] = {}
  const wantsInfo =
    patterns.includes(Pattern.P3_INFO_PROVIDER) || containsAny(text, ['learn', 'you know', 'is told'])
  if (wantsInfo) {
    const info = infoKind(roleKey)
    kinds.push(info)
    hints.infoKind = info
  }
  const wantsResolve = patterns.includes(Pattern.P2_SCHEDULED_ACTION) || patterns.includes(Pattern.P4_CLAIM_ACTION)
  if (wantsResolve) {
    const resolve = resolveKind(roleKey, 'action')
    kinds.push(resolve)
    hints.resolveKinds = [resolve]
  }
  const wantsTrigger = patterns.includes(Pattern.P1_PASSIVE_LISTENER) || patterns.includes(Pattern.P7_SPEECH_ENFORCEMENT)
  if (wantsTrigger) {
    const trigger = triggerKind(roleKey, 'trigger')
    kinds.push(trigger)
    hints.triggerKinds = [trigger]
  }
  return { stKinds: kinds, hints }
}

const determineEffectTypes = (text: string): string[] => {
  const effects = new Set<string>()
  if (text.includes('poison')) effects.add('POISONED')
  if (text.includes('drunk')) effects.add('DRUNK')
  if (text.includes('protect')) effects.add('PROTECTED')
  if (containsAny(text, ['cannot vote', "can't vote", 'may not vote'])) effects.add('VOTE_LOCKED')
  if (containsAny(text, ['extra vote', 'vote counts'])) effects.add('VOTE_WEIGHT')
  if (text.includes('mad')) effects.add('MADNESS')
  if (text.includes('silenc')) effects.add('SILENCED')
  if (text.includes('appears dead')) effects.add('APPEARS_DEAD')
  if (text.includes('hosted')) effects.add('HOSTED_BY')
  return Array.from(effects)
}

const determineRequiredMoments = (patterns: Pattern[], text: string): string[] => {
  const moments = new Set<string>()
  if (patterns.includes(Pattern.P5_IDENTITY_MUTATION) || containsAny(text, ['becomes', 'swap', 'change'])) {
    moments.add('ROLE_CHANGED')
  }
  return Array.from(moments)
}

const splitHighlights = (text: string, maxChunks: number, maxLength = 200): string[] => {
  if (!text.trim()) return []
  const candidates = text
    .split(/(?:\r?\n)+|(?<=[.!?])\s+/)
    .map((chunk) => chunk.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
  const highlights: string[] = []
  for (const chunk of candidates) {
    if (highlights.length >= maxChunks) break
    if (chunk.length <= maxLength) {
      highlights.push(chunk)
    } else {
      const truncated = `${chunk.slice(0, maxLength).trim()}…`
      highlights.push(truncated)
    }
  }
  return highlights
}

const buildPromptContext = (
  record: NormalizedWikiRecord,
  claimKinds: string[],
  stKindHints: PromptRoleContext['stKindHints']
): PromptRoleContext => ({
  roleKey: record.roleKey,
  title: record.title,
  summary: record.summary,
  howToRunHighlights: splitHighlights(record.howToRun, 3),
  exampleHighlights: splitHighlights(record.examples, 2),
  jinxNotes: splitHighlights(record.jinxes, 2),
  engineConstraints: {
    hiddenInfoRules: [...HIDDEN_INFO_RULES],
    allowedClaimKinds: claimKinds
  },
  stKindHints
})

const parseNormalizedRecord = (input: unknown): NormalizedWikiRecord => {
  if (!input || typeof input !== 'object') {
    throw new Error('Normalized record must be an object')
  }
  const record = input as Record<string, unknown>
  const getString = (key: string): string => {
    const value = record[key]
    return typeof value === 'string' ? value : ''
  }
  const source = record.source
  if (!source || typeof source !== 'object') {
    throw new Error('Normalized record missing source metadata')
  }
  const sourceRecord = source as Record<string, unknown>
  const fetchedAt = sourceRecord.fetchedAt
  const pageid = sourceRecord.pageid
  if (typeof fetchedAt !== 'string' || typeof pageid !== 'number') {
    throw new Error('Normalized record.source is malformed')
  }
  return {
    roleKey: getString('roleKey'),
    title: getString('title'),
    url: getString('url'),
    categoryHint: getString('categoryHint'),
    summary: getString('summary'),
    howToRun: getString('howToRun'),
    examples: getString('examples'),
    jinxes: getString('jinxes'),
    rulings: getString('rulings'),
    source: {
      fetchedAt,
      pageid
    }
  }
}

const collectRecords = async (inputDir: string): Promise<NormalizedWikiRecord[]> => {
  const entries = await fs.readdir(inputDir)
  const records: NormalizedWikiRecord[] = []
  for (const entry of entries) {
    if (!entry.toLowerCase().endsWith('.json')) continue
    const filePath = path.join(inputDir, entry)
    const content = await fs.readFile(filePath, 'utf8')
    const parsed = JSON.parse(content) as unknown
    records.push(parseNormalizedRecord(parsed))
  }
  return records
}

export const buildCatalogsFromRecords = (
  records: NormalizedWikiRecord[]
): BuildCatalogsResult => {
  const roleSpecs: RoleSpec[] = []
  const promptContexts: PromptRoleContext[] = []
  for (const record of records) {
    const text = [record.summary, record.howToRun, record.examples].join(' ').toLowerCase()
    const { category, matched: categoryMatched } = determineCategory(record.categoryHint)
    const { edition, matched: editionMatched } = determineEdition(record.roleKey, category)
    const patterns = gatherPatterns(text)
    const claimKinds = determineClaimKinds(record.roleKey, patterns, text)
    const { stKinds, hints } = determineStKinds(record.roleKey, patterns, text)
    const effectTypes = determineEffectTypes(text)
    const requiredMoments = determineRequiredMoments(patterns, text)
    const notes: string[] = []
    if (!categoryMatched) {
      notes.push(`Category hint "${record.categoryHint}" could not be mapped; defaulted to experimental.`)
    }
    if (!editionMatched) {
      notes.push(`Edition could not be resolved; defaulted to ${edition}.`)
    }
    if (patterns.length === 0) {
      notes.push('Pattern inference yielded no matches; review and assign appropriate patterns manually.')
    }
    const roleSpec: RoleSpec = {
      roleKey: record.roleKey,
      title: record.title,
      url: record.url,
      category,
      edition,
      patterns,
      hooks: {},
      claimKinds,
      stKinds,
      effectTypes,
      requiredMoments,
      jinxKeys: [],
      notes
    }
    roleSpecs.push(roleSpec)
    const promptContext = buildPromptContext(record, claimKinds, hints)
    promptContexts.push(promptContext)
  }
  roleSpecs.sort((a, b) => a.roleKey.localeCompare(b.roleKey))
  promptContexts.sort((a, b) => a.roleKey.localeCompare(b.roleKey))
  return {
    roleSpecCatalog: roleSpecs,
    promptRoleContextCatalog: promptContexts
  }
}

export const buildCatalogs = async ({ inputDir, outputDir }: BuildCatalogsOptions): Promise<void> => {
  const records = await collectRecords(inputDir)
  const { roleSpecCatalog, promptRoleContextCatalog } = buildCatalogsFromRecords(records)
  await fs.mkdir(outputDir, { recursive: true })
  await Promise.all([
    fs.writeFile(
      path.join(outputDir, 'roleSpecCatalog.json'),
      JSON.stringify(roleSpecCatalog, null, 2),
      'utf8'
    ),
    fs.writeFile(
      path.join(outputDir, 'promptRoleContextCatalog.json'),
      JSON.stringify(promptRoleContextCatalog, null, 2),
      'utf8'
    )
  ])
}
