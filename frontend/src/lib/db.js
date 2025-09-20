// Small helper to read JSON cases. In future replace with DB access (Supabase / Prisma).
import fs from 'fs'
import path from 'path'

export function listCases() {
  const casesDir = path.join(process.cwd(), 'data', 'cases')
  const files = fs.readdirSync(casesDir).filter(f => f.endsWith('.json'))
  return files.map(f => {
    const raw = fs.readFileSync(path.join(casesDir, f), 'utf8')
    const j = JSON.parse(raw)
    return { caseId: j.caseId, title: j.title }
  })
}
