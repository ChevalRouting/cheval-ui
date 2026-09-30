import { execFileSync } from 'node:child_process'
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'cheval-ui-pack-'))

try {
  const output = execFileSync(
    'npm',
    ['pack', '--pack-destination', temporaryDirectory, '--silent'],
    { encoding: 'utf8', env: { ...process.env, npm_config_cache: join(tmpdir(), 'cheval-ui-npm-cache') } },
  )
  const archive = output.trim().split('\n').pop().trim()
  const archivePath = join(temporaryDirectory, archive)
  const flattenedName = packageJson.name.replace(/^@/, '').replace(/\//g, '-')

  if (!existsSync(archivePath)) throw new Error(`npm pack did not create ${archivePath}`)
  if (archive !== `${flattenedName}-${packageJson.version}.tgz`) {
    throw new Error(`unexpected archive name: ${archive}`)
  }

  const entries = execFileSync('tar', ['-tzf', archivePath], { encoding: 'utf8' })
  for (const required of ['package/dist/index.js', 'package/dist/index.d.ts', 'package/dist/styles.css', 'package/tailwind-preset.cjs']) {
    if (!entries.split('\n').includes(required)) throw new Error(`package is missing ${required}`)
  }

  console.log(`Package archive verified: ${archive}`)
} finally {
  rmSync(temporaryDirectory, { recursive: true, force: true })
}
