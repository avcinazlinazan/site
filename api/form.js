export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const data = req.body || {};
  console.log('Contact form submission:', data);

  // If you want to send an email, provide SENDGRID_API_KEY, FROM_EMAIL and CONTACT_TO_EMAIL
  if (process.env.SENDGRID_API_KEY) {
    try {
      const payload = {
        personalizations: [{
          to: [{ email: process.env.CONTACT_TO_EMAIL || 'avcinazlinazan@yagmuranaai.com' }],
          subject: 'Yeni iletişim formu'
        }],
        from: { email: process.env.FROM_EMAIL || 'noreply@example.com' },
        content: [{
          type: 'text/plain',
          value:
            `Name: ${data.name || ''}\nEmail: ${data.email || ''}\nPhone: ${data.phone || ''}\nService: ${data.service || ''}\nMessage: ${data.message || ''}`
        }]
      };

      const r = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!r.ok) {
        const text = await r.text();
        console.error('SendGrid error:', text);
        return res.status(500).send('email error');
      }
    } catch (err) {
      console.error(err);
      return res.status(500).send('email error');
    }
  }

  // Default: accept and respond OK. Customize to store in DB, forward to webhook, etc.
  res.status(200).json({ ok: true });
}
