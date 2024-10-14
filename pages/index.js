import { useState, useEffect } from 'react';

export default function Home() {
  const [text, setText] = useState('');
  const [voice, setVoice] = useState('');
  const [voices, setVoices] = useState([]);
  const [audioUrl, setAudioUrl] = useState('');
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    const fetchVoices = async () => {
      const response = await fetch('/api/speak');
      if (response.ok) {
        const data = await response.json();
        setVoices(data.voices);
        if (data.voices.length > 0) setVoice(data.voices[0].id);
      }
    };
    fetchVoices();
  }, []);

  const convertTextToSpeech = async () => {
    setIsConfirmed(false);
    const response = await fetch('/api/speak', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text, voice }),
    });

    if (response.ok) {
      const blob = await response.blob();
      setAudioUrl(URL.createObjectURL(blob));
    } else {
      console.error('Fehler bei der API-Anfrage:', response.statusText);
    }
  };

  const handleConfirm = () => {
    setIsConfirmed(true);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-5 border rounded shadow-lg">
      <h1 className="text-2xl font-bold mb-4">Text to Speech mit ElevenLabs</h1>
      <textarea
        className="w-full p-2 border rounded mb-4"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Geben Sie hier Ihren Text ein"
      ></textarea>
      <select
        className="w-full p-2 border rounded mb-4"
        value={voice}
        onChange={e => setVoice(e.target.value)}
      >
        {voices.map(v => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
      <button
        className="w-full bg-blue-500 text-white p-2 rounded mb-4 hover:bg-blue-600"
        onClick={convertTextToSpeech}
      >
        Umwandeln
      </button>
      
      {audioUrl && (
        <div>
          <button 
            className="w-full bg-green-500 text-white p-2 rounded mb-4 hover:bg-green-600"
            onClick={handleConfirm}
          >
            Bestätigen und anhören
          </button>
          {isConfirmed && <audio controls src={audioUrl}></audio>}
        </div>
      )}
    </div>
  );
}