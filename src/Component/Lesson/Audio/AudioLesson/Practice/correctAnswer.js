import React from "react";
import {useEffect, useState} from "react";
import useKeyPress from "../../../../Assets/useKeyPress";
import {useSpeechSynthesis} from "react-speech-kit";
import './Practice.css'
import {Button, Modal} from "react-bootstrap";
import leftBee from "../../../../../images/left-incorrect.svg";
import circleRed from "../../../../../images/circle_modul.svg";
import rightBee from "../../../../../images/right-incorrect.svg";
import leftBeeTrue from "../../../../../images/leftBeeTrue.svg";
import circleGreen from "../../../../../images/green-correct.svg";
import rightBeeTrue from "../../../../../images/rightBeeTrue.svg";

const menuItems = [
    {
        text: "Следующий вопрос"
    }
]

const instructionTextList = ['Нажми стрелку вниз или вверх, чтобы',
    'выбрать действие"'];

const CorrectAnswer= ({ show, handleClose }) => {

    // SPEECH SYNTHESIS:
    const onEnd = () => {
        // You could do something here after speaking has finished
    };
    const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
        onEnd,
    });
    const russianVoice = voices[18];
    const englishVoice = voices[0];
    const voiceNextQuestion = () => {
        speak({text: menuItems[0].text, voice: russianVoice});
    }

    // KEYBOARD NAVIGATION HOOKS:
    const [selected, setSelected] = useState(undefined);
    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const enterPress = useKeyPress("Enter");
    const controlPress = useKeyPress("Control");
    const [firstPress, setFirstPress] = useState(true);
    const [cursor, setCursor] = useState(-1);
    const [hovered, setHovered] = useState(undefined);

    // to reset cursor on each question:
    useEffect(() => {
        if(show) {
            // console.log("cursor reset on each time dialog is opened"); // DEBUG
            setCursor(-1);
        }
    }, [show]);
    useEffect(() => {
        if (show && menuItems.length===1 && downPress) {
            console.log("CorrectAnswer: S pressed");
            if( firstPress && cursor === -1 ) {
                setFirstPress(false);
                setCursor(0);
            }
            else{
                setCursor(prevState =>
                    prevState < menuItems.length - 1 ? prevState + 1 : prevState
                );
            }
        }
    }, [downPress]);
    useEffect(() => {
        if (show && menuItems.length===1 && upPress) {
            console.log("CorrectAnswer: W pressed");
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
        if (show && menuItems.length===1 && enterPress) {
            console.log("CorrectAnswer: ENTER pressed");
            if(cursor === -1) {
                console.log("\tENTER with cursor -1");
                handleClose();
                voiceNextQuestion();
            }else {
                setSelected(menuItems[cursor]);
                handleButtonClick(menuItems[cursor]);
            }
            // handleShow();
            // handleAnswerOptionClick(menuItems[cursor].isCorrect);
        }
    }, [enterPress]);
    useEffect(() => {
        console.log("cursor:", cursor);
        setSelected(menuItems[cursor]);
        cancel();
        speak({text: cursor !== -1 ? menuItems[cursor].text : "", voice: russianVoice});
    }, [cursor]);
    useEffect(() => {
        if (menuItems.length && hovered) {
            setCursor(menuItems.indexOf(hovered));
        }
    }, [hovered]);
    // handle press of "Control" button
    useEffect(() => {
        if (controlPress && show) {
            instructionTextList.forEach(text => speak({text: text, voice: russianVoice}) );
        }
    }, [controlPress]);


    const ListItem = ({ item, active }) => (
        <Button className={`btn_incorrect ${active ? "active" : ""}`}
                variant='primary'
                onClick={()=> handleButtonClick(item)}
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered(undefined)}
        >
            {item.text}
        </Button>
    );

    const handleButtonClick = (item) => {
        setSelected(item);
        handleClose();
    }

    return (
        <Modal show={show} onHide={handleClose} className='overlay_background'>
            <div className="overlay_card">
                <Modal.Header >
                    <Modal.Title className='overlay_title_false'>
                        <h2>Правильный ответ</h2>
                        <div className="overlay_p">
                            {instructionTextList.map((text, i) => {
                                return (
                                    <span key={i}>{text}</span>
                                )
                            })}
                        </div>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className='incorrect-bee'>
                    <img src={leftBeeTrue}/>
                    <img src={circleGreen}/>
                    <img src={rightBeeTrue}/>
                </Modal.Body>
                <Modal.Footer className='buttons'>
                    {menuItems.map((item, i) => (
                        <ListItem
                            key={i}
                            item={item}
                            active={i === cursor}
                            setSelected={setSelected}
                            setHovered={setHovered}
                        >
                        </ListItem>
                    ))
                    }
                </Modal.Footer>
            </div>
        </Modal>
    );
};
export default CorrectAnswer;