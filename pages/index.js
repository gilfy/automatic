import { useState } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleSynthesize = async () => {
    const response = await fetch('/api/synthesize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (response.ok) {
      const result = await response.json();
      setFileName(result.fileName);

      // Übergang zu einem temporären Pfad in Vercel
      const audioUrl = `/tmp/${result.fileName}`;
      const audio = new Audio(audioUrl);
      audio.play();
    } else {
      console.error('Fehler bei der Umwandlung');
    }
  };

  return (
    <div className="container">
      <h1>Text to Speech</h1>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Geben Sie hier Ihren Text ein"></textarea>
      <button onClick={handleSynthesize}>Umwandeln</button>
      {fileName && <p>Datei generiert: {fileName}</p>}
    </div>
  );
}