# Nest Excel Stream Example

This project demonstrates how to implement efficient data streaming from a PostgreSQL database using Prisma ORM and NestJS, exporting large datasets directly to Excel files via HTTP streaming.

## Why?

Streaming large datasets is a challenge in many web frameworks and ORMs, as most do not provide native support for true data streaming (Prisma included). This repository shows a practical workaround using batch pagination and ExcelJS's streaming writer, allowing you to generate and download huge Excel files without overloading your server's memory.

## Features

- **NestJS** backend with Prisma ORM
- **PostgreSQL** as the database
- **ExcelJS** for streaming Excel file generation
- **Frontend** (Next.js/React) for triggering and downloading the Excel file in real time
- **Docker Compose** for easy database setup

## How it works

- The backend paginates through the database in batches (using Prisma), writing each batch to the Excel file as it is streamed to the client.
- The frontend downloads the file as it is being generated, showing progress in real time.

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/your-username/nest-excel-stream.git
cd nest-excel-stream
```

### 2. Start PostgreSQL with Docker Compose

```bash
docker-compose up -d
```

### 3. Configure Prisma

Set your `DATABASE_URL` in `.env` (see `docker-compose.yml` for credentials), then run:

```bash
npx prisma migrate dev
npx prisma generate
```

### 4. Seed the database (optional)

```bash
npx ts-node backend/prisma/populate/posts.ts
```

Or using bun:

```bash
bun backend/prisma/populate/posts.ts
```

### 5. Start the backend

```bash
cd backend
npm install
npm run start:dev
```

### 6. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

## Usage

- Open the frontend at [http://localhost:3000](http://localhost:3000)
- Click the "Gerar Excel" button to download a large Excel file streamed from the backend

## Notes

- This approach uses batch pagination (not native DB cursors) due to Prisma limitations.
- The backend never loads the entire dataset into memory.
- The Excel file is streamed to the client as it is generated.
