# Hisaab 🧾

**Hisaab** is a smart and minimalistic transaction tracking app built to help users manage personal finances with clarity. It supports logging normal, lending, and borrowing transactions while calculating your net balance dynamically.

🔗 **Live App**: [https://hisaab-sigma.vercel.app](https://hisaab-sigma.vercel.app)

---

## ✨ Features

- 📋 **Transaction Logging** – Add transactions under three types: normal, lending, and borrowing.
- 💰 **Net Balance Calculation** – Get real-time updates of your balance owed or due.
- 🧾 **Categorized Ledger** – All transactions are tagged and sorted.
- 🔐 **Authentication** – Secure sign-in with JWT-based auth.
- 🗂 **Persistent Storage** – Data stored securely in a database via Prisma ORM.
- 💡 **Simple UI** – Clean and responsive design for fast interaction.

---

## 🔐 Tech Stack

| Layer        | Tech Used                          |
|--------------|------------------------------------|
| Frontend     | Next.js, React, Tailwind CSS       |
| Backend      | Node.js (API routes in Next.js)    |
| Auth         | JSON Web Tokens (JWT)              |
| Database ORM | Prisma                             |
| Deployment   | Vercel                             |
| Icons        | Lucide React                       |

---

## 🛠️ Setup & Installation (for developers)

```bash
# Clone the repository
git clone https://github.com/your-username/hisaab.git
cd hisaab

# Install dependencies
npm install

# Create and configure the environment variables
cp .env.example .env

# Push Prisma schema to your database
npx prisma migrate dev

# Run the development server
npm run dev