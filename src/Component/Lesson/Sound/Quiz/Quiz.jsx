import React, {useState, useEffect} from 'react'
import RainBG from '../../../../images/sound_bg.png'
import CityBG from '../../../../images/City_bg.png'
import smallHex from "../../../../images/small_practice.svg";
import citySound from "../../../Assets/sounds/city-traffic.mp3";
import './QuizGame.css'
import '../../Audio/AudioLesson/Practice/Practice.css'
import {useSpeechSynthesis} from "react-speech-kit";
import useKeyPress from "../../../Assets/useKeyPress";
import AnswerOptions from "../../Audio/AudioLesson/Practice/answerOptions";
import {Button, Modal} from "react-bootstrap";
import leftBee from "../../../../images/left-incorrect.svg";
import circleRed from "../../../../images/circle_modul.svg";
import rightBee from "../../../../images/right-incorrect.svg";
import leftBeeTrue from "../../../../images/leftBeeTrue.svg";
import circleGreen from "../../../../images/green-correct.svg";
import rightBeeTrue from "../../../../images/rightBeeTrue.svg";
import WrongAnswer from "../../Audio/AudioLesson/Practice/wrongAnswer";
import CorrectAnswer from "../../Audio/AudioLesson/Practice/correctAnswer";

const questions = [
    {
        background: RainBG,
        audio: 'https://moritzgiessmann.de/birdwindandfire/audio/rain-loop.flac',
        answerOptions: [
            {id: 0, answerText: 'Rain', isCorrect: true},
            {id: 1, answerText: 'Snow', isCorrect: false},
            {id: 2, answerText: 'Wind', isCorrect: false}
        ]
    },
    {
        background: CityBG,
        audio: citySound,
        answerOptions: [
            {id: 0, answerText: 'Island', isCorrect: false,},
            {id: 1, answerText: 'City', isCorrect: true},
            {id: 2, answerText: 'Beach', isCorrect: false}
        ]
    }
]

const instructionTextList = ["Выбери правильную ассоциацию для звука",
    "Нажми пробел, чтобы воспроизвести или приостановить звук",
    'Чтобы выбрать ответ нажми стрелку вниз или вверх"'];
const onCorrectAnswer = "Правильный ответ";
const onWrongAnswer = "Неправильный ответ";

const Quiz = () => {

    // SPEECH SYNTHESIS:
    const onEnd = () => {
        // You could do something here after speaking has finished
    };
    const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
        onEnd,
    });
    const russianVoice = voices[18];

    // QUESTION AUDIO CONTROL:
    var audioPlayer = document.getElementById("audioController");
    const [playing, setPlaying] = useState(false)
    function togglePlay() {
        if(playing) {
            audioPlayer.pause();
            setPlaying(!playing);
        } else {
            audioPlayer.play();
            setPlaying(!playing);
        }
    };

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
            togglePlay();
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
                    <img src={questions[currentQuestion].background} className='background-image'/>
                    <div className='question-section'>
                        <div className='sound-question-count'>
                            <img src={smallHex} alt={smallHex}/> <span>Очки:  {score} / {questions ? questions.length : null}</span>
                        </div>
                        <div className='sound-question-text'>
                            {instructionTextList.map((text, i) => {
                                return (
                                    <span key={i}>{text}</span>
                                )
                            })}
                            <h2>{questions[currentQuestion].questionText}</h2>
                        </div>
                    </div>
                    <div className='answer-section'>
                        <div>
                            <audio id='audioController' className='question-audio' src={questions[currentQuestion].audio} loop controls />
                        </div>
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

export default Quiz
