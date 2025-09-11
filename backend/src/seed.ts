import 'dotenv/config';
import { Pool } from 'pg';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function seed() {
  await pool.query(`
    create table if not exists products (
      id serial primary key,
      name text not null,
      description text,
      category text,
      price integer not null,
      sale_price integer,
      image text,
      created_at timestamptz default now()
    );
  `);
  const count = await pool.query('select count(*) from products');
  if (Number(count.rows[0].count) > 0) return;
  await pool.query(
    `insert into products (name, description, category, price, sale_price, image)
     values
     ('ماگ دست‌ساز ۱','ماگ سفالی لعاب‌دار','ماگ', 120000, null, '/mugs/image.jpeg'),
     ('ماگ دست‌ساز ۲','ماگ با طرح کلاسیک','ماگ', 150000, 135000, '/mugs/image-3.jpeg'),
     ('ماگ دست‌ساز ۳','ماگ ویژه هدیه','ماگ', 180000, null, '/mugs/image-5.jpeg')`
  );
}

seed().then(() => pool.end());


