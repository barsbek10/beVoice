import React from 'react'
import {useNavigate} from "react-router-dom";
import './Lesson.css'
import Heading from "../Assets/heading";
import {useEffect, useState} from "react";
import useKeyPress from "../Assets/useKeyPress";
import {useSpeechSynthesis} from "react-speech-kit";
import BeeImage from "../Assets/beeImage";

const menuItems = [
    { id: 1, name: 'Аудио уроки'},
    { id: 2, name: 'Правописание'},
    { id: 3, name: 'Угадай Звук'}
];
const heading = "Выбери раздел для изучения";
const instructionTextList = ["Нажми стрелку вниз или вверх, чтобы выбрать раздел.",
    "Чтобы войти внутрь раздела, нажми энтер."];

const Lesson = () => {
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
        if (menuItems.length && downPress) {
            console.log("S pressed");
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
        console.log("W pressed");
        if (menuItems.length && upPress) {
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
        if (menuItems.length && enterPress && cursor !== -1) {
            setSelected(menuItems[cursor]);
            clickHandler(null,menuItems[cursor]);
        }
    }, [enterPress]);
    useEffect(() => {
        console.log("cursor:", cursor);
        setSelected(menuItems[cursor]);
        cancel();
        speak({text: cursor !== -1 ? menuItems[cursor].name : "", voice: russianVoice});
    }, [cursor]);
    useEffect(() => {
        if (menuItems.length && hovered) {
            setCursor(menuItems.indexOf(hovered));
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

    // NAVIGATION:
    let navigate = useNavigate()

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

    const clickHandler = (e, item) => {
        setSelected(item)
        console.log("item:", item);
        console.log("e:", e);
        if (item.name === 'Аудио уроки') {
            navigate('/audio')
        } else if (item.name === 'Правописание') {
            navigate('/spell')
        } else if (item.name === 'Угадай Звук') {
            navigate('/quiz')
        }
    }

    const ListItem = ({ item, active, setSelected, setHovered }) => (
        <div
            onClick={(e) => clickHandler(e, item)}
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered(undefined)}
        >
            <div className={`l-block ${active ? "active" : ""}`}>
                <h2>{item.name}</h2>
            </div>
        </div>
    );


    return (
        <div className='l-wrapper'>
            <div className='m-text'>
                <Heading
                    heading={heading} instructionTextList={instructionTextList}>
                </Heading>
            </div>
            <div className='l-blocks' onClick={playSound}>
                {menuItems.map((item, i) => (
                    <ListItem
                        key={item.id}
                        active={i === cursor}
                        item={item}
                        setSelected={setSelected}
                        setHovered={setHovered}
                    />
                ))}
            </div>
            <BeeImage></BeeImage>
        </div>
    )
}

export default Lesson