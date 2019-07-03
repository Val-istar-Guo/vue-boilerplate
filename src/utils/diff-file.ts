import { diffLines, Change } from 'diff'
import chalk from 'chalk'
import { isNil } from 'ramda'


const createLineNumberFormater = (maxOldLineNumberLength: number, maxNewLineNumberLength: number) => (oldNumber: number | null, newNumber: number | null) => {
  const oldNumberStr = isNil(oldNumber) ? ' ' : String(oldNumber)
  const newNumberStr = isNil(newNumber) ? ' ' : String(newNumber)

  const oldN = oldNumberStr.padEnd(maxOldLineNumberLength, ' ')
  const newN = newNumberStr.padEnd(maxNewLineNumberLength, ' ')

  return `${oldN}|${newN} `
}

type LineFormater = (oldNumber: number | null, newNumber: number | null, tag: string, str: string, fold?: boolean) => string
const createLineFormater = (maxOldLineNumber: number, maxNewLineNumber: number): LineFormater => {
  const maxOldLineNumberLength = String(maxOldLineNumber).length
  const maxNewLineNumberLength = String(maxNewLineNumber).length
  const formatLineNumber = createLineNumberFormater(maxOldLineNumberLength, maxNewLineNumberLength)

  return (oldNumber, newNumber, tag, str, fold) => {
    let lines = str.match(/((.*\n)|(.+$))/g) || []

    lines = lines
      .map((line, i) => {
        const oldNumberWithOffset = oldNumber && oldNumber + i
        const newNumberWithOffset = newNumber && newNumber + i
        const lineNumber = formatLineNumber(oldNumberWithOffset, newNumberWithOffset)
        return `${lineNumber} ${tag} ${line.replace(/(\n$)/, '')}\n`
      })

    if (fold && lines.length > 2) {
      const dot = '...\n'.padStart(maxOldLineNumberLength + 3, ' ')
      lines.splice(1, lines.length - 2, dot)
    }

    return lines.join('')
  }
}

type EndLineValidater = (i: number) => boolean
const createEndLineValider = (diffPairs: Change[]): EndLineValidater => {
  const index = [...diffPairs].reverse().findIndex(item => !item.added && !item.removed)
  const count = diffPairs.length - 1
  const lastSamePairIndex = index >= 0 ? count - index : index

  return i => {
    if (lastSamePairIndex < i) return true
    else if (lastSamePairIndex === diffPairs.length - 1 && lastSamePairIndex === i) return true
    return false
  }
}


interface ShowDiffOptions {
  fold?: boolean
}

export default function showDiff(
  filename: string,
  oldContent: string,
  newContent: string,
  options: ShowDiffOptions = {}
): string {
  let str = ''
  let oldLineNumber = 1
  let newLineNumber = 1
  const maxOldLineNumber = oldContent.split('\n').length
  const maxNewLineNumber = oldContent.split('\n').length
  const formatLine = createLineFormater(maxOldLineNumber, maxNewLineNumber)

  const diffPairs = diffLines(oldContent, newContent)
  const isEndLine = createEndLineValider(diffPairs)


  diffPairs.forEach(({ added, removed, value }, i) => {
    const needFillEndLine = isEndLine(i)

    const inc = value.split('\n').length - 1

    if (added) {
      const strWithoutColor = formatLine(null, newLineNumber, '+', value)

      str += chalk.green(strWithoutColor)
      newLineNumber += inc
    } else if (removed) {
      const strWithoutColor = formatLine(oldLineNumber, null, '-', value)

      str += chalk.red(strWithoutColor)
      oldLineNumber += inc
    } else {
      const strWithoutColor = formatLine(oldLineNumber, newLineNumber, ' ', value, options.fold)
      str += chalk.grey(strWithoutColor)

      newLineNumber += inc
      oldLineNumber += inc
    }

    /**
     * Add an empty line,
     * if '\n' at the end of file.
     * So, It's easy to tell if the last line end with '\n'
     */
    if (needFillEndLine && /\n$/.test(value)) {
      if (added) {
        const strWithoutColor = formatLine(null, newLineNumber, '+', '\n')
        str += chalk.green(strWithoutColor)
        newLineNumber += 1
      } else if (removed) {
        const strWithoutColor = formatLine(oldLineNumber, null, '-', '\n')
        str += chalk.red(strWithoutColor)
        oldLineNumber += 1
      } else {
        const strWithoutColor = formatLine(oldLineNumber, newLineNumber, ' ', '\n')
        str += chalk.grey(strWithoutColor)
        newLineNumber += 1
        oldLineNumber += 1
      }
    }
  })

  const headerLength = filename.length + 4

  const header = chalk.yellow([
    Array(headerLength).fill('=').join(''),
    `  ${filename}  `,
    Array(headerLength).fill('-').join(''),
  ].join('\n'))
  const footer = chalk.yellow(Array(headerLength).fill('=').join(''))

  return ['\n', header, str, footer].join('\n')
}
