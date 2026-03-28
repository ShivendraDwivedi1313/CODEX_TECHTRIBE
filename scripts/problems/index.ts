// Problem definitions for seeding - 25 DSA problems
export interface ProblemDef {
  title: string; slug: string; difficulty: 'EASY' | 'MEDIUM' | 'HARD'
  tags: string[]; statement: string; inputFormat: string; outputFormat: string
  constraints: string; explanation?: string
  visibleSamples: { input: string; output: string; explanation?: string }[]
  hiddenTestCases: { input: string; expectedOutput: string }[]
  starterCode: { cpp: string; python: string; javascript: string }
  referenceSolution: { cpp: string; python: string; javascript: string }
  timeLimit?: number; memoryLimit?: number
}

export { easyProblems } from './easy'
export { mediumProblems } from './medium'
export { hardProblems } from './hard'
