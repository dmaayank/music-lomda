import React, { useState, useEffect, useRef } from "react";
import '../css/heroPage.css';

const HeroPage = ({ instrument, onBack }) => {
    // 'overview' shows the family text, 'learning' shows specific instruments
    const [viewMode, setViewMode] = useState("overview");
    const [currentInstrumentIndex, setCurrentInstrumentIndex] = useState(0);
    const [step, setStep] = useState(0);


    const [isMuted, setIsMuted] = useState(false);


    const currentData = instrument.instruments[currentInstrumentIndex];
    const isObject = typeof currentData === 'object';
    const instrumentName = isObject ? currentData.name : currentData;

    // Audio Reference
    const audioRef = useRef(new Audio());

    // Effect to handle Audio Source changes
    useEffect(() => {
        const audio = audioRef.current;

        // Update source based on the current instrument being viewed
        const fileName = instrumentName.toLowerCase().replace(/\s+/g, '_');
        audio.src = `${import.meta.env.BASE_URL}audio/${fileName}.mp3`;

        audio.volume = 0.4;
        audio.muted = isMuted;

        if (viewMode === "learning") {
            audio.play().catch(() => console.log("Waiting for user interaction..."));
        }

        return () => {
            audio.pause();
        };
    }, [currentInstrumentIndex, viewMode]); // Re-run when instrument changes or we start learning


    const toggleMute = () => {
        setIsMuted(!isMuted);
        audioRef.current.muted = !isMuted;
        audioRef.current.play();
    };

    // Navigation for Instruments
    const nextInstrument = () => {
        if (currentInstrumentIndex < instrument.instruments.length - 1) {
            setCurrentInstrumentIndex(currentInstrumentIndex + 1);
        }
    };

    const prevInstrument = () => {
        if (currentInstrumentIndex > 0) {
            setCurrentInstrumentIndex(currentInstrumentIndex - 1);
        }
    };

    return (
        <div className="hero-page-container">


            {viewMode === "overview" ? (
                /* --- MODE 1: FAMILY OVERVIEW --- */
                <div className="overview-screen info-fade">
                    <h1 className="family-title">{instrument.family} Family</h1>
                    <img
                        onClick={onBack}
                        src={`${import.meta.env.BASE_URL}images/${instrument.family.toLowerCase()}.png`}
                        className="family-hero-img"
                        alt={instrument.family}
                    />
                    <div className="family-text-content">
                        <p>{instrument.info}</p>

                        <button className="start-learning-btn" onClick={() => setViewMode("learning")}>
                            START LEARNING INSTRUMENTS
                        </button>
                    </div>
                </div>
            ) : (
                /* --- MODE 2: INSTRUMENT SPOTLIGHT --- */
                <div className="learning-screen info-fade">
                    <h2 className="instrument-title">
                        {isObject ? currentData.name : currentData}
                    </h2>
                    <button className="audio-control-btn" onClick={toggleMute}>
                        {isMuted ? "🔈" : "🔊"}
                    </button>

                    <img
                        src={`${import.meta.env.BASE_URL}images/${currentData.name.toLowerCase()}.png`}
                        className="instrument-img"
                        alt={currentData.name}

                    />

                    <div className="instrument-detail-card">
                        {isObject ? (
                            <div className="details-grid">
                                <p><strong>Original Name:</strong> {currentData.original_name}</p>
                                <p><strong>Created:</strong> {currentData.created}</p>
                                <p><strong>Creator:</strong> {currentData.creator}</p>
                                <p><strong>History:</strong> {currentData.history}</p>
                                <p><strong>Notable Players:</strong> {currentData.notable_players?.join(", ")}</p>
                            </div>
                        ) : (
                            <p>This is a member of the {instrument.family} family.</p>
                        )}
                        {currentInstrumentIndex > 4 && <p></p>
                        }
                    </div>

                    <div className="nav-controls">
                        <button className="button" onClick={prevInstrument} disabled={currentInstrumentIndex === 0}>{"<<"}</button>
                        <span className="page-indicator">
                            Instrument {currentInstrumentIndex + 1} / {instrument.instruments.length}
                        </span>
                        <button className="button" onClick={nextInstrument} disabled={currentInstrumentIndex === instrument.instruments.length - 1}>{">>"}</button>
                    </div>

                    <button className="back-to-overview" onClick={() => setViewMode("overview")}>
                        Return to Family Info
                    </button>
                </div>
            )}
        </div>
    );
};

export default HeroPage;