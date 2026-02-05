import { Pool } from "pg";
import type { Product } from "./types";

let pool: Pool;

const getPool = (): Pool => {
  if (!pool) {
    if (!process.env.DATABASE_URL) {
      throw new Error("Database connection string not defined");
    }

    let connectionString = process.env.DATABASE_URL;

    if (connectionString.includes("sslmode=")) {
      const url = new URL(connectionString);
      url.searchParams.delete("sslmode");
      connectionString = url.toString();
    }

    const sslConfig = {
      rejectUnauthorized: process.env.NODE_ENV === "production",
    };

    pool = new Pool({
      connectionString,
      ssl: sslConfig,
    });
  }
  return pool;
};

export const getProducts = async (options: {
  query?: string;
  page?: number;
  limit?: number;
}): Promise<{ products: Product[]; totalResults: number; totalPages: number }> => {
  const { query, page = 1, limit = 12 } = options;

  const client = await getPool().connect();

  try {
    const queryParams: (string | number)[] = [];
    let whereClause = "";
    let paramIndex = 1;

    if (query && query.trim() !== "") {
      whereClause = `WHERE title ILIKE $${paramIndex++}`;
      queryParams.push(`%${query}%`);
    }

    const countQuery = `SELECT COUNT(*) FROM products ${whereClause}`;
    const countResult = await client.query(
      countQuery,
      query ? [queryParams[0]] : [],
    );
    const totalResults = parseInt(countResult.rows[0].count, 10);
    const totalPages = Math.ceil(totalResults / limit);

    const offset = (page - 1) * limit;

    const productsQuery = `
            SELECT id, title, price, image_url, product_url, stock_status
            FROM products
            ${whereClause}
            ORDER BY id ASC
            LIMIT $${paramIndex++} OFFSET $${paramIndex++}
        `;

    queryParams.push(limit, offset);

    const productsResult = await client.query(productsQuery, queryParams);

    const products: Product[] = productsResult.rows.map((row) => ({
      id: row.id.toString(),
      title: row.title,
      price: parseFloat(row.price),
      imageUrl: row.image_url,
      productUrl: row.product_url,
      stockStatus: row.stock_status,
    }));

    return { products, totalResults, totalPages };
  } catch (error) {
    console.error("Database error: ", error);
    throw new Error("Failed to fetch products from the database");
  } finally {
    client.release();
  }
};
