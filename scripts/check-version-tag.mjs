import { readFileSync } from 'node:fs'

const tag = process.argv[2]
const { version } = JSON.parse(readFileSync('package.json', 'utf8'))

if (tag !== `v${version}`) {
  console.error(`Tag ${tag || '(missing)'} does not match package version v${version}.`)
  process.exit(1)
}

console.log(`Tag ${tag} matches package version ${version}.`)
