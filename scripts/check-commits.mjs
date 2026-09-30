import { execFileSync } from 'node:child_process'

const [base, head = 'HEAD'] = process.argv.slice(2)

function resolveRange() {
  if (!base) return '-1'
  try {
    const mergeBase = execFileSync('git', ['merge-base', base, head], { encoding: 'utf8' }).trim()
    return `${mergeBase}..${head}`
  } catch {
    return `${base}..${head}`
  }
}

const separator = String.fromCharCode(30)
const raw = execFileSync('git', ['log', resolveRange(), `--pretty=format:%s%n%b${separator}`], { encoding: 'utf8' })
const commits = raw
  .split(separator)
  .map((entry) => entry.replace(/^\n+/, '').replace(/\n+$/, ''))
  .filter(Boolean)
  .map((entry) => {
    const [subject, ...bodyLines] = entry.split('\n')
    return { subject, body: bodyLines.join('\n') }
  })

const subjectPattern = /^(?:[a-z][a-z0-9-]*: )?[a-z][^!]*$/
const conventionalTypes = /^(?:feat|fix|perf|refactor|chore|revert)(?:\([^)]*\))?!?: /
const scopedType = /^[a-z][a-z0-9-]*\([^)]*\): /
const trailerPattern = /^(?:BREAKING[ -]CHANGE|Signed-off-by|Co-authored-by|Reviewed-by|Acked-by):/im

const failures = []
for (const { subject, body } of commits) {
  if (!subjectPattern.test(subject) || subject.endsWith('.')) {
    failures.push(`${subject}\n    subject must be lowercase, imperative, and optionally use an area prefix`)
  } else if (conventionalTypes.test(subject) || scopedType.test(subject)) {
    failures.push(`${subject}\n    do not use Conventional Commit types or scopes`)
  }
  if (trailerPattern.test(body)) {
    failures.push(`${subject}\n    do not use commit trailers`)
  }
}

if (failures.length > 0) {
  console.error('Commit style violations:')
  failures.forEach((failure) => console.error(`  ${failure}`))
  process.exit(1)
}

console.log(`Commit style passed for ${commits.length} commit(s).`)
