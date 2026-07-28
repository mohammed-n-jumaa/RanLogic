const fs   = require('fs')
const path = require('path')

const DIST = path.resolve(__dirname, '../../dist')

const ROUTES = [
  '/plans',
  '/faq',
  '/calorie-calculator',
  '/contact',
]

const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8')

let success = 0
let failed  = 0

for (const route of ROUTES) {
  try {
    const dir  = path.join(DIST, route)
    const file = path.join(dir, 'index.html')
    fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(file, template, 'utf-8')
    console.log(`✅  ${route}/index.html`)
    success++
  } catch (err) {
    console.error(`❌  ${route} — ${err.message}`)
    failed++
  }
}

console.log(`\n🎉  Prerender انتهى: ${success} نجح، ${failed} فشل`)