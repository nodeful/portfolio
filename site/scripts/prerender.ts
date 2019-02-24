import * as prerender from 'prerender'
import * as isReachable from 'is-reachable'
import * as fetch from 'node-fetch'
import { writeFile } from 'fs-extra'

const URL = 'http://localhost:8080'
;(async () => {
  try {

    let tries = 0

    while (!await isReachable(URL)) {
      tries++
      if (tries > 10) {
        console.error(new Error(`Was not able to reach ${URL}`))
        process.exit(1)
      }
      await new Promise(r => setTimeout(r, 500))
    }

    prerender().start()
    console.log('Prerenderer ready, prerendering')

    const indexHtml = await fetch(`http://localhost:3000/render?url=${URL}`).then(res => res.text())
    if (!indexHtml) throw new Error('Failed to fetch HTML')
    console.log('Prerendered, saving index.html')

    await writeFile('./dist/index.html', indexHtml)
    console.log('index.html saved')

    process.exit(0)
  } catch (err) {
    console.error(err instanceof Error ? err : new Error(err))
    process.exit(1)
  }
})()
