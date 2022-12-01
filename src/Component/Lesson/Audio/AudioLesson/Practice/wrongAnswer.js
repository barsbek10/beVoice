import React from "react";
import {useEffect, useState} from "react";
import useKeyPress from "../../../../Assets/useKeyPress";
import {useSpeechSynthesis} from "react-speech-kit";
import './Practice.css'
import {Button, Modal} from "react-bootstrap";
import leftBee from "../../../../../images/left-incorrect.svg";
import circleRed from "../../../../../images/circle_modul.svg";
import rightBee from "../../../../../images/right-incorrect.svg";

const menuItems = [
    {
        text: "Попробовать еще раз",
        isTryAgain: true
    },
    {
        text: "Следующий вопрос",
        isTryAgain: false
    }
]

const instructionTextList = ['Нажми стрелку вниз или вверх, чтобы',
    'выбрать действие"'];

const WrongAnswer= ({ show, handleClose, handleTryAgain, handleIncorrectMoveToNext }) => {

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
        speak({text: menuItems[1].text, voice: russianVoice});
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
    // handle press of "w" button:
    useEffect(() => {
        if (show && menuItems.length===2 && downPress) {
            console.log("WrongAnswer: S pressed");
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
        if (show && menuItems.length===2 && upPress) {
            console.log("WrongAnswer: W pressed");
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
        if (show && menuItems.length===2 && enterPress) {
            console.log("WrongAnswer: ENTER pressed");
            if(cursor === -1) {
                console.log("\tENTER with cursor -1");
                // voiceNextQuestion();
                setCursor(1);
                handleIncorrectMoveToNext();
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
                variant={item.isTryAgain ? 'secondary' : 'primary'}
                onClick={()=> handleButtonClick(item)}
                onMouseEnter={() => setHovered(item)}
                onMouseLeave={() => setHovered(undefined)}
        >
            {item.text}
        </Button>
    );

    const handleButtonClick = (item) => {
        setSelected(item);
        if(item.isTryAgain){
            handleTryAgain();
        }
        else{
            handleIncorrectMoveToNext();
        }
    }

    return (
        <Modal show={show} onHide={handleClose} className='overlay_background'>
            <div className="overlay_card">
                <Modal.Header >
                    <Modal.Title className='overlay_title_true'>
                        <h2>Неправильный ответ</h2>
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
                    <img src={leftBee}/>
                    <img src={circleRed}/>
                    <img src={rightBee}/>
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
                    {/*<Button className='btn_incorrect' variant="secondary" onClick={()=>handleTryAgain()}>*/}
                    {/*    Попробовать еще раз*/}
                    {/*</Button>*/}
                    {/*<Button className='btn_incorrect' variant="primary" onClick={()=>handleIncorrectMoveToNext()}>*/}
                    {/*    Следующий вопрос*/}
                    {/*</Button>*/}
                </Modal.Footer>
            </div>
        </Modal>
    );
};
export default WrongAnswer;