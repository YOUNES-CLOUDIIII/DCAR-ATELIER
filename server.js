const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();
app.use(cors({ origin: '*' }));
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  }
});

app.post('/send-email', async (req, res) => {
  const { to, subject, message, from_name } = req.body;
  if (!to || !subject || !message) {
    return res.status(400).json({ success: false, error: 'Champs manquants' });
  }
  try {
    await transporter.sendMail({
      from: `"${from_name || 'DCAR ATELIER'}" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      text: message,
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/', (req, res) => res.send('DCAR ATELIER Email Server OK'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
