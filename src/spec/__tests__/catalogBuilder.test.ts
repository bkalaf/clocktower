import path from 'node:path'
import os from 'node:os'
import { promises as fs } from 'node:fs'
import { Pattern } from '../enginePrimitives'
import { PromptRoleContext, RoleSpec } from '../roleSpecTemplate'
import {
  BuildCatalogsOptions,
  buildCatalogs,
  buildCatalogsFromRecords,
  NormalizedWikiRecord
} from '../catalogBuilder'

describe('catalogBuilder heuristics', () => {
  const sampleRecords: NormalizedWikiRecord[] = [
    {
      roleKey: 'fortune_teller',
      title: 'Fortune Teller',
      url: 'https://wiki/example/Fortune_Teller',
      categoryHint: 'townsfolk',
      summary:
        'Each night you learn which of two players is evil. You learn whether either is the Demon without taking a guess.',
      howToRun:
        'Each night choose two players. Point to each and nod if one is the Demon. You are told once per game who qualifies as truth. The storyteller wakes you and shows you signals.',
      examples: 'The Storyteller wakes you and you learn who the Demon is. Watch for double claims.',
      jinxes: 'If you are drunk, you cannot learn correctly. You appear as the Demon to the Gossip.',
      rulings: '',
      source: { fetchedAt: '2026-01-26T15:00:00Z', pageid: 101 }
    },
    {
      roleKey: 'puzzle_master',
      title: 'Puzzle Master',
      url: 'https://wiki/example/Puzzle_Master',
      categoryHint: 'outsider',
      summary:
        'You may ask a question once per game and guess which player is drunk. If you guess wrong you are silenced.',
      howToRun:
        'Whenever you are nominated, ask a short question. The Storyteller answers with the truth about whoever you mention. If you guess wrong, mark silence.',
      examples: 'The Puzzle Master asks if the Sailor is drunk. They guess and the room trembles.',
      jinxes: 'The question gets you silence from strange minions.',
      rulings: '',
      source: { fetchedAt: '2026-01-26T15:10:00Z', pageid: 102 }
    }
  ]

  it('infers patterns, stKinds, claims, and editions', () => {
    const { roleSpecCatalog, promptRoleContextCatalog } = buildCatalogsFromRecords(sampleRecords)
    const fortune = roleSpecCatalog.find((spec) => spec.roleKey === 'fortune_teller')
    expect(fortune).toBeDefined()
    if (!fortune) return
    expect(fortune.patterns).toEqual(expect.arrayContaining([Pattern.P2_SCHEDULED_ACTION, Pattern.P3_INFO_PROVIDER]))
    expect(fortune.claimKinds).toEqual(expect.arrayContaining(['CLAIM/FORTUNE_TELLER']))
    expect(fortune.edition).toBe('TB')
    expect(fortune.stKinds).toEqual(expect.arrayContaining(['INFO/fortune_teller', 'RESOLVE/fortune_teller/action']))
    const puzzleRole = roleSpecCatalog.find((spec) => spec.roleKey === 'puzzle_master')
    expect(puzzleRole).toBeDefined()
    if (!puzzleRole) return
    expect(puzzleRole.claimKinds).toEqual(
      expect.arrayContaining([expect.stringContaining('/GUESS'), expect.stringContaining('/QUESTION')])
    )
    const promptContext = promptRoleContextCatalog.find((ctx) => ctx.roleKey === 'fortune_teller')
    expect(promptContext).toBeDefined()
    if (!promptContext) return
    expect(promptContext.howToRunHighlights[0].length).toBeLessThanOrEqual(200)
  })

  it('writes catalogs to disk when buildCatalogs is invoked', async () => {
    const tmpBase = await fs.mkdtemp(path.join(os.tmpdir(), 'catalog-input-'))
    const tmpOut = await fs.mkdtemp(path.join(os.tmpdir(), 'catalog-output-'))
    try {
      await Promise.all(
        sampleRecords.map((record, idx) =>
          fs.writeFile(
            path.join(tmpBase, `record-${idx}.json`),
            JSON.stringify(record, null, 2),
            'utf8'
          )
        )
      )
      const options: BuildCatalogsOptions = { inputDir: tmpBase, outputDir: tmpOut }
      await buildCatalogs(options)
      const [roleSpecCatalog, promptRoleContextCatalog] = await Promise.all([
        fs.readFile(path.join(tmpOut, 'roleSpecCatalog.json'), 'utf8'),
        fs.readFile(path.join(tmpOut, 'promptRoleContextCatalog.json'), 'utf8')
      ])
      const parsedRoleSpecs = JSON.parse(roleSpecCatalog) as RoleSpec[]
      const parsedPrompts = JSON.parse(promptRoleContextCatalog) as PromptRoleContext[]
      expect(parsedRoleSpecs).toHaveLength(sampleRecords.length)
      expect(parsedPrompts).toHaveLength(sampleRecords.length)
    } finally {
      await fs.rm(tmpBase, { recursive: true, force: true })
      await fs.rm(tmpOut, { recursive: true, force: true })
    }
  })
})
