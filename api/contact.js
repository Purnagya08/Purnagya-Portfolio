export const config = {
  runtime: 'edge',
}

export default async function handler(req) {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const { name, email, message } = await req.json()

    // Basic validation
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'All fields are required.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    if (!email.includes('@')) {
      return new Response(JSON.stringify({ error: 'Invalid email address.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'NEXUS Portfolio <onboarding@resend.dev>',
        to:   ['purnagya.raj26nov@gmail.com'],
        reply_to: email,
        subject: `[NEXUS] New message from ${name}`,
        html: `
          <div style="background:#02040c;color:#d8e4f0;font-family:'Courier New',monospace;padding:32px;border-radius:4px;border:1px solid #c9a84c22">
            <div style="color:#c9a84c;font-size:18px;font-weight:bold;letter-spacing:4px;margin-bottom:24px;">
              NEXUS — INCOMING TRANSMISSION
            </div>
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#38b8d8;font-size:11px;letter-spacing:2px;padding:8px 0;border-bottom:1px solid #ffffff11;width:100px;">FROM</td>
                <td style="color:#d8e4f0;padding:8px 0;border-bottom:1px solid #ffffff11;">${name}</td>
              </tr>
              <tr>
                <td style="color:#38b8d8;font-size:11px;letter-spacing:2px;padding:8px 0;border-bottom:1px solid #ffffff11;">EMAIL</td>
                <td style="padding:8px 0;border-bottom:1px solid #ffffff11;"><a href="mailto:${email}" style="color:#c9a84c;">${email}</a></td>
              </tr>
            </table>
            <div style="margin-top:24px;">
              <div style="color:#38b8d8;font-size:11px;letter-spacing:2px;margin-bottom:10px;">MESSAGE</div>
              <div style="background:#0a0f1e;padding:16px;border-left:2px solid #c9a84c;color:#d8e4f0;line-height:1.7;white-space:pre-wrap;">${message}</div>
            </div>
            <div style="margin-top:24px;color:#38b8d880;font-size:10px;letter-spacing:2px;">
              Sent via NEXUS Portfolio · Reply directly to this email to respond.
            </div>
          </div>
        `,
      }),
    })

    if (!res.ok) {
      const err = await res.json()
      console.error('Resend error:', err)
      return new Response(JSON.stringify({ error: 'Failed to send. Please try again.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })

  } catch (err) {
    console.error('Contact handler error:', err)
    return new Response(JSON.stringify({ error: 'Server error. Please try again.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
