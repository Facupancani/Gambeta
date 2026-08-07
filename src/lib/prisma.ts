import { PrismaClient } from "@/generated/prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

/**
 * Prisma Client singleton.
 *
 * Prisma 7 requires an explicit driver adapter at runtime (no more inline
 * `url = env("DATABASE_URL")` in schema.prisma). We use `@prisma/adapter-mariadb`,
 * which speaks the MySQL/MariaDB wire protocol — this is what lets us connect to
 * TiDB Serverless (our free, MySQL-compatible database) with a plain connection string.
 *
 * TiDB Serverless requires TLS, and the adapter's `ssl` option only lives on the
 * pool config object (not the second "PrismaMariadbOptions" arg), so we parse
 * DATABASE_URL ourselves instead of passing the raw string straight through.
 *
 * We cache the client on `globalThis` in development so Next.js Fast Refresh
 * doesn't spawn a new connection pool on every file save.
 *
 * NOTE: once real TiDB credentials are wired up (Day 1 setup), verify this
 * actually connects — if TiDB rejects the default `ssl: true`, try
 * `ssl: { rejectUnauthorized: true }` or check TiDB Cloud's connection docs
 * for anything MariaDB-driver-specific.
 */

function buildPoolConfig(databaseUrl: string | undefined) {
  if (!databaseUrl) {
    // Empty pool config: fails loudly on first query instead of at import
    // time, so `next build` doesn't crash before .env is filled in.
    return {};
  }

  const url = new URL(databaseUrl);
  return {
    host: url.hostname,
    port: url.port ? Number(url.port) : 3306,
    user: decodeURIComponent(url.username),
    password: decodeURIComponent(url.password),
    database: url.pathname.replace(/^\//, ""),
    connectionLimit: 5,
    ssl: true as const,
  };
}

const adapter = new PrismaMariaDb(buildPoolConfig(process.env.DATABASE_URL));

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
