const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.post('/api/send-email', async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, text } = req.body;

  if (!to || !subject || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Normalize recipients: accept string with commas/newlines or an array
  let recipients = Array.isArray(to) ? to : String(to).split(/[\n,;]+/);
  recipients = recipients
    .map((email) => email.trim())
    .filter((email) => email.length > 0);

  if (recipients.length === 0) {
    return res.status(400).json({ error: 'No valid recipient emails provided' });
  }

  if (recipients.length > 1000) {
    return res
      .status(400)
      .json({ error: 'Too many recipients (max 1000 allowed at once)' });
  }

  // Create transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail', // or your preferred service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    // Send one email to all recipients using BCC so they can't see each other
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      bcc: recipients,
      subject,
      text,
      html: `<p>${text}</p>`,
    });

    res.status(200).json({ success: true, sentTo: recipients.length });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Failed to send email' });
  }
});

app.listen(PORT, () => {
  console.log(`Email server listening on port ${PORT}`);
});


