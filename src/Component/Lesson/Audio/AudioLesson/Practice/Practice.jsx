import React, { useState, useEffect } from 'react'
import smallHex from './../../../../../images/small_practice.svg'
import {Button, Modal} from "react-bootstrap"
import leftBee from './../../../../../images/left-incorrect.svg'
import rightBee from './../../../../../images/right-incorrect.svg'
import circleRed from './../../../../../images/circle_modul.svg'
import circleGreen from './../../../../../images/green-correct.svg'
import leftBeeTrue from './../../../../../images/leftBeeTrue.svg'
import rightBeeTrue from './../../../../../images/rightBeeTrue.svg'
import './Practice.css'
import useKeyPress from "../../../../Assets/useKeyPress";
import {useSpeechSynthesis} from "react-speech-kit";
import {useNavigate} from "react-router-dom";
import AnswerOptions from "./answerOptions";
import WrongAnswer from "./wrongAnswer";
import CorrectAnswer from "./correctAnswer";

const questions = [
    {
        questionText: 'Как сказать на английском “ты”?',
        answerOptions: [
            {id: 0, answerText: 'She', isCorrect: false},
            {id: 1, answerText: 'He', isCorrect: false},
            {id: 2, answerText: 'You', isCorrect: true}
        ]
    },
    {
        questionText: 'Как сказать на английском “и”?',
        answerOptions: [
            {id: 0, answerText: 'in', isCorrect: false},
            {id: 1, answerText: 'and', isCorrect: true},
            {id: 2, answerText: 'is', isCorrect: false}
        ]
    },
    {
        questionText: 'Как сказать на английском “мама”?',
        answerOptions: [
            {id: 0, answerText: 'Father', isCorrect: false},
            {id: 1, answerText: 'Mother', isCorrect: true},
            {id: 2, answerText: 'Son', isCorrect: false}
        ]
    },
    {
        questionText: 'Как сказать на английском “она”?',
        answerOptions: [
            {id: 0, answerText: 'She', isCorrect: true},
            {id: 1, answerText: 'He', isCorrect: false},
            {id: 2, answerText: 'I', isCorrect: false}
        ]
    },
    {
        questionText: 'Как сказать на английском “яблоко”?',
        answerOptions: [
            {id: 0, answerText: 'Tree', isCorrect: false},
            {id: 1, answerText: 'Apple', isCorrect: true},
            {id: 2, answerText: 'Sun', isCorrect: false}
        ]
    },
    {
        questionText: 'Как сказать на английском “книга ”?',
        answerOptions: [
            {id: 0, answerText: 'Moon', isCorrect: false},
            {id: 1, answerText: 'Look', isCorrect: false},
            {id: 2, answerText: 'Book', isCorrect: true}
        ]
    },
    {
        questionText: 'Как сказать на английском “ручка”?',
        answerOptions: [
            {id: 0, answerText: 'a pen', isCorrect: true},
            {id: 1, answerText: 'a car', isCorrect: false},
            {id: 2, answerText: 'ice', isCorrect: false}
        ]
    },
    {
        questionText: 'Как сказать на английском “один”?',
        answerOptions: [
            {id: 0, answerText: 'Two', isCorrect: false},
            {id: 1, answerText: 'Odin', isCorrect: false},
            {id: 2, answerText: 'One', isCorrect: true}
        ]
    },
    {
        questionText: 'Как сказать на английском “кошка”?',
        answerOptions: [
            {id: 0, answerText: 'Dog', isCorrect: false},
            {id: 1, answerText: 'Cat', isCorrect: true},
            {id: 2, answerText: 'Cow', isCorrect: false}
        ]
    },
    {
        questionText: 'Как сказать на английском “воздух”?',
        answerOptions: [
            {id: 0, answerText: 'Ice', isCorrect: false},
            {id: 1, answerText: 'Hen', isCorrect: false},
            {id: 2, answerText: 'Air', isCorrect: true}
        ]
    },
]

const instructionTextList = ['Нажми на пробел, чтобы озвучить вопрос.',
    'Чтобы выбрать ответ нажми стрелку вниз или вверх"'];
const onCorrectAnswer = "Правильный ответ";
const onWrongAnswer = "Неправильный ответ";

export default function Practice () {

    // SPEECH SYNTHESIS:
    const onEnd = () => {
        // You could do something here after speaking has finished
    };
    const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
        onEnd,
    });
    const russianVoice = voices[18];

    // TEST LOGIC:
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [showScore, setShowScore] = useState(false);
    const [score, setScore] = useState(0)
    const [show, setShow] = useState(false)
    const [incorrectAnswer, setIncorrectAnswer] = useState(false)
    const [currentAnswerOptions, setCurrentAnswerOptions] = useState([]);

    useEffect(() => {
        console.log("currentQuestion", currentQuestion);
        setCurrentAnswerOptions(questions[currentQuestion].answerOptions);
    }, [currentQuestion]);
    const nextQuestion = () => {
        const nextQuestion = currentQuestion + 1
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion)
        } else {
            setShowScore(true)
        }
    }
    const handleClose = () => setShow(false)
    const handleShow = () => setShow(true)
    const handleTryAgain = () => {
        handleClose();
    }
    const handleIncorrectMoveToNext = () => {
        nextQuestion();
        handleClose();
    }

    const handleAnswerOptionClick = (isCorrect) => {
        console.log("isCorrect", isCorrect);
        if (isCorrect) {
            setScore(score + 1);
            setIncorrectAnswer(false);
            speak({text: onCorrectAnswer, voice: russianVoice})
            nextQuestion();
        } else {
            setIncorrectAnswer(true);
            speak({text: onWrongAnswer, voice: russianVoice})
        }
    }

    const indicatorBg = (index) => {
        if (currentQuestion > index) {
            return "#D8D8D8";
        } else if (currentQuestion === index) {
            return "#FDD615";
        } else {
            return "#D8D8D8";
        }
    };

    // KEYBOARD NAVIGATION HOOKS:
    const spacePress = useKeyPress(" ");
    const controlPress = useKeyPress("Control");
    const [dummy, setDummy] = useState(true);
    // hook after component is mounted:
    useEffect(() => {
        if(supported) {
            setDummy(false);
        }
    }, []);
    useEffect(() => {
        instructionTextList.forEach(text => speak({text: text, voice: russianVoice}) );
    }, [dummy]);
    //
    useEffect(() => {
        if (spacePress && !show) {
            console.log("space pressed");
            speak({text: questions[currentQuestion].questionText, voice: russianVoice}) ;
        }
    }, [spacePress]);
    useEffect(() => {
        if (controlPress && !show) {
            instructionTextList.forEach(text => speak({text: text, voice: russianVoice}) );
        }
    }, [controlPress]);

    return (
        <div className='l-wrapper'>
            {showScore ? (
                <div className='score-section'>
                    You scored <span className='score-span'>{score}</span> out of <span className='score-span'>{questions.length}</span>
                </div>
            ) : (
                <>
                    <div className='question-section'>
                        <div className='question-count'>
                            <img src={smallHex} alt={smallHex}/> <span>Очки: {score} / {questions ? questions.length : null}</span>
                            <div className="indicator">
                                <span style={{marginRight: '5px'}}>Вопрос №{currentQuestion+1}</span>
                                {questions.map((q, id) => {
                                    return (
                                        <span
                                            className="indicator-item"
                                            key={id}
                                            style={{
                                                backgroundColor: indicatorBg(id)
                                            }}
                                        />
                                    );
                                })}
                            </div>
                        </div>
                        <div className="m-flex">
                            {instructionTextList.map((text, i) => {
                                return (
                                    <span key={i}>{text}</span>
                                )
                            })}
                        </div>
                        <div className='question-text'>
                            <h2>{questions[currentQuestion].questionText}</h2>
                        </div>
                    </div>
                    <div className='answer-section'>
                        <AnswerOptions
                            questions={questions}
                            currentQuestion={currentQuestion}
                            currentAnswerOptions={currentAnswerOptions}
                            handleShow={handleShow}
                            handleAnswerOptionClick={handleAnswerOptionClick}
                            show={show}
                        >
                        </AnswerOptions>
                        {/*{questions[currentQuestion].answerOptions.map((answerOption, i) => (*/}
                        {/*    <div className='answer-block' key={i} onClick={() =>*/}
                        {/*        handleAnswerOptionClick(answerOption.isCorrect)}>*/}
                        {/*        <h3 onClick={handleShow}>{answerOption.answerText}</h3>*/}
                        {/*    </div>*/}
                        {/*))}*/}
                    </div>
                </>
            )}
            {incorrectAnswer
                ? <WrongAnswer
                    show={show}
                    handleClose={handleClose}
                    handleTryAgain={handleTryAgain}
                    handleIncorrectMoveToNext={handleIncorrectMoveToNext}
                >
                </WrongAnswer>
                : <CorrectAnswer
                    show={show}
                    handleClose={handleClose}
                >
                </CorrectAnswer>
            }
        </div>
    );
}