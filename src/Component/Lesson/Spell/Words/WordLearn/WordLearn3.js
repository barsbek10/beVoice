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
const instructionTextList = ["Напишите слово чтобы набрать балл.",
    "Нажми стрелку вниз или вверх, чтобы прослушать другие слова",
    "Нажми энтер чтобы выбрать слово"];

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

const WordLearn3 = () => {

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

    // KEYBOARD NAVIGATION HOOKS:
    const [selected, setSelected] = useState(undefined);
    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const enterPress = useKeyPress("Enter");
    const [firstPress, setFirstPress] = useState(true);
    const [dummy, setDummy] = useState(true);
    const [cursor, setCursor] = useState(-1);
    const [hovered, setHovered] = useState(undefined);
    // hook after component is mounted:
    useEffect(() => {
        if(supported) {
            setDummy(false);
        }
    }, []);
    useEffect(() => {
        instructionTextList.forEach(text => speak({text: text, voice: russianVoice}) );
    }, [dummy]);
    useEffect(() => {
        if (words.length && downPress) {
            console.log("S pressed");
            if( firstPress && cursor === -1 ) {
                setFirstPress(false);
                setCursor(0);
            }
            else{
                setCursor(prevState =>
                    prevState < words.length - 1 ? prevState + 1 : prevState
                );
            }
        }
    }, [downPress]);
    useEffect(() => {
        console.log("W pressed");
        if (words.length && upPress) {
            if( firstPress && cursor === -1 ) {
                setFirstPress(false);
                setCursor(0);
            }
            else{
                setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
            }

        }
    }, [upPress]);
    useEffect(() => {
        console.log("ENTER pressed");
        if (words.length && enterPress) {
            if(words[cursor].correct) {
                speak({text: "Вы уже написали это слово, выберите другой", voice: russianVoice});
            }
            else{
                setSelected(words[cursor]);
                buttonClick(null,words[cursor]);
                inputReference.current.focus();
            }
        }
    }, [enterPress]);
    useEffect(() => {
        console.log("cursor:", cursor);
        setSelected(words[cursor]);
        cancel();
        speak({text: cursor !== -1 ? words[cursor].text : "", voice: englishVoice});
    }, [cursor]);
    useEffect(() => {
        if (words.length && hovered) {
            setCursor(words.indexOf(hovered));
        }
    }, [hovered]);

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
            for(var i=0; i<words.length; i++){
                const w = words[i];
                if(!w.correct){
                    setCurrentWord(w);
                    setCursor(i);
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

    // MAIN CONTENT OF THE PAGE:
    const ListItem = ({ word, active, setHovered }) => (
        <button
            onClick={(e) => buttonClick(e, word)}
            disabled={word.correct}
            onMouseEnter={() => setHovered(word)}
            onMouseLeave={() => setHovered(undefined)}
            className={`${active ? "active" : ""}`}
        >
            {word.text}
        </button>
    );

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
        // console.log(e.target.value);
        // console.log(word);
        setCurrentWord(word);
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
                        <ListItem
                            key={i}
                            active={i === cursor}
                            word={word}
                            setSelected={setSelected}
                            setHovered={setHovered}
                        />
                        // <button key={i}
                        //         onClick={(e) => buttonClick(e, word)}
                        //         disabled={word.correct}
                        // >
                        //     {word.text}
                        // </button>
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

export default WordLearn3;