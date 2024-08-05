import nextConnect from 'next-connect';
import multer from 'multer';
import { read, utils } from 'xlsx';
import promisePool from '@/lib/db';

const upload = multer({
  storage: multer.memoryStorage(),
});

const handler = nextConnect()
  .use(upload.single('file'))
  .post(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    try {
      const workbook = read(req.file.buffer);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = utils.sheet_to_json(sheet, { header: 1 });

      for (const row of data) {
        const [id, name, email] = row;
        
        if (row.length < 3) continue;

        await promisePool.query('INSERT INTO users (id, name, email) VALUES (?, ?, ?)', [id, name, email]);
      }
      
      res.status(200).json({ message: 'Data successfully inserted into the database.' });
    } catch (error) {
      console.error(error); 
      res.status(500).json({ error: error.message });
    }
  });

export default handler;
