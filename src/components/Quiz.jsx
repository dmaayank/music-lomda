import React, { useState, useRef, useEffect } from 'react';
import quizData from '../data/quizData.json'; // Adjust path to your JSON file
import '../css/quiz.css';

const Quiz = ({ onBack }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [isTimer, setIsTimer] = useState(false);

  const [timeLeft, setTimeLeft] = useState(300);

  const audioRef = useRef(new Audio(`${import.meta.env.BASE_URL}audio/quiz-theme.mp3`));

  const questions = quizData.finalQuiz;

  const [isMuted, setIsMuted] = useState(false);

  const toggleMute = () => {
    setIsMuted(!isMuted);
    audioRef.current.muted = !isMuted;
    // If it was blocked, this click will "unblock" it
    audioRef.current.play();
  };


  useEffect(() => {
    // Only run the interval if the quiz started, it's not the score screen, AND a timer is requested
    if (!quizStarted || showScore || !isTimer) return;

    if (timeLeft === 0) {
      setShowScore(true);
      return;
    }

    const timerInterval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timerInterval);
  }, [quizStarted, showScore, timeLeft, isTimer]);

  useEffect(() => {
    const audio = audioRef.current;
    if (quizStarted && !showScore) {
      audio.loop = true;
      audio.volume = 0.3;
      audio.play().catch(e => console.log("Audio blocked until interaction"));
    } else {
      audio.pause();
    }

    return () => audio.pause();
  }, [quizStarted, showScore]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleAnswerClick = (selectedOption) => {
    if (selectedOption === questions[currentQuestion].correctAnswer) {
      setScore(score + 1);
      setQuestionsAnswered(prev => prev + 1);
    }

    const nextQuestion = currentQuestion + 1;
    if (nextQuestion < questions.length) {
      setCurrentQuestion(nextQuestion);
    } else {
      setShowScore(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowScore(false);
    setTimeLeft(300);

    if (audioRef.current) {
      audioRef.current.pause();        // Stop current playback
      audioRef.current.currentTime = 3; // Rewind to the very beginning
      audioRef.current.play();         // Start playing again
    }
  };

  if (!quizStarted) {
    return (
      /* This outer div should only be a wrapper for the background */
      <div className="quiz-container">
        {/* This is the div that needs the space-between logic */}
        <div className="start-screen">

          <div className="header-group">
            <h1 className="quiz-question">HEROES CHALLENGE</h1>
            <p className="quiz-text">TEST YOUR KNOWLEDGE OF THE 25 GREATEST MYTHS!</p>
            <p className="hint-text">CHOOSE YOUR PATH TO BEGIN THE TRIAL.</p>
          </div>

          <div className="choice-container">
            <button
              className='button choice with-timer'
              onClick={() => { setIsTimer(true); setQuizStarted(true); }}
            >
              TIMER MODE (5:00)
            </button>

            <button
              className='button choice without-timer'
              onClick={() => { setIsTimer(false); setQuizStarted(true); }}
            >
              REGULAR MODE (No Timer)
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {showScore ? (
        <div className="quiz-card score-section">
          <h2>The Gods Have Judged!</h2>
          <div className="score-circle">
            <span className="final-score">{score}</span>
            <span className="total-score">/ {questions.length}</span>
          </div>
          <p>{timeLeft === 0 ? "OUT OF TIME! " : ""}{score > 20 ? "You are a true Hero!" : "Return to the stories."}</p>
          <button className="quiz-btn restart" onClick={restartQuiz}>RESTART TRIAL</button>
          <button className="return-button" onClick={onBack}>BACK TO HEROES</button>
        </div>
      ) : (
        <div className="quiz-card">
          <div className="quiz-header">
            {/* <button className="audio-control-btn" onClick={toggleMute}>
              {isMuted ? "🔈 Unmute" : "🔊 Mute"}
            </button> */}

            {isTimer && (
              <div className={`timer-display ${timeLeft < 30 ? 'emergency' : ''}`}>
                ⏳ {formatTime(timeLeft)}
              </div>
            )}
            <span>Entry {currentQuestion + 1} of {questions.length}</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
            ></div>
          </div>


          <h2 className="question-text">{questions[currentQuestion].question}</h2>


          <div className="options-grid">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                className="option-btn"
                onClick={() => handleAnswerClick(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;