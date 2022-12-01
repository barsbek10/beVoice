import React, { useState } from 'react';
import { useSpeechSynthesis} from 'react-speech-kit'
import {useEffect} from "react";

const selectedVoices = [
    {
        default: true,
        lang: "en-US",
        localService: true,
        name: "Microsoft David - English (United States)",
        voiceURI: "Microsoft David - English (United States)"
    },
    {
        default: false,
        lang: "en-US",
        localService: true,
        name: "Microsoft Mark - English (United States)",
        voiceURI: "Microsoft Mark - English (United States)"
    },
    {
        default: false,
        lang: "en-US",
        localService: true,
        name: "Microsoft Zira - English (United States)",
        voiceURI: "Microsoft Zira - English (United States)"
    },
    {
        default: false,
        lang: "en-US",
        localService: false,
        name: "Google US English",
        voiceURI: "Google US English"
    },
    {
        default: false,
        lang: "en-GB",
        localService: false,
        name: "Google UK English Female",
        voiceURI: "Google UK English Female",
    },
    {
        default: false,
        lang: "en-GB",
        localService: false,
        name: "Google UK English Male",
        voiceURI: "Google UK English Male"
    },
    {
        default: false,
        lang: "ru-RU",
        localService: false,
        name: "Google русский",
        voiceURI: "Google русский"
    }
]

const ChooseVoice = () => {
    const [text, setText] = useState('I am a robot');
    const [voiceIndex, setVoiceIndex] = useState(1);
    const [voice, setVoice] = useState(null);
    const onEnd = () => {
        // You could do something here after speaking has finished
    };
    const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
        onEnd,
    });

    // const selectedVoices = voices.filter(e => (e.lang === "en-US" || e.lang === "ru-RU" || e.lang==="en-GB"));
    // const voice = selectedVoices[voiceIndex] || null;

    useEffect(() => {
        const selectedVoice = selectedVoices[voiceIndex]
        console.log("selectedVoice", selectedVoice);
        const synthesisVoice = voices.find(e => e.voiceURI === selectedVoice.voiceURI);
        console.log(voiceIndex);
        console.log("synthesisVoice",synthesisVoice);
        setVoice(synthesisVoice);
    }, [voiceIndex]);

    // const a = voices;
    // console.log("Voices:", a);


    const styleFlexRow = { display: 'flex', flexDirection: 'row' };

    return (
        <div className="container">
            <form>
                <h2>Speech Synthesis</h2>
                {!supported && (
                    <p>
                        Oh no, it looks like your browser doesn&#39;t support Speech
                        Synthesis.
                    </p>
                )}
                {supported && (
                    <React.Fragment>
                        <p>
                            {`Type a message below then click 'Speak'
                and SpeechSynthesis will read it out.`}
                        </p>
                        <label htmlFor="voice">Voice</label>
                        <select
                            id="voice"
                            name="voice"
                            value={voiceIndex}
                            onChange={(event) => {
                                console.log(event.target.value);
                                setVoiceIndex(event.target.value);
                            }}
                        >
                            {selectedVoices.map((option, index) => (
                                <option key={option.voiceURI} value={index}>
                                    {`${option.lang} - ${option.name}`}
                                </option>
                            ))}
                        </select>
                        <label htmlFor="message">Message</label>
                        <textarea
                            id="message"
                            name="message"
                            rows={3}
                            value={text}
                            onChange={(event) => {
                                setText(event.target.value);
                            }}
                        />
                        {speaking ? (
                            <button type="button" onClick={cancel}>
                                Stop
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={() => speak({text, voice})}
                            >
                                Speak
                            </button>
                        )}
                    </React.Fragment>
                )}
            </form>
        </div>
    );
};

export default ChooseVoice;