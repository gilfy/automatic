import { NextApiRequest, NextApiResponse } from 'next';
import { createAudioFileFromText } from '../../utils/textToSpeech';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { text } = req.body;

    try {
      const fileName = await createAudioFileFromText(text);
      res.status(200).json({ fileName });
    } catch (error) {
      console.error('Fehler beim Generieren von Audio:', error);
      res.status(500).json({ error: 'Fehler bei der Audiogenerierung' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end('Method Not Allowed');
  }
}