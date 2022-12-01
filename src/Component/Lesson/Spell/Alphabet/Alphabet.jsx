import React from "react"
import Heading from "../../../Assets/heading";
import {useEffect, useState} from "react";
import useKeyPress from "../../../Assets/useKeyPress";
import {useSpeechSynthesis} from "react-speech-kit";

const alphabet_words = {
    "A": 'apple',
    "B": 'ball',
    "C": 'cat',
    "D": 'dog',
    "E": 'elephant',
    "F": 'fish',
    "G": 'grapes',
    "H": 'hen',
    "I": 'ice cream',
    "J": 'jacket',
    "K": 'kite',
    "L": 'lion',
    "M": 'monkey',
    "N": 'nut',
    "O": 'orange',
    "P": 'pen',
    "Q": 'queen',
    "R": 'rabbit',
    "S": 'sun',
    "T": 'tiger',
    "U": 'umbrella',
    "V": 'van',
    "W": 'watch',
    "X": 'xylophone',
    "Y": 'yogurt',
    "Z": 'zebra'
}

const alphabet = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];


const heading = "Английский алфавит";
const instructionTextList = ["Нажми на кнопку, чтобы прослушать соответствующую букву",
    "Нажми стрелку вниз или вверх, чтобы пролистать буквы."];

const Alphabet = () => {

    // KEYBOARD NAVIGATION HOOKS:
    const [selected, setSelected] = useState(undefined);
    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const enterPress = useKeyPress("Enter");
    const controlPress = useKeyPress("Control");
    const [firstPress, setFirstPress] = useState(true);
    const [dummy, setDummy] = useState(true);
    const [cursor, setCursor] = useState(-1);
    const [hovered, setHovered] = useState(undefined);

    // any key press detect:
    function downHandler(e) {
        const key = e.key.toUpperCase();
        if(alphabet_words && alphabet_words[key]) {
            // speak({text: key, voice: englishVoice});
            // speak({text: alphabet_words[key], voice: englishVoice});
            const findCursor = alphabet.indexOf(key);
            setCursor(findCursor);
        }
    }
    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        return () => {
            window.removeEventListener("keydown", downHandler);
        };
    });

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
        if (controlPress) {
            console.log("Control pressed");
            speak({text: heading, voice: russianVoice});
            instructionTextList.forEach(text => speak({text: text, voice: russianVoice}) );
        }
    }, [controlPress]);
    useEffect(() => {
        if (alphabet.length && downPress) {
            console.log("S pressed");
            if( firstPress && cursor === -1 ) {
                setFirstPress(false);
                setCursor(0);
            }
            else{
                setCursor(prevState =>
                    prevState < alphabet.length - 1 ? prevState + 1 : prevState
                );
            }
        }
    }, [downPress]);
    useEffect(() => {
        console.log("W pressed");
        if (alphabet.length && upPress) {
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
        if (alphabet.length && enterPress && cursor !== -1) {
            setSelected(alphabet[cursor]);
            clickHandler(alphabet[cursor]);
        }
    }, [enterPress]);
    useEffect(() => {
        console.log("cursor:", cursor);
        setSelected(alphabet[cursor]);
        cancel();
        speak({text: cursor !== -1 ? alphabet[cursor] : "", voice: englishVoice});
        speak({text: cursor !== -1 ? alphabet_words[alphabet[cursor]] : "", voice: englishVoice});
    }, [cursor]);
    useEffect(() => {
        if (alphabet.length && hovered) {
            setCursor(alphabet.indexOf(hovered));
        }
    }, [hovered]);

    // SPEECH SYNTHESIS:
    const onEnd = () => {
        // You could do something here after speaking has finished
    };
    const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
        onEnd,
    });
    const russianVoice = voices[18];
    const englishVoice = voices[0];

    // MAIN CONTENT OF THE PAGE:
    const clickHandler = (item) => {
        setSelected(item);
        // console.log("item:", item);
        // console.log("e:", e);
    }

    const ListItem = ({ item, active, setSelected, setHovered }) => (
        <div
            className='container'
            onClick={() => clickHandler( item)}
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered(undefined)}
        >
            <div className={`clip-path-inset-square ${active ? "active" : ""}`}>
                <h2>{item}</h2>
            </div>
        </div>
    );


    return (
        <div className='m-wrapper'>
            <div className='m-text'>
                <Heading
                    heading={heading} instructionTextList={instructionTextList}>
                </Heading>
            </div>
            <div className="m-blocks" >
                {alphabet.map((item, i) => (
                    <ListItem
                        key={item.id}
                        active={i === cursor}
                        item={item}
                        setSelected={setSelected}
                        setHovered={setHovered}
                    />
                ))}
            </div>
        </div>
    )
}

export default Alphabet