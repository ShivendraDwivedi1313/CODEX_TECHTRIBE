import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import { easyProblems, mediumProblems, hardProblems } from './problems'

const prisma = new PrismaClient()

async function main() {
  console.log('🧩 Seeding coding questions...')

  const allProblems = [...easyProblems, ...mediumProblems, ...hardProblems]
  let created = 0
  let updated = 0

  for (const p of allProblems) {
    const existing = await prisma.question.findUnique({ where: { slug: p.slug } })

    if (existing) {
      await prisma.question.update({
        where: { slug: p.slug },
        data: {
          title: p.title,
          difficulty: p.difficulty,
          tags: p.tags,
          statement: p.statement,
          inputFormat: p.inputFormat,
          outputFormat: p.outputFormat,
          constraints: p.constraints,
          explanation: p.explanation || null,
          visibleSamples: p.visibleSamples as any,
          hiddenTestCases: p.hiddenTestCases as any,
          starterCode: p.starterCode as any,
          referenceSolution: p.referenceSolution as any,
          timeLimit: p.timeLimit || 2000,
          memoryLimit: p.memoryLimit || 256,
        },
      })
      updated++
    } else {
      await prisma.question.create({
        data: {
          title: p.title,
          slug: p.slug,
          difficulty: p.difficulty,
          tags: p.tags,
          statement: p.statement,
          inputFormat: p.inputFormat,
          outputFormat: p.outputFormat,
          constraints: p.constraints,
          explanation: p.explanation || null,
          visibleSamples: p.visibleSamples as any,
          hiddenTestCases: p.hiddenTestCases as any,
          starterCode: p.starterCode as any,
          referenceSolution: p.referenceSolution as any,
          timeLimit: p.timeLimit || 2000,
          memoryLimit: p.memoryLimit || 256,
        },
      })
      created++
    }
  }

  console.log(`✅ Seeding complete: ${created} created, ${updated} updated`)
  console.log(`   Total questions: ${allProblems.length}`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
