import React from "react";
import { useState, useEffect } from "react";
import "./css/App.css";
import Card from "./components/Card.jsx";
import STUDY_DATA from './data/infomation.json';
import { HashRouter } from "react-router-dom";
import Quiz from "./components/Quiz.jsx";
import HeroPage from "./components/HeroPage.jsx";

const App = () => {

  const [isCards, setIsCards] = useState(false);
  const [cardList, setWordList] = useState(STUDY_DATA.musicalInstruments);
  const [currHero, setCurrHero] = useState(null);
  const [isQuiz, setIsQuiz] = useState(false);

  const [clickedHeroes, setClickedHeroes] = useState([])

  const returnBack = () => setCurrHero(null);

  const setInstrumentClicked = (hero) => {
    setCurrHero(hero); // Shows the HeroPage

    // Add to visited list if not already there
    if (!clickedHeroes.includes(hero.family)) {
      setClickedHeroes((prev) => [...prev, hero.family]);
    }
  };

  if (isQuiz) {
    return (
      <Quiz
        onBack={() => setIsQuiz(false)}
      />
    )
  }


  return (
    <div className="app-container">
      {/* If isCards is FALSE, show the intro. If TRUE, this whole section vanishes */}
      {!isCards && (
        <div className="intro-section">
          <img
            src={`${import.meta.env.BASE_URL}images/music-notes.png`}
            className="music-notes note1"
            alt="musicNotes"
          />
          <img
            src={`${import.meta.env.BASE_URL}images/music-notes.png`}
            className="music-notes note2"
            alt="musicNotes"
          />
          <h1>Musical Instruments</h1>
          <p>Welcome to the lomda about musical instruments! in here you will learn about all kinds of musical instruments and their history.</p>
          <button className="start" onClick={() => setIsCards(true)}>
            START
          </button>
        </div>
      )}

      {clickedHeroes.length === cardList.length && (
        <button className="to-quiz"
          onClick={() => {
            setIsQuiz(true);                         // Enter Quiz mode
          }}
        >
          Start Quiz </button>
      )}

      {isCards && !currHero && (
        <>
          <h1 className="main-title">The Musical Families</h1>
          <div className="card-grid">
            {cardList.map((instrument) => (
              <div
                key={instrument.family}
                onClick={() => setInstrumentClicked(instrument)}
                className={`hero-card ${clickedHeroes.includes(instrument.family) ? "visited" : ""}`}
              >
                {/* Pass the family name (Keyboard, String, etc.) to the Card */}
                <Card name={instrument.family} />
              </div>
            ))}
          </div>
        </>
      )}

      {/* 3. Show the Hero Page if a hero is selected */}
      {currHero && (
        <HeroPage instrument={currHero} onBack={returnBack} />

      )}
    </div>
  );
}

export default App;