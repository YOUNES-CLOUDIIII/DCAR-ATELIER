const express = require('express');
const { Resend } = require('resend');

const app = express();

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json());

const resend = new Resend(process.env.RESEND_API_KEY);

app.post('/send-email', async (req, res) => {
  const { to, subject, message, from_name } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Champs manquants' });
  }
  try {
   const { data, error } = await resend.emails.send({
  from: 'DCAR ATELIER <onboarding@resend.dev>',
  to: [to],
  subject,
  text: message,
});
if (error) throw new Error(JSON.stringify(error));
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => res.send('DCAR ATELIER Email Server OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
