export default async function handler(req, res) {
  if (req.method === 'GET') {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    try {
      const response = await fetch('https://api.elevenlabs.io/voices', {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });

      if (response.ok) {
        const voices = await response.json();
        res.status(200).json(voices);
      } else {
        res.status(response.status).json({ error: response.statusText });
      }
    } catch (error) {
      res.status(500).json({ error: 'Interner Serverfehler' });
    }
  } else if (req.method === 'POST') {
    const { text, voice } = req.body;
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const response = await fetch('https://api.elevenlabs.io/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ text, voice }),
    });

    if (response.ok) {
      const audioBuffer = await response.arrayBuffer();
      res.setHeader('Content-Type', 'audio/mpeg');
      res.send(Buffer.from(audioBuffer));
    } else {
      res.status(response.status).send(response.statusText);
    }
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end('Method Not Allowed');
  }
}