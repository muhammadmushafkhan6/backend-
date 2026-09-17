import pg from 'pg';
import dotenv from 'dotenv';
import crypto from 'crypto';
import { INITIAL_DATA } from './data/initialData.js';

dotenv.config();

// ─── Cryptographic Password Hashing & Verification ───────────────────────────
export function hashPassword(password, salt = null) {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, s, 64).toString('hex');
  return { salt: s, hash };
}

export function verifyPassword(password, salt, storedHash) {
  try {
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
  } catch {
    return false;
  }
}

const { Pool } = pg;

export const pool = new Pool({
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'BSSE2280127',
  host: process.env.PGHOST || 'localhost',
  port: parseInt(process.env.PGPORT || '5432', 10),
  database: process.env.PGDATABASE || 'singhardb',
  max: 20,
  idleTimeoutMillis: 30000,
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

// ─── Initialize Database & Tables ─────────────────────────────────────────────
export async function initDB() {
  const client = await pool.connect();
  try {
    // 1. Products Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id BIGINT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        code VARCHAR(50),
        category VARCHAR(100),
        category_label VARCHAR(100),
        price NUMERIC(12, 2) NOT NULL,
        original_price NUMERIC(12, 2),
        rating NUMERIC(3, 1) DEFAULT 5.0,
        reviews_count INT DEFAULT 0,
        image TEXT,
        images JSONB DEFAULT '[]'::jsonb,
        hover_image TEXT,
        badge VARCHAR(100),
        tab VARCHAR(100) DEFAULT 'new-arrivals',
        description TEXT,
        sizes JSONB DEFAULT '[]'::jsonb,
        colors JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 2. Orders Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS orders (
        id VARCHAR(100) PRIMARY KEY,
        date VARCHAR(50),
        status VARCHAR(50) DEFAULT 'Pending',
        customer_name VARCHAR(255),
        customer_email VARCHAR(255),
        customer_phone VARCHAR(100),
        total NUMERIC(12, 2) DEFAULT 0,
        items JSONB DEFAULT '[]'::jsonb,
        address TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 3. Inquiries Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id VARCHAR(100) PRIMARY KEY,
        date VARCHAR(100),
        status VARCHAR(50) DEFAULT 'Unread',
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        inquiry_type VARCHAR(255),
        message TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // 4. Settings Table
    await client.query(`
      CREATE TABLE IF NOT EXISTS settings (
        id VARCHAR(50) PRIMARY KEY,
        data JSONB NOT NULL
      );
    `);

    // 5. Admin Users Table (Cryptographic Real Authentication)
    await client.query(`
      CREATE TABLE IF NOT EXISTS admin_users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        salt VARCHAR(64) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        last_login TIMESTAMPTZ,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);

    // Seed default administrator if table is empty
    const { rows: adminRows } = await client.query(`SELECT COUNT(*) FROM admin_users;`);
    if (parseInt(adminRows[0].count, 10) === 0) {
      console.log('Seeding initial administrator user into PostgreSQL singhardb...');
      const { salt, hash } = hashPassword('admin123');
      await client.query(
        `INSERT INTO admin_users (username, email, password_hash, salt, role)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (username) DO NOTHING;`,
        ['admin', 'admin@singhar.com', hash, salt, 'admin']
      );
    }

    // 6. Seed initial products if table is empty
    const { rows: prodRows } = await client.query(`SELECT COUNT(*) FROM products;`);
    if (parseInt(prodRows[0].count, 10) === 0 && INITIAL_DATA.products?.length > 0) {
      console.log('Seeding initial products into PostgreSQL singhardb...');
      for (const p of INITIAL_DATA.products) {
        const images = Array.isArray(p.images) && p.images.length > 0
          ? p.images
          : (p.image ? [p.image] : []);

        await client.query(
          `INSERT INTO products (
            id, name, code, category, category_label, price, original_price,
            rating, reviews_count, image, images, hover_image, badge, tab,
            description, sizes, colors
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
          ON CONFLICT (id) DO NOTHING;`,
          [
            p.id || Date.now(),
            p.name,
            p.code || `${p.price}$`,
            p.category || 'necklaces',
            p.categoryLabel || 'Necklaces',
            p.price,
            p.originalPrice || null,
            p.rating || 5.0,
            p.reviewsCount || 0,
            p.image || (images[0] || ''),
            JSON.stringify(images),
            p.hoverImage || p.image || (images[0] || ''),
            p.badge || '✦ HEIRLOOM',
            p.tab || 'new-arrivals',
            p.description || '',
            JSON.stringify(p.sizes || []),
            JSON.stringify(p.colors || []),
          ]
        );
      }
    }

    // 6. Seed initial settings if empty
    const { rows: setRows } = await client.query(`SELECT COUNT(*) FROM settings;`);
    if (parseInt(setRows[0].count, 10) === 0 && INITIAL_DATA.settings) {
      await client.query(
        `INSERT INTO settings (id, data) VALUES ('store_settings', $1) ON CONFLICT (id) DO NOTHING;`,
        [JSON.stringify(INITIAL_DATA.settings)]
      );
    }

    console.log('✦ PostgreSQL (singhardb) tables checked & ready.');
  } catch (err) {
    console.error('Database initialization error:', err);
  } finally {
    client.release();
  }
}

// ─── Helpers to map db rows to JSON models ────────────────────────────────────
function formatProduct(row) {
  if (!row) return null;
  const images = Array.isArray(row.images) ? row.images : [];
  return {
    id: Number(row.id),
    name: row.name,
    code: row.code || `${row.price}$`,
    category: row.category,
    categoryLabel: row.category_label,
    price: Number(row.price),
    originalPrice: row.original_price ? Number(row.original_price) : null,
    rating: Number(row.rating || 5.0),
    reviewsCount: Number(row.reviews_count || 0),
    image: row.image || images[0] || '',
    images: images.length > 0 ? images : (row.image ? [row.image] : []),
    hoverImage: row.hover_image || images[1] || images[0] || row.image || '',
    badge: row.badge,
    tab: row.tab,
    description: row.description || '',
    sizes: Array.isArray(row.sizes) ? row.sizes : [],
    colors: Array.isArray(row.colors) ? row.colors : [],
  };
}

// ─── Product Queries ──────────────────────────────────────────────────────────
export async function dbGetProducts(category, search) {
  let query = `SELECT * FROM products`;
  const params = [];
  const conditions = [];

  if (category && category !== 'all') {
    params.push(category);
    conditions.push(`category = $${params.length}`);
  }

  if (search) {
    params.push(`%${search.toLowerCase()}%`);
    conditions.push(`(LOWER(name) LIKE $${params.length} OR LOWER(category_label) LIKE $${params.length} OR LOWER(description) LIKE $${params.length})`);
  }

  if (conditions.length > 0) {
    query += ` WHERE ` + conditions.join(' AND ');
  }

  query += ` ORDER BY id DESC;`;

  const { rows } = await pool.query(query, params);
  return rows.map(formatProduct);
}

export async function dbGetProductById(id) {
  const { rows } = await pool.query(`SELECT * FROM products WHERE id = $1;`, [id]);
  return rows[0] ? formatProduct(rows[0]) : null;
}

export async function dbCreateProduct(data) {
  const id = data.id || Date.now();
  const images = Array.isArray(data.images) && data.images.length > 0
    ? data.images.slice(0, 4)
    : (data.image ? [data.image] : ['/assets/jewel_emerald_necklace.jpg']);

  const price = Number(data.price);
  const originalPrice = data.originalPrice ? Number(data.originalPrice) : null;
  const category = data.category || 'necklaces';
  const categoryLabel = data.categoryLabel || 'Necklaces';
  const badge = data.badge || '✦ HEIRLOOM';
  const tab = data.tab || 'new-arrivals';
  const description = data.description || '';
  const sizes = Array.isArray(data.sizes) ? data.sizes : (typeof data.sizes === 'string' ? data.sizes.split(',').map(s=>s.trim()).filter(Boolean) : ['Standard']);
  const colors = Array.isArray(data.colors) ? data.colors : (typeof data.colors === 'string' ? data.colors.split(',').map(c=>c.trim()).filter(Boolean) : ['18K Gold']);

  const { rows } = await pool.query(
    `INSERT INTO products (
      id, name, code, category, category_label, price, original_price,
      rating, reviews_count, image, images, hover_image, badge, tab,
      description, sizes, colors
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
    RETURNING *;`,
    [
      id,
      data.name,
      `${price}$`,
      category,
      categoryLabel,
      price,
      originalPrice,
      5.0,
      0,
      images[0],
      JSON.stringify(images),
      images[1] || images[0],
      badge,
      tab,
      description,
      JSON.stringify(sizes.length ? sizes : ['Standard']),
      JSON.stringify(colors),
    ]
  );

  return formatProduct(rows[0]);
}

export async function dbUpdateProduct(id, data) {
  const current = await dbGetProductById(id);
  if (!current) return null;

  let images = current.images;
  if (Array.isArray(data.images) && data.images.length > 0) {
    images = data.images.slice(0, 4);
  } else if (data.image) {
    images = [data.image];
  }

  const name = data.name !== undefined ? data.name : current.name;
  const price = data.price !== undefined ? Number(data.price) : current.price;
  const originalPrice = data.originalPrice !== undefined ? (data.originalPrice ? Number(data.originalPrice) : null) : current.originalPrice;
  const category = data.category !== undefined ? data.category : current.category;
  const categoryLabel = data.categoryLabel !== undefined ? data.categoryLabel : current.categoryLabel;
  const badge = data.badge !== undefined ? data.badge : current.badge;
  const description = data.description !== undefined ? data.description : current.description;
  const sizes = data.sizes !== undefined
    ? (Array.isArray(data.sizes) ? data.sizes : data.sizes.split(',').map(s=>s.trim()).filter(Boolean))
    : current.sizes;
  const colors = data.colors !== undefined
    ? (Array.isArray(data.colors) ? data.colors : data.colors.split(',').map(c=>c.trim()).filter(Boolean))
    : current.colors;

  const { rows } = await pool.query(
    `UPDATE products SET
      name = $1,
      price = $2,
      original_price = $3,
      category = $4,
      category_label = $5,
      badge = $6,
      description = $7,
      sizes = $8,
      colors = $9,
      image = $10,
      images = $11,
      hover_image = $12
    WHERE id = $13
    RETURNING *;`,
    [
      name,
      price,
      originalPrice,
      category,
      categoryLabel,
      badge,
      description,
      JSON.stringify(sizes && sizes.length ? sizes : ['Standard']),
      JSON.stringify(colors),
      images[0] || current.image,
      JSON.stringify(images),
      images[1] || images[0] || current.image,
      id,
    ]
  );

  return formatProduct(rows[0]);
}

export async function dbDeleteProduct(id) {
  const { rows } = await pool.query(`DELETE FROM products WHERE id = $1 RETURNING *;`, [id]);
  return rows[0] ? formatProduct(rows[0]) : null;
}

// ─── Orders Queries ───────────────────────────────────────────────────────────
export async function dbGetOrders() {
  const { rows } = await pool.query(`SELECT * FROM orders ORDER BY created_at DESC;`);
  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    status: r.status,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone,
    total: Number(r.total),
    items: r.items || [],
    address: r.address,
  }));
}

export async function dbCreateOrder(body) {
  const id = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const date = new Date().toISOString().split('T')[0];
  const { rows } = await pool.query(
    `INSERT INTO orders (id, date, status, customer_name, customer_email, customer_phone, total, items, address)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
     RETURNING *;`,
    [
      id,
      date,
      'Pending',
      body.customerName || 'Online Boutique Guest',
      body.customerEmail || 'client@singhar.com',
      body.customerPhone || '+92 300 0000000',
      Number(body.total || 0),
      JSON.stringify(body.items || []),
      body.address || 'Standard Delivery',
    ]
  );
  const r = rows[0];
  return {
    id: r.id,
    date: r.date,
    status: r.status,
    customerName: r.customer_name,
    customerEmail: r.customer_email,
    customerPhone: r.customer_phone,
    total: Number(r.total),
    items: r.items || [],
    address: r.address,
  };
}

export async function dbUpdateOrderStatus(id, status) {
  const { rows } = await pool.query(`UPDATE orders SET status = $1 WHERE id = $2 RETURNING *;`, [status, id]);
  return rows[0] || null;
}

export async function dbDeleteOrder(id) {
  const { rows } = await pool.query(`DELETE FROM orders WHERE id = $1 RETURNING *;`, [id]);
  return rows[0] || null;
}

// ─── Inquiries Queries ────────────────────────────────────────────────────────
export async function dbGetInquiries() {
  const { rows } = await pool.query(`SELECT * FROM inquiries ORDER BY created_at DESC;`);
  return rows.map((r) => ({
    id: r.id,
    date: r.date,
    status: r.status,
    name: r.name,
    email: r.email,
    inquiryType: r.inquiry_type,
    message: r.message,
  }));
}

export async function dbCreateInquiry(body) {
  const id = `INQ-${Math.floor(100 + Math.random() * 900)}`;
  const date = new Date().toLocaleString();
  const { rows } = await pool.query(
    `INSERT INTO inquiries (id, date, status, name, email, inquiry_type, message)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *;`,
    [id, date, 'Unread', body.name, body.email, body.inquiryType || 'Custom Design Commission', body.message || '']
  );
  const r = rows[0];
  return {
    id: r.id,
    date: r.date,
    status: r.status,
    name: r.name,
    email: r.email,
    inquiryType: r.inquiry_type,
    message: r.message,
  };
}

export async function dbUpdateInquiryStatus(id, status) {
  const { rows } = await pool.query(`UPDATE inquiries SET status = $1 WHERE id = $2 RETURNING *;`, [status, id]);
  return rows[0] || null;
}

export async function dbDeleteInquiry(id) {
  const { rows } = await pool.query(`DELETE FROM inquiries WHERE id = $1 RETURNING *;`, [id]);
  return rows[0] || null;
}

// ─── Settings Queries ─────────────────────────────────────────────────────────
export async function dbGetSettings() {
  const { rows } = await pool.query(`SELECT data FROM settings WHERE id = 'store_settings';`);
  return rows[0]?.data || INITIAL_DATA.settings;
}

export async function dbUpdateSettings(body) {
  const current = await dbGetSettings();
  const updated = { ...current, ...body };
  await pool.query(
    `INSERT INTO settings (id, data) VALUES ('store_settings', $1)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data;`,
    [JSON.stringify(updated)]
  );
  return updated;
}

export async function dbResetDatabase() {
  await pool.query(`TRUNCATE TABLE products, orders, inquiries, settings;`);
  await initDB();
  return true;
}

// ─── Admin Users Queries (Real Cryptographic Auth) ───────────────────────────
export async function dbFindAdminUser(identifier) {
  const clean = (identifier || '').trim().toLowerCase();
  const { rows } = await pool.query(
    `SELECT * FROM admin_users WHERE LOWER(username) = $1 OR LOWER(email) = $1 LIMIT 1;`,
    [clean]
  );
  return rows[0] || null;
}

export async function dbGetAdminById(id) {
  const { rows } = await pool.query(
    `SELECT id, username, email, role, last_login, created_at FROM admin_users WHERE id = $1;`,
    [id]
  );
  return rows[0] || null;
}

export async function dbUpdateAdminLastLogin(id) {
  await pool.query(`UPDATE admin_users SET last_login = NOW() WHERE id = $1;`, [id]);
}

export async function dbUpdateAdminPassword(id, newPassword) {
  const { salt, hash } = hashPassword(newPassword);
  const { rows } = await pool.query(
    `UPDATE admin_users SET password_hash = $1, salt = $2 WHERE id = $3 RETURNING id, username, email, role;`,
    [hash, salt, id]
  );
  return rows[0] || null;
}

