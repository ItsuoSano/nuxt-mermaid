import { createRequire } from 'node:module'
import { visit } from 'unist-util-visit'
import { Code, Parent } from 'mdast'
import { Plugin, Transformer } from 'unified'
import { launch } from 'puppeteer'

type CodeInstance = {
  code:Code,
  index:number,
  parent: Parent
}

const createMermaidContent = async (codes:CodeInstance[]) => {
  if (!codes.length) {
    return
  }
  const browser = await launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  })

  for (const { code, index, parent } of codes) {
    const page = await browser.newPage()
    const pageUrl = import.meta.url.replace('index.js', 'index.html')
    await page.goto(pageUrl)
    await page.addScriptTag({
      path: createRequire(import.meta.url).resolve('mermaid/dist/mermaid.min.js')
    })
    const result = await page.evaluate(
      (code, index) => {
        try {
          return {
            success: true,
            // evaluateの内部は puppeteerの ブラウザでの実行なのだが、tsがエラーを吐くため ts-ignoreをする
            /* @ts-ignore */
            value: mermaid.render(`remark-mermaid-${index}`, code.value)
          }
        } catch (error) {
          return {
            success: false,
            value: error instanceof Error ? error.message : String(error)
          }
        }
      }
      , code, index)

    parent.children[index] = {
      type: 'paragraph',
      children: [{ type: 'html', value: `<nuxt-mermaid svg-content="${encodeURIComponent(result.value)}"></nuxt-mermaid>` }]
    }
  }

  browser.close()
}

const remarkMermaid:Plugin = () => {
  const transformer:Transformer = async (tree, file) => {
    const mermaidCodes : CodeInstance[] = []
    visit(tree, { type: 'code', lang: 'mermaid' }, (code:Code, index:number, parent) => {
      mermaidCodes.push({ code, parent, index })
    })

    await createMermaidContent(mermaidCodes)
  }
  return transformer
}

export default remarkMermaid
