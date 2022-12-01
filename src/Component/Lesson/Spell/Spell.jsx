import React from "react"
import AlBee from './../../../images/AudioLesson_bee.svg'
import {useNavigate} from "react-router-dom";
import Heading from "../../Assets/heading";
import {useEffect, useState} from "react";
import useKeyPress from "../../Assets/useKeyPress";
import {useSpeechSynthesis} from "react-speech-kit";

const menuItems = [
    { id: 1, name: 'Алфавит'},
    { id: 2, name: 'Слова'}
    // { id: 3, name: 'Выбрать голос'}
];

const heading = "Выбери изучение алфавита или слов";
const instructionTextList = ["Нажми стрелку вниз или вверх, чтобы выбрать раздел.",
    "Чтобы войти внутрь раздела, нажми энтер."];

const Spell = () => {
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
        if (item.name === 'Алфавит') {
            navigate('/alphabet')
        } else if (item.name === 'Слова') {
            navigate('/words')
        } else if (item.name === 'Выбрать голос') {
            navigate('/voice')
        }
    }

    const ListItem = ({ item, active, setSelected, setHovered }) => (
        <div
            onClick={(e) => clickHandler(e, item)}
            onMouseEnter={() => setHovered(item)}
            onMouseLeave={() => setHovered(undefined)}
        >
            <div className={`al-block ${active ? "active" : ""}`}>
                <h2>{item.name}</h2>
            </div>
        </div>
    );

    return(
        <div className='al-wrapper'>
            <div className="al-img">
                <img src={AlBee} alt='bee'/>
            </div>

            <div className="al-blocks">
                <div className="al-text">
                    <Heading
                        heading={heading} instructionTextList={instructionTextList}>
                    </Heading>
                </div>
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
        </div>
    )
}

export default Spell