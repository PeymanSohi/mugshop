import 'dotenv/config';
import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Pool } from 'pg';

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function ensureSchema() {
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
}

app.get('/health', (_req: Request, res: Response) => res.json({ ok: true }));

// Uploads
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
const upload = multer({ dest: 'uploads/' });

app.post('/upload', upload.single('file'), (req: Request, res: Response) => {
  const file = (req as any).file as Express.Multer.File | undefined;
  if (!file) return res.status(400).json({ error: 'file required' });
  // Return public URL served by nginx proxy via /api -> /uploads
  return res.status(201).json({ url: `/api/uploads/${file.filename}` });
});

// Products CRUD (minimal)
app.get('/products', async (_req: Request, res: Response) => {
  const { rows } = await pool.query('select * from products order by id desc');
  res.json(rows);
});

app.put('/products/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, description, category, price, sale_price, image } = req.body;
  const { rows } = await pool.query(
    `update products set name=$1, description=$2, category=$3, price=$4, sale_price=$5, image=$6 where id=$7 returning *`,
    [name, description, category, price, sale_price, image, id]
  );
  res.json(rows[0]);
});

app.post('/products', async (req: Request, res: Response) => {
  const { name, description, category, price, sale_price, image } = req.body;
  const { rows } = await pool.query(
    `insert into products (name, description, category, price, sale_price, image) values ($1,$2,$3,$4,$5,$6) returning *`,
    [name, description, category, price, sale_price, image]
  );
  res.status(201).json(rows[0]);
});

app.delete('/products/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  await pool.query('delete from products where id=$1', [id]);
  res.status(204).end();
});

const port = Number(process.env.PORT || 3000);
ensureSchema().then(() => {
  app.listen(port, () => console.log(`[api] listening on ${port}`));
});


