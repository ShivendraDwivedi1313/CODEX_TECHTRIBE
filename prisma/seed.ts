import 'dotenv/config'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Clean existing data
  await prisma.channelMessage.deleteMany()
  await prisma.communityChannel.deleteMany()
  await prisma.communityMember.deleteMany()
  await prisma.community.deleteMany()
  await prisma.notification.deleteMany()
  await prisma.message.deleteMany()
  await prisma.like.deleteMany()
  await prisma.comment.deleteMany()
  await prisma.post.deleteMany()
  await prisma.follow.deleteMany()
  await prisma.codeforcesStat.deleteMany()
  await prisma.codechefStat.deleteMany()
  await prisma.leetcodeStat.deleteMany()
  await prisma.project.deleteMany()
  await prisma.profile.deleteMany()
  await prisma.user.deleteMany()

  const password = await bcrypt.hash('password123', 12)

  // ─── USERS ──────────────────────────────────────────
  const ishant = await prisma.user.create({
    data: {
      name: 'Ishant Sharma',
      email: 'ishant@techtribe.com',
      password,
      points: 8450,
      profile: {
        create: {
          bio: 'Full-stack developer passionate about open-source, competitive programming, and building delightful UIs.',
          headline: 'Full-Stack Developer',
          avatarUrl: 'https://picsum.photos/seed/avatar42/200/200',
          skills: ['TypeScript', 'React', 'Node.js', 'Prisma', 'PostgreSQL'],
          interests: ['Open Source', 'Competitive Programming', 'System Design'],
          college: 'IIT Delhi',
          location: 'New Delhi, India',
          githubUrl: 'https://github.com/ishant',
        },
      },
    },
  })

  const aarav = await prisma.user.create({
    data: {
      name: 'Aarav Patel',
      email: 'aarav@techtribe.com',
      password,
      points: 4210,
      profile: {
        create: {
          bio: 'Competitive programmer and math enthusiast.',
          avatarUrl: 'https://picsum.photos/seed/lb1/200/200',
          skills: ['C++', 'Python', 'Algorithms'],
        },
      },
    },
  })

  const sara = await prisma.user.create({
    data: {
      name: 'Sara Chen',
      email: 'sara@techtribe.com',
      password,
      points: 3985,
      profile: {
        create: {
          bio: 'AI/ML researcher and writer.',
          avatarUrl: 'https://picsum.photos/seed/lb2/200/200',
          skills: ['Python', 'PyTorch', 'TensorFlow'],
        },
      },
    },
  })

  const marcus = await prisma.user.create({
    data: {
      name: 'Marcus Johnson',
      email: 'marcus@techtribe.com',
      password,
      points: 3870,
      profile: {
        create: {
          bio: 'Backend wizard. Go, Rust, and distributed systems.',
          avatarUrl: 'https://picsum.photos/seed/lb3/200/200',
          skills: ['Go', 'Rust', 'Kubernetes'],
        },
      },
    },
  })

  const priya = await prisma.user.create({
    data: {
      name: 'Priya Sharma',
      email: 'priya@techtribe.com',
      password,
      points: 3640,
      profile: {
        create: {
          bio: 'Frontend developer and design enthusiast.',
          avatarUrl: 'https://picsum.photos/seed/lb4/200/200',
          skills: ['React', 'CSS', 'Figma'],
        },
      },
    },
  })

  // ─── FOLLOWS ────────────────────────────────────────
  await prisma.follow.createMany({
    data: [
      { followerId: ishant.id, followingId: aarav.id, status: 'ACCEPTED' },
      { followerId: ishant.id, followingId: sara.id, status: 'ACCEPTED' },
      { followerId: ishant.id, followingId: marcus.id, status: 'ACCEPTED' },
      { followerId: aarav.id, followingId: ishant.id, status: 'ACCEPTED' },
      { followerId: sara.id, followingId: ishant.id, status: 'ACCEPTED' },
      { followerId: priya.id, followingId: ishant.id, status: 'ACCEPTED' },
    ],
  })

  // ─── CODING STATS ──────────────────────────────────
  await prisma.leetcodeStat.create({
    data: {
      userId: ishant.id, handle: 'ishant_coder', solvedQuestions: 245,
      contests: 45, points: 2450, rank: 'Guardian',
    },
  })
  await prisma.codechefStat.create({
    data: {
      userId: ishant.id, handle: 'ishant_chef', solvedQuestions: 132,
      contests: 32, currentRating: 1850, maxRating: 1920, rank: '4-Star', points: 3000,
    },
  })
  await prisma.codeforcesStat.create({
    data: {
      userId: ishant.id, handle: 'ishant_cf', solvedQuestions: 110,
      contests: 77, currentRating: 1420, maxRating: 1550, rank: 'Specialist', points: 3000,
    },
  })

  await prisma.leetcodeStat.create({
    data: {
      userId: aarav.id, handle: 'aarav_lc', solvedQuestions: 892,
      contests: 120, points: 4210, rank: 'Guardian', currentRating: 2340, maxRating: 2340,
    },
  })

  await prisma.codeforcesStat.create({
    data: {
      userId: sara.id, handle: 'sara_cf', solvedQuestions: 510,
      contests: 85, currentRating: 2290, maxRating: 2290, rank: 'Expert', points: 3985,
    },
  })

  // ─── POSTS ──────────────────────────────────────────
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        authorId: ishant.id,
        title: 'Building Scalable Systems with Microservices',
        content: 'Explore how microservices architecture enables teams to build, deploy, and scale individual services independently, resulting in more resilient and maintainable systems.',
        imageUrl: 'https://picsum.photos/seed/tech1/800/450',
      },
    }),
    prisma.post.create({
      data: {
        authorId: sara.id,
        title: 'The Art of Minimal UI Design',
        content: 'Minimalism in UI design is not about removing features — it is about reducing cognitive load and guiding users to what matters most. Discover the principles that drive great minimal design.',
        imageUrl: 'https://picsum.photos/seed/design2/800/450',
      },
    }),
    prisma.post.create({
      data: {
        authorId: aarav.id,
        title: 'TypeScript Generics: A Deep Dive',
        content: "Generics are one of TypeScript's most powerful features. Learn how to use them to write flexible, reusable, and type-safe code that scales with your application.",
        imageUrl: 'https://picsum.photos/seed/code3/800/450',
      },
    }),
    prisma.post.create({
      data: {
        authorId: marcus.id,
        title: 'AI-Powered Code Reviews: The Future?',
        content: 'AI tools are now capable of reviewing pull requests, detecting bugs, and suggesting improvements. We explore whether they complement or replace traditional peer review workflows.',
        imageUrl: 'https://picsum.photos/seed/ai4/800/450',
      },
    }),
    prisma.post.create({
      data: {
        authorId: priya.id,
        title: 'Edge Computing vs Cloud: Choosing the Right Architecture',
        content: "With the rise of IoT and real-time applications, edge computing is challenging the dominance of centralized cloud infrastructure. Here's how to decide which model suits your use case.",
        imageUrl: 'https://picsum.photos/seed/cloud5/800/450',
      },
    }),
    prisma.post.create({
      data: {
        authorId: ishant.id,
        title: 'Open Source Sustainability in 2025',
        content: 'Thousands of critical projects run on volunteer work. Explore how the open source ecosystem is evolving funding models, governance, and contributor incentives to ensure long-term health.',
        imageUrl: 'https://picsum.photos/seed/open6/800/450',
      },
    }),
  ])

  // ─── LIKES ──────────────────────────────────────────
  await prisma.like.createMany({
    data: [
      { postId: posts[0].id, userId: aarav.id },
      { postId: posts[0].id, userId: sara.id },
      { postId: posts[0].id, userId: marcus.id },
      { postId: posts[1].id, userId: ishant.id },
      { postId: posts[1].id, userId: priya.id },
      { postId: posts[2].id, userId: ishant.id },
      { postId: posts[2].id, userId: sara.id },
      { postId: posts[2].id, userId: marcus.id },
      { postId: posts[3].id, userId: ishant.id },
      { postId: posts[4].id, userId: aarav.id },
    ],
  })

  // ─── COMMENTS ───────────────────────────────────────
  await prisma.comment.createMany({
    data: [
      { postId: posts[0].id, authorId: aarav.id, content: 'Great insights on microservices! Love the scalability patterns.' },
      { postId: posts[0].id, authorId: sara.id, content: 'This is exactly what our team needed.' },
      { postId: posts[2].id, authorId: ishant.id, content: 'Generics changed the way I code in TypeScript.' },
      { postId: posts[3].id, authorId: priya.id, content: 'AI code reviews are the future! Thanks for sharing.' },
    ],
  })

  // ─── COMMUNITIES ────────────────────────────────────
  const devCommunity = await prisma.community.create({
    data: {
      name: 'Dev',
      description: 'General software development discussions',
      creatorId: ishant.id,
      members: {
        createMany: {
          data: [
            { userId: ishant.id, role: 'OWNER' },
            { userId: aarav.id },
            { userId: sara.id },
            { userId: marcus.id },
            { userId: priya.id },
          ],
        },
      },
    },
  })

  const cpCommunity = await prisma.community.create({
    data: {
      name: 'CP / DSA',
      description: 'Competitive programming and data structures',
      creatorId: aarav.id,
      members: {
        createMany: {
          data: [
            { userId: aarav.id, role: 'OWNER' },
            { userId: ishant.id },
            { userId: sara.id },
          ],
        },
      },
    },
  })

  const aiCommunity = await prisma.community.create({
    data: {
      name: 'AI / ML',
      description: 'Artificial intelligence and machine learning',
      creatorId: sara.id,
      members: {
        createMany: {
          data: [
            { userId: sara.id, role: 'OWNER' },
            { userId: ishant.id },
            { userId: marcus.id },
          ],
        },
      },
    },
  })

  // ─── CHANNELS ───────────────────────────────────────
  const generalCh = await prisma.communityChannel.create({ data: { communityId: devCommunity.id, name: 'general', logo: '💬' } })
  await prisma.communityChannel.create({ data: { communityId: devCommunity.id, name: 'react-help', logo: '⚛️' } })
  await prisma.communityChannel.create({ data: { communityId: devCommunity.id, name: 'backend-lounge', logo: '🖥️' } })

  const leetcodeCh = await prisma.communityChannel.create({ data: { communityId: cpCommunity.id, name: 'leetcode-daily', logo: '🧩' } })
  await prisma.communityChannel.create({ data: { communityId: cpCommunity.id, name: 'codeforces-div2', logo: '🏆' } })
  await prisma.communityChannel.create({ data: { communityId: cpCommunity.id, name: 'dp-patterns', logo: '📐' } })

  await prisma.communityChannel.create({ data: { communityId: aiCommunity.id, name: 'llm-research', logo: '🤖' } })
  await prisma.communityChannel.create({ data: { communityId: aiCommunity.id, name: 'ml-papers', logo: '📄' } })
  await prisma.communityChannel.create({ data: { communityId: aiCommunity.id, name: 'pytorch-gang', logo: '🔥' } })

  // ─── CHANNEL MESSAGES ───────────────────────────────
  await prisma.channelMessage.createMany({
    data: [
      { channelId: generalCh.id, userId: ishant.id, userName: 'Ishant Sharma', content: 'Hey everyone! Welcome to the Dev community 🎉' },
      { channelId: generalCh.id, userId: aarav.id, userName: 'Aarav Patel', content: 'Glad to be here! Anyone working on Next.js projects?' },
      { channelId: generalCh.id, userId: sara.id, userName: 'Sara Chen', content: 'Just deployed my first app with Prisma. It was smooth!' },
      { channelId: leetcodeCh.id, userId: aarav.id, userName: 'Aarav Patel', content: 'Today\'s daily: Two Sum II. Easy one!' },
      { channelId: leetcodeCh.id, userId: ishant.id, userName: 'Ishant Sharma', content: 'Done! Two-pointer approach works perfectly.' },
    ],
  })

  console.log('✅ Seed completed successfully!')
  console.log(`   Created 5 users (password: password123)`)
  console.log(`   Login: ishant@techtribe.com / password123`)
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
