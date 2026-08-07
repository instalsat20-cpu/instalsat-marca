## instalsat-marca

Next.js 15 + TypeScript + Tailwind CSS + Framer Motion, com Prisma (PostgreSQL), NextAuth e bcryptjs.

### Setup

```bash
npm install
cp .env.local.example .env.local # preencha DATABASE_URL, NEXTAUTH_SECRET, NEXTAUTH_URL
npx prisma generate
npm run dev
```

O servidor de desenvolvimento roda em [http://localhost:3001](http://localhost:3001).
