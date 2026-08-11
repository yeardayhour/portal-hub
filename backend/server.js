import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 8006;
const DATA_FILE = path.join(__dirname, 'guestbook.json');

app.use(cors());
app.use(express.json());

// Helper to read guestbook file
function readGuestbookData() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.writeFileSync(DATA_FILE, JSON.stringify([]));
      return [];
    }
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (e) {
    console.error('Error reading guestbook file:', e);
    return [];
  }
}

// Helper to write guestbook file
function writeGuestbookData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing guestbook file:', e);
  }
}

// GET /api/guestbook - Fetch all global entries
app.get('/api/guestbook', (req, res) => {
  const entries = readGuestbookData();
  // Return entries without plain passwords for security
  const safeEntries = entries.map(({ password, ...rest }) => rest);
  res.json({ success: true, entries: safeEntries });
});

// POST /api/guestbook - Add new global entry
app.post('/api/guestbook', (req, res) => {
  const { nickname, password, message } = req.body;

  if (!nickname || !password || !message) {
    return res.status(400).json({ error: '모든 필드를 입력해 주세요.' });
  }

  const entries = readGuestbookData();
  const now = new Date();
  const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

  const newEntry = {
    id: Date.now(),
    nickname: nickname.trim(),
    password: password.trim(),
    message: message.trim(),
    date: dateStr
  };

  entries.unshift(newEntry);
  writeGuestbookData(entries);

  console.log(`[Guestbook] New entry from ${newEntry.nickname}`);

  const safeEntries = entries.map(({ password, ...rest }) => rest);
  res.json({ success: true, entries: safeEntries });
});

// DELETE /api/guestbook/:id - Delete entry by password
app.delete('/api/guestbook/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: '비밀번호를 입력해 주세요.' });
  }

  const entries = readGuestbookData();
  const targetIdx = entries.findIndex(e => e.id === id);

  if (targetIdx === -1) {
    return res.status(444).json({ error: '해당 방명록 항목을 찾을 수 없습니다.' });
  }

  if (entries[targetIdx].password.trim() !== password.trim()) {
    return res.status(401).json({ error: '비밀번호가 일치하지 않습니다.' });
  }

  entries.splice(targetIdx, 1);
  writeGuestbookData(entries);

  console.log(`[Guestbook] Entry ${id} deleted`);

  const safeEntries = entries.map(({ password, ...rest }) => rest);
  res.json({ success: true, entries: safeEntries });
});

app.listen(PORT, () => {
  console.log(`[Portal Hub] Guestbook Backend API running on port ${PORT}`);
});
