import React, { useState, useEffect } from "react";

import "./styles.css";

const useKeyPress = function(targetKey) {
    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler({ key }) {
        if (key === targetKey) {
            setKeyPressed(true);
        }
    }

    const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
    };

    React.useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    });

    return keyPressed;
};

const items = [
    { id: 1, name: "Josh Weir" },
    { id: 2, name: "Sarah Weir" },
    { id: 3, name: "Alicia Weir" },
    { id: 4, name: "Doo Weir" },
    { id: 5, name: "Grooft Weir" }
];

const ListItem = ({ item, active, setSelected, setHovered }) => (
    <div
        className={`item ${active ? "active" : ""}`}
        onClick={() => setSelected(item)}
        onMouseEnter={() => setHovered(item)}
        onMouseLeave={() => setHovered(undefined)}
    >
        {item.name}
    </div>
);

const ListExample = () => {
    const [selected, setSelected] = useState(undefined);
    const downPress = useKeyPress("ArrowDown");
    const upPress = useKeyPress("ArrowUp");
    const enterPress = useKeyPress("Enter");
    const [cursor, setCursor] = useState(0);
    const [hovered, setHovered] = useState(undefined);

    useEffect(() => {
        if (items.length && downPress) {
            setCursor(prevState =>
                prevState < items.length - 1 ? prevState + 1 : prevState
            );
        }
    }, [downPress]);
    useEffect(() => {
        if (items.length && upPress) {
            setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
        }
    }, [upPress]);
    useEffect(() => {
        if (items.length && enterPress) {
            setSelected(items[cursor]);
        }
    }, [cursor, enterPress]);
    useEffect(() => {
        if (items.length && hovered) {
            setCursor(items.indexOf(hovered));
        }
    }, [hovered]);

    return (
        <div>
            <p>
                <small>
                    Use up down keys and hit enter to select, or use the mouse
                </small>
            </p>
            <span>Selected: {selected ? selected.name : "none"}</span>
            {items.map((item, i) => (
                <ListItem
                    key={item.id}
                    active={i === cursor}
                    item={item}
                    setSelected={setSelected}
                    setHovered={setHovered}
                />
            ))}
        </div>
    );
};
export default ListExample;




// import React from 'react'
// import './MainPage.css'
// import BEE from './../../images/b.svg'
// import {useNavigate} from "react-router-dom";
// import useKeyPress from "../Assets/useKeyPress";
// import {useEffect, useState} from "@types/react";
//
//
// const hexagonText = ['Профиль', 'Уроки', 'Словарь', 'Настройки', 'Помощь']
//
// const MainPage = () => {
//
//     const [selected, setSelected] = useState(undefined);
//     const downPress = useKeyPress("ArrowDown");
//     const upPress = useKeyPress("ArrowUp");
//     const enterPress = useKeyPress("Enter");
//     const [cursor, setCursor] = useState(0);
//     const [hovered, setHovered] = useState(undefined);
//
//     useEffect(() => {
//         if (hexagonText.length && downPress) {
//             setCursor(prevState =>
//                 prevState < hexagonText.length - 1 ? prevState + 1 : prevState
//             );
//         }
//     }, [downPress]);
//     useEffect(() => {
//         if (hexagonText.length && upPress) {
//             setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
//         }
//     }, [upPress]);
//     useEffect(() => {
//         if (hexagonText.length && enterPress) {
//             setSelected(hexagonText[cursor]);
//         }
//     }, [cursor, enterPress]);
//     useEffect(() => {
//         if (hexagonText.length && hovered) {
//             setCursor(hexagonText.indexOf(hovered));
//         }
//     }, [hovered]);
//
//     let navigate = useNavigate()
//
//     const clickHeader = e => {
//         if (e.target.textContent === 'Профиль') {
//             navigate('/')
//         } else if (e.target.textContent === 'Уроки') {
//             navigate('/lesson')
//         } else if (e.target.textContent === 'Словарь') {
//             navigate('/')
//         } else if (e.target.textContent === 'Настройки') {
//             navigate('/')
//         } else if (e.target.textContent === 'Помощь') {
//             navigate('/')
//         }
//     }
//
//     let showText = hexagonText.map((text, i) => {
//         return (
//             <a href={`#${i}`} key={i}>
//                 <div className='container' onClick={clickHeader}>
//                     <div className='clip-path-inset-square'>
//                         <h2>{text}</h2>
//                     </div>
//                 </div>
//             </a>
//         )
//     })
//
//     const context = new window.AudioContext();
//     const playFile = (filepath) => {
//         fetch(filepath)
//             .then(response => response.arrayBuffer())
//             .then(arrayBuffer => context.decodeAudioData(arrayBuffer))
//             .then(audioBuffer => {
//                 const soundSource = context.createBufferSource();
//                 soundSource.buffer = audioBuffer;
//                 soundSource.connect(context.destination);
//                 soundSource.start();
//             });
//     }
//
//     const playSound = () => {
//         playFile('https://s3-us-west-2.amazonaws.com/s.cdpn.io/3/success.mp3');
//     }
//
//     return (
//         <div className='m-wrapper'>
//             <div className='m-text'>
//                 <h1>Ты на главной странице</h1>
//                 <div className="m-flex">
//                     <span>Нажми стрелку вниз, чтобы выбрать раздел.</span>
//                     <span>Чтобы озвучить свой ответ нажми на пробел.</span>
//                 </div>
//             </div>
//             <div className="m-blocks" onClick={playSound}>
//                 {showText}
//                 <svg className='svg-hex' width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">
//                     <defs>
//                         <filter id="goo">
//                             <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
//                             <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />
//                             <feComposite in="SourceGraphic" in2="goo" operator="atop" />
//                         </filter>
//                     </defs>
//                 </svg>
//             </div>
//             <div className="m-bee-img">
//                 <img src={BEE} alt={'bee'}/>
//             </div>
//         </div>
//     )
// }
//
// export default MainPage