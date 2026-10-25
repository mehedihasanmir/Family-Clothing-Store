# MIR — Family Clothing Store

A bilingual (Bangla + English) e-commerce storefront for **men, women, and kids** clothing, built for the Bangladeshi market: guest checkout, Cash on Delivery, local delivery fees, and festival collections (Eid, Pohela Boishakh, wedding, Puja).

This is a **learning + MVP** project: one Next.js app that covers frontend, API routes, and a database — a practical first full-stack stack, not a 10k-concurrent production architecture.

## Stack

| Layer | Choice |
|---|---|
| Frontend | Next.js 15 (App Router), React 19, TypeScript |
| Styling | Tailwind CSS 4 |
| Database | SQLite (local) via Prisma — swap to PostgreSQL when deploying |
| Payments | Cash on Delivery + SSLCommerz (bKash / Nagad / Rocket / cards) when credentials are set |
| SMS | BulkSMSBD (optional) |
| Ads | Facebook Pixel (optional) |

## Features

- Product catalog with filters: category, product type, occasion, size, color, price, search, sort
- Cart, guest checkout, COD, transparent delivery fees (Dhaka vs outside)
- Admin page at `/admin` to view orders and update status
- Bangla / English UI toggle
- WhatsApp chat button
- SEO: sitemap, robots.txt, Product JSON-LD

## Project layout (the files you actually edit)

```
prisma/data/products.mjs   # add / edit / remove products
src/lib/config.ts          # store name, phone, WhatsApp, delivery fees
src/lib/catalog.ts         # product types and occasions
src/lib/i18n.ts            # Bangla + English UI text
public/products/           # product images
.env                       # secrets (never commit this)
```

## Local setup

**Need:** Node.js 20+ (LTS).

```bash
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

- Storefront: `/`
- Admin: `/admin` (password from `.env` → `ADMIN_PASSWORD`)

Copy `.env.example` to `.env` before running.

## Add a product

1. Put an image in `public/products/` (for example `my-shirt.jpg`).
2. Copy a block in `prisma/data/products.mjs` and change the fields (`slug` must be unique).
3. Run:

```bash
npm run db:seed
```

Orders are not deleted. Products still used in old orders are kept even if you remove them from the list.

## Environment variables

See `.env.example`. Online payment, SMS, and Facebook Pixel stay off until you fill those keys.

## Deploy notes (later)

- Host the Next.js app on Vercel.
- Replace SQLite with managed PostgreSQL (`DATABASE_URL`).
- Put Cloudflare in front for Bangladesh latency.
- Change `ADMIN_PASSWORD` and `NEXT_PUBLIC_BASE_URL` before going live.

## License

Personal / learning project.
