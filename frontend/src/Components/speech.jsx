import { useState, useEffect } from 'react';

const Speech = () => {
    const [transcript, setTranscript] = useState('');
    const [analysis, setAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
        const recognition = new window.webkitSpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onresult = (event) => {
            let finalTranscript = '';
            for (let i = 0; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
                finalTranscript += event.results[i][0].transcript;
            }
            }
            setTranscript(prevTranscript => prevTranscript + ' ' + finalTranscript);
        };

        recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        setRecognition(recognition);
        } else {
        console.error('Speech recognition not supported');
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
        recognition.stop();
        } else {
        recognition.start();
        setIsListening(true);
        }
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    if (!transcript.trim()) return;
    setLoading(true);

    try {
        const response = await fetch('http://localhost:8000/process', {  // Full URL
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ transcript }),
        });

        const data = await response.json();
        if (data.error) {
        console.error('Error from API:', data.error);
        setAnalysis('Error: ' + data.error);
        } else {
        setAnalysis(data.result);
        }
    } catch (error) {
        console.error('Error:', error);
        setAnalysis('Error connecting to server');
    } finally {
        setLoading(false);
    }
    };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="mb-6">
        <button
          onClick={toggleListening}
          className={`mb-4 px-6 py-3 rounded-full text-white font-semibold ${
            isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
          }`}
        >
          {isListening ? '🎤 Stop Recording' : '🎤 Start Recording'}
        </button>
        {isListening && (
          <div className="text-sm text-gray-600 animate-pulse">
            Recording in progress...
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="relative">
          <textarea
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full p-4 border rounded-lg min-h-[150px] text-gray-800"
            placeholder="Your speech will appear here..."
            readOnly={isListening}
          />
          {transcript && !isListening && (
            <button
              type="button"
              onClick={() => setTranscript('')}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              Clear ✕
            </button>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition-colors"
          disabled={loading || !transcript.trim()}
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </span>
          ) : (
            'Analyze Speech'
          )}
        </button>
      </form>

      {analysis && (
        <div className="mt-8 p-6 border rounded-lg bg-white shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Analysis Results</h2>
          <div className="prose max-w-none">
            <pre className="whitespace-pre-wrap text-gray-700 font-sans leading-relaxed bg-gray-50 p-4 rounded-lg">
              {analysis}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default Speech;