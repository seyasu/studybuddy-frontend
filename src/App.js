import React, { useState } from 'react';

export default function App() {
  const [notes, setNotes] = useState('');
  const [studyTime, setStudyTime] = useState(60);
  const [weights, setWeights] = useState({});
  const [chapters, setChapters] = useState([]);
  const [stage, setStage] = useState('notes');
  const [response, setResponse] = useState('');
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);

  const backendUrl = 'https://studybuddy-backend-3ewd.onrender.com'; // replace this

  const detectChapters = async () => {
    setLoading(true);
    const res = await fetch(`${backendUrl}/api/extract-chapters`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadedText: notes })
    });
    const data = await res.json();
    const detectedChapters = data.chapters;
    const initialWeights = {};
    detectedChapters.forEach(ch => initialWeights[ch] = 100 / detectedChapters.length);
    setChapters(detectedChapters);
    setWeights(initialWeights);
    setLoading(false);
    setStage('weights');
  };

  const startSession = async () => {
    setLoading(true);
    const res = await fetch(`${backendUrl}/api/study`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uploadedText: notes, chapterWeights: weights, studyTime })
    });
    const data = await res.json();
    setResponse(data.response);
    setQuizQuestions(data.quizQuestions);
    setLoading(false);
    setStage('review');
  };

  const answerQuestion = (selected) => {
    const correct = quizQuestions[currentQ]?.correct;
    if (selected === correct) {
      setScore(score + 1);
      setFeedback('✅ Correct!');
    } else {
      setFeedback(`❌ Correct answer: ${correct}`);
    }
    setTimeout(() => {
      setFeedback(null);
      setCurrentQ(currentQ + 1);
    }, 1200);
  };

  const container = { maxWidth: 600, margin: 'auto', padding: 20 };

  if (loading) return <div style={container}><p>⏳ Processing...</p></div>;
  if (stage === 'notes') return <div style={container}>
    <h1>📘 StudyBuddy</h1>
    <textarea placeholder="Paste notes here..." value={notes} onChange={e => setNotes(e.target.value)} rows={6} style={{ width: '100%' }} />
    <button onClick={detectChapters}>Next: Analyze</button>
  </div>;
  if (stage === 'weights') return <div style={container}>
    <h2>📊 Chapter Weights</h2>
    {chapters.map(ch => (
      <div key={ch}>
        <label>{ch}: {weights[ch] || 0}%</label>
        <input type="range" value={weights[ch]} onChange={e => setWeights({ ...weights, [ch]: Number(e.target.value) })} />
      </div>
    ))}
    <button onClick={() => setStage('time')}>Next</button>
  </div>;
  if (stage === 'time') return <div style={container}>
    <h2>⏱️ Study Time (mins)</h2>
    <input type="number" value={studyTime} onChange={e => setStudyTime(Number(e.target.value))} />
    <button onClick={startSession}>Start Review & Quiz</button>
  </div>;
  if (stage === 'review') return <div style={container}>
    <h2>📖 Review</h2>
    <p>{response}</p>
    <button onClick={() => setStage('quiz')}>Take Quiz</button>
  </div>;
  if (stage === 'quiz') {
    const q = quizQuestions[currentQ];
    if (!q) return <div style={container}><h2>🎉 Final Score: {score}/{quizQuestions.length}</h2></div>;
    return <div style={container}>
      <h3>Q{currentQ + 1}: {q.question}</h3>
      {q.options.map((opt, idx) => (
        <button key={idx} onClick={() => answerQuestion(opt)} style={{ display: 'block', margin: '8px 0' }}>{opt}</button>
      ))}
      {feedback && <p>{feedback}</p>}
    </div>;
  }
  return null;
}
