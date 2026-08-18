import fs from 'fs/promises'
import path from 'path'
import { describe, it, expect } from 'vitest'

const __dirname = import.meta.dirname;

const lengths = [4, 5, 6, 7, 8, 9]

function parseLines(raw) {
  return raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean)
}

describe('wordlists', () => {
  it.each(lengths)(`%d: guesses sorted and solutions included`, async (n) => {
  
    const base = path.resolve(__dirname, '..', 'public', 'words', String(n))
    const guessesPath = path.join(base, 'guesses.txt')
    const solutionsPath = path.join(base, 'solutions.txt')

    const [guessesRaw, solutionsRaw] = await Promise.all([
      fs.readFile(guessesPath, 'utf8'),
      fs.readFile(solutionsPath, 'utf8'),
    ])

    const guesses = parseLines(guessesRaw)
    const solutions = parseLines(solutionsRaw)

    const sorted = [...guesses].sort((a, b) => a.localeCompare(b))
    expect(guesses).toEqual(sorted)

    const guessSet = new Set(guesses)
    const missing = solutions.filter(s => !guessSet.has(s))
    expect(missing).toEqual([])
  })
})
