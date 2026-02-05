import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();
const sql = neon(process.env.DATABASE_URL);

const createTable = async () => {
  await sql`
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            title TEXT NOT NULL,
            price NUMERIC NOT NULL,
            currency TEXT NOT NULL,
            image_url TEXT NOT NULL,
            product_url TEXT NOT NULL UNIQUE,
            stock_status TEXT NOT NULL
        );
    `;

  console.log("Table is ready...");
};

const seed = async () => {
  try {
    await createTable();

    const raw = fs.readFileSync("./products.json", "utf-8");
    const products = JSON.parse(raw);

    console.log(`Seeding ${products.length} products...`);

    let addedCount = 0;
    for (const p of products) {
      await sql`
        INSERT INTO products 
        (title, price, currency, image_url, product_url, stock_status)
        VALUES
        (${p.title}, ${p.price}, ${p.currency}, ${p.imageUrl}, ${p.productUrl}, ${p.stockStatus})
        ON CONFLICT (product_url) DO NOTHING
      `;
      addedCount++;
      console.log(`Added ${addedCount} products`);
    }

    console.log("Seed complete...");
    process.exit(0);
  } catch (error) {
    console.error("Failed seed to db: ", error);
    process.exit(1);
  }
};

seed();
