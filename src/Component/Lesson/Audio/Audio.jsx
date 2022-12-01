import React, {useState} from 'react'
import {useNavigate} from "react-router-dom";
import audioBee from './../../../images/audio_bee.svg'

import './Audio.css'
import useKeyPress from "../../Assets/useKeyPress";
import {useEffect} from "react";
import {useSpeechSynthesis} from "react-speech-kit";
import Heading from "../../Assets/heading";

const menuItems = [
    { id: 1, name: 'Первая часть'},
    { id: 2, name: 'Вторая часть'},
    { id: 3, name: 'Третья часть'},
    { id: 4, name: 'Четвертая часть'},
    { id: 5, name: 'Пятая часть'},
    { id: 6, name: 'Шестая часть'},
    { id: 7, name: 'Седьмая часть'},
    { id: 8, name: 'Восьмая часть'},
    { id: 9, name: 'Девятая часть'},
    { id: 10, name: 'Десятая часть'}
];

const heading = "Выбери доступную категорию уроков";
const instructionTextList = ["Нажми стрелку вниз или вверх, чтобы выбрать раздел.",
    "Чтобы войти внутрь раздела, нажми энтер."];

const Audio = () => {
    const [style, setStyle] = useState({display: 'none'});
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

    // MAIN CONTENT OF THE PAGE:
    const clickHandler = (e, item) => {
        setSelected(item)
        console.log("item:", item);
        console.log("e:", e);
        if (item.name === 'Первая часть') {
            navigate('/audioLesson')
        } else if (item.name === 'Вторая часть') {
            navigate('/audioLesson')
        } else if (item.name === 'Третья часть') {
            navigate('/audioLesson')
        }
    }

    const ListItem = ({ item, active, setSelected, setHovered }) => (
        <div
            className='a-link cursorPointer'
            onClick={(e) => clickHandler(e, item)}
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered(undefined)}
        >
            <div className={`a-block ${active ? "active" : ""}`}>
                <h2>{item.name}</h2>
            </div>
        </div>
    );

    return(
        <div className='l-wrapper'>
            <div className='m-text'>
                <Heading
                    heading={heading} instructionTextList={instructionTextList}>
                </Heading>
            </div>
            <div className='l-blocks'
                 onMouseEnter={e => {
                     setStyle({display: 'none'});
                 }}
                 onMouseLeave={e => {
                     setStyle({display: 'block'})
                 }}
            >
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
            <div className="audio-img">
                <img className='rightBee' src={audioBee} alt='Bee' style={style}/>
            </div>
        </div>
    )
}
export default Audio