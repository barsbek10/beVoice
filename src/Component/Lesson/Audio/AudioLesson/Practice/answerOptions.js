import React from "react";
import {useEffect, useState} from "react";
import useKeyPress from "../../../../Assets/useKeyPress";
import {useSpeechSynthesis} from "react-speech-kit";
import './Practice.css'

const AnswerOptions = ({show, questions, currentQuestion, currentAnswerOptions,handleAnswerOptionClick, handleShow }) => {

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
    const [cursor, setCursor] = useState(-1);
    const [hovered, setHovered] = useState(undefined);

    // to reset cursor on each question:
    useEffect(() => {
        console.log("cursor reset on new question");
        setCursor(-1);
    }, [currentQuestion]);
    useEffect(() => {
        if (!show && currentAnswerOptions.length && downPress) {
            console.log("AnswerOptions: S pressed");
            if( firstPress && cursor === -1 ) {
                setFirstPress(false);
                setCursor(0);
            }
            else{
                setCursor(prevState =>
                    prevState < currentAnswerOptions.length - 1 ? prevState + 1 : prevState
                );
            }
        }
    }, [downPress]);
    useEffect(() => {
        if (!show && currentAnswerOptions.length && upPress) {
            console.log("AnswerOptions: W pressed");
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
        if (!show && currentAnswerOptions.length && enterPress && cursor !== -1) {
            console.log("AnswerOptions: ENTER pressed");
            if(!show) {
                setSelected(currentAnswerOptions[cursor]);
                handleAnswerOptionClick(currentAnswerOptions[cursor].isCorrect);
                handleShow();
            }
        }
    }, [enterPress]);
    useEffect(() => {
        console.log("cursor:", cursor);
        setSelected(currentAnswerOptions[cursor]);
        cancel();
        speak({text: cursor !== -1 ? currentAnswerOptions[cursor].answerText : "", voice: englishVoice});
    }, [cursor]);
    useEffect(() => {
        if (currentAnswerOptions.length && hovered) {
            setCursor(currentAnswerOptions.indexOf(hovered));
        }
    }, [hovered]);


    // MAIN CONTENT OF THE PAGE:
    const clickHandler = (e, item) => {
        setSelected(item)
        console.log("item:", item);
        console.log("e:", e);
    }

    const ListItem = ({ answerOption, active, setSelected, setHovered }) => (
        <div
            className={`answer-block ${active ? "active" : ""}`}
            onClick={() => handleAnswerOptionClick(answerOption.isCorrect)}
            onMouseEnter={() => setHovered(answerOption)}
            onMouseLeave={() => setHovered(undefined)}
        >
            <h3 onClick={() => handleShow()}>{answerOption.answerText}</h3>
        </div>
    );

    return (
        <>
            {questions[currentQuestion].answerOptions.map((answerOption, i) => (
                <ListItem
                    key={i}
                    active={i === cursor}
                    answerOption={answerOption}
                    setSelected={setSelected}
                    setHovered={setHovered}
                />
            ))}
        </>
    );
};
export default AnswerOptions;