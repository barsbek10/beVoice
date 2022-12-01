import React, {useEffect, useRef} from "react"
import './WordLearn.css'
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import {useState} from "react";
import Heading from "../../../../Assets/heading";
import audioBee from "../../../../../images/audio_bee.svg";
import {useSpeechSynthesis} from "react-speech-kit";
import useKeyPress from "../../../../Assets/useKeyPress";
import ChooseVoice from "../../../../Assets/chooseVoice";

const heading = "Выбери изучение алфавита или слов";
const instructionTextList = ["Напишите слово чтобы набрать балл."];
    // "Нажми стрелку вниз, чтобы выбрать другое слово."

const data = [
    {
        id: 1,
        text: "laptop",
        correct: false
    },
    {
        id: 2,
        text: "javascript",
        correct: false
    },
    {
        id: 3,
        text: "writing",
        correct: false
    },
    {
        id: 4,
        text: "mouse",
        correct: false
    },
    {
        id: 5,
        text: "zone",
        correct: true
    },
    {
        id: 6,
        text: "someone",
        correct: true
    },
    {
        id: 7,
        text: "yesterday",
        correct: false
    },
    {
        id: 8,
        text: "hello",
        correct: false
    },
    {
        id: 9,
        text: "cat",
        correct: false
    },
    {
        id: 10,
        text: "book",
        correct: false
    }
]

const WordLearn = () => {

    // SETTING AUDIO ON CLICK/SELECT:
    const context = new window.AudioContext();
    const playFile = (filepath) => {
        fetch(filepath)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
            .then(audioBuffer => {
                const soundSource = context.createBufferSource();
                soundSource.buffer = audioBuffer;
                soundSource.connect(context.destination);
                soundSource.start();
            });
    }
    const playSound = () => {
        playFile('https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3');
    }

    // SPEECH SYNTHESIS:
    const onEnd = () => {
        // You could do something here after speaking has finished
    };
    const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
        onEnd,
    });
    const russianVoice = voices[18];
    const englishVoice = voices[0];

    // INPUT ON THE SCREEN:
    const inputReference = useRef(null);
    const [input, setInput] = useState("");
    const [right, setRight] = useState(0);
    const [total, setTotal] = useState(0);
    const [currentWord, setCurrentWord] = useState(null);
    const [words, setWords] = useState([]);
    const controlPress = useKeyPress("Control");

    useEffect(() => {
        console.log("on mount");
        setWords(data);
    }, []);
    useEffect(() => {
        if (controlPress) {
            instructionTextList.forEach(text => speak({text: text, voice: russianVoice}) );
        }
        speak({text:"Новое слово", voice: russianVoice});
        currentWord && speak({text:currentWord.text, voice: englishVoice});
    }, [controlPress]);
    useEffect(() => {
        console.log("words array changed");
        setTotal(words.length);
        if(words.length > 0 && right !== words.length) {
            let count_right = 0;
            for(const w of words){
                if(!w.correct){
                    setCurrentWord(w);
                }
                else{
                    count_right = count_right+1;
                }
            }
            setRight(count_right);
        }
    }, [words]);
    useEffect(() => {
        console.log("currentWord changed");
        // cancel()
        speak({text:"Новое слово", voice: russianVoice});
        currentWord && speak({text:currentWord.text, voice: englishVoice});
    }, [currentWord]);
    useEffect(() => {
        if(total>0 && right===total){
            speak({text:"Поздравляю вы справились с заданием", voice: russianVoice});
        }
    }, [right]);
    useEffect(() => {
        // console.log(currentWord);
        // console.log(input);
        if(currentWord && input === currentWord.text ) {
            playSound();
            speak({text:"Вы правильно написали слово", voice: russianVoice});
            setInput("");
            setRight(prevState => prevState+1);
            const newWords = words.map( (word,i) => {
                if(word.id === currentWord.id) {
                    return {...word, correct: true};
                }
                else {
                    return word;
                }
            });
            setWords(newWords);
        }
    }, [input]);

    const stats = {
        right: 0,
        wrong: 0
    }

    const onKeyboardChange = (input) => {
        console.log("Keyboard input changed", input);
        // setInput(input);
    }

    const onKeyPress = (button) => {
        console.log("Button pressed", button);
    }
    const handleKeyDown = (event) => {
        console.log("Button pressed", event.key);
        speak({text:event.key, voice: englishVoice});
    }
    const onInputChange = (event) => {
        console.log("Input changed");
        const input = event.target.value;
        setInput(input);
    };

    const buttonClick = (e, word) => {
        console.log(e.target.value);
        console.log(word);
        setCurrentWord(word);
        inputReference.current.focus();
    }
    return (
        <div>
            <div className="container text-center">
                <div className="m-flex">
                    {instructionTextList.map((text, i) => {
                        return (
                            <span key={i}>{text}</span>
                        )
                    })}
                </div>
                <h1>{currentWord && currentWord.text}</h1>
                <div className="stats">
                    <div > right: {right} </div>
                    <div > total: {total} </div>
                </div>
                <div>
                    {words.length && words.map((word, i) => (
                        <button key={i}
                                onClick={(e) => buttonClick(e, word)}
                                disabled={word.correct}
                        >
                            {word.text}
                        </button>
                    ))}
                </div>
                <input
                    value={input}
                    ref={inputReference}
                    autoFocus={true}
                    onChange={onInputChange}
                    onKeyDown={handleKeyDown}
                />
                <Keyboard
                    physicalKeyboardHighlight={true}
                    useTouchEvents={true}
                    onChange={onKeyboardChange}
                    onKeyPress={onKeyPress}
                />
            </div>
        </div>
    );
}

export default WordLearn;