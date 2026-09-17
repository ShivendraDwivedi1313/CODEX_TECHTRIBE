# CODEX TECHTRIBE

CODEX TECHTRIBE is a full-stack developer community and coding platform built using Next.js, TypeScript, Prisma, and PostgreSQL.

The platform combines developer networking, communities, coding statistics, programming problems, and code submission into one application.

## Features

* User authentication using Credentials, GitHub, and Google.
* Developer profiles with coding statistics from LeetCode, Codeforces, and CodeChef.
* Social feed for sharing posts and coding-related updates.
* Communities with members and channels for topic-based discussions.
* Chat and conversation functionality.
* Programming questions and submissions.
* Leaderboard based on coding-related statistics.
* Online judge for compiling and executing submitted code.
* Support for executing C++, Python, and JavaScript code.

## Tech Stack

* Next.js (App Router)
* TypeScript
* React
* Tailwind CSS
* PostgreSQL
* Prisma ORM
* NextAuth.js
* Puppeteer and Cheerio
* Node.js child processes for code execution

## Project Structure

```text
app/
├── api/
│   ├── auth/
│   ├── chat/
│   ├── judge/
│   ├── leaderboard/
│   ├── profile/
│   └── questions/
├── chat/
├── community/
├── dashboard/
└── page.tsx

components/
├── community/
├── leaderboard/
├── posts/
├── profile/
└── questions/

lib/
├── services/
│   ├── codechef.ts
│   ├── codeforces.ts
│   ├── judgeService.ts
│   └── leetcode.ts
├── auth.ts
└── prisma.ts

prisma/
├── schema.prisma
└── seed.ts
```

## Online Judge

The platform includes a custom code execution service.

When a user submits code:

1. The API receives the source code and selected language.
2. A temporary directory is created for the submission.
3. The source code is written to a file.
4. Compiled languages such as C++ are compiled.
5. The program is executed with a timeout.
6. Standard output, errors, and exit status are captured.
7. The execution result is returned to the frontend.
8. Temporary files are cleaned up.

The judge functionality is implemented in:

```text
lib/services/judgeService.ts
```

## Database

PostgreSQL is used as the primary database, with Prisma handling database access and relationships.

The schema includes models for:

* Users
* Communities
* Community members
* Community channels
* Questions
* Submissions
* Conversations
* Chat code sessions

The relational structure allows users to participate in communities, create submissions, maintain profiles, and interact with other developers.

## External Coding Platform Integration

The application fetches coding statistics from external platforms using dedicated service modules.

```text
lib/services/leetcode.ts
lib/services/codeforces.ts
lib/services/codechef.ts
```

These services process external data and make it available for user profiles and leaderboards.

## Architecture

```text
Next.js Frontend
       |
       v
Next.js API Routes
       |
       v
Service Layer
       |
       ├── Prisma → PostgreSQL
       ├── External Coding Platforms
       └── Judge Service → Code Execution
```

The service-layer approach keeps business logic separate from API routes and makes individual features easier to maintain.

## Getting Started

### Clone the repository

```bash
git clone https://github.com/ShivendraDwivedi1313/CODEX_TECHTRIBE.git
cd CODEX_TECHTRIBE
```

### Install dependencies

```bash
npm install
```

### Configure environment variables

Create a `.env` file and add the required database and authentication configuration.

```env
DATABASE_URL="postgresql://username:password@localhost:5432/database_name"
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run the development server

```bash
npm run dev
```

The application runs locally at:

```text
http://localhost:3000
```

## Future Improvements

* Move code execution to isolated containers.
* Add a queue-based judge worker system.
* Add hidden test cases and memory limits.
* Improve caching for external coding statistics.
* Expand real-time communication features.
* Add more programming languages to the judge.

## Repository

[GitHub Repository](https://github.com/ShivendraDwivedi1313/CODEX_TECHTRIBE)
