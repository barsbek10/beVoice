// import React, {useState, useEffect} from 'react'
// import './MainPage.css'
// import BEE from './../../images/b.svg'
// import {useNavigate} from "react-router-dom";
// import useKeyPress from "../Assets/useKeyPress";
// import { useSpeechSynthesis} from 'react-speech-kit'
//
// const menuItems = [
//     { id: 1, name: 'Профиль'},
//     { id: 2, name: 'Уроки'},
//     { id: 3, name: 'Словарь'},
//     { id: 4, name: 'Настройки'},
//     { id: 5, name: 'Помощь'}
// ];
//
// const instructionText1 = "Нажми стрелку вниз, чтобы выбрать раздел."
// const instructionText2 = "Чтобы озвучить свой ответ нажми на пробел."
//
// const KeyboardNavigation = ({menuItems, clickHandler, content, heading, instructionTextList }) => {
//
//     const [selected, setSelected] = useState(undefined);
//     const downPress = useKeyPress("s");
//     const upPress = useKeyPress("w");
//     const enterPress = useKeyPress("Enter");
//     const spacePress = useKeyPress(" ");
//     const [firstPress, setFirstPress] = useState(true);
//     const [dummy, setDummy] = useState(true);
//     const [cursor, setCursor] = useState(-1);
//     const [hovered, setHovered] = useState(undefined);
//
//
//
//     const onEnd = () => {
//         // You could do something here after speaking has finished
//     };
//     const { speak, cancel, speaking, supported, voices } = useSpeechSynthesis({
//         onEnd,
//     });
//     const russianVoice = voices[18];
//     const englishVoice = voices[1];
//
//     // hook after component is mounted:
//     useEffect(() => {
//         if(supported) {
//             setDummy(false);
//         }
//     }, []);
//     useEffect(() => {
//         speak({text: instructionText1, voice: russianVoice});
//         speak({text: instructionText2, voice: russianVoice});
//     }, [dummy]);
//     useEffect(() => {
//         if (spacePress) {
//             console.log("space pressed");
//             speak({text: instructionText1, voice: russianVoice});
//             speak({text: instructionText2, voice: russianVoice});
//         }
//     }, [spacePress]);
//     useEffect(() => {
//         if (menuItems.length && downPress) {
//             console.log("S pressed");
//             if( firstPress && cursor === -1 ) {
//                 setFirstPress(false);
//                 setCursor(0);
//             }
//             else{
//                 setCursor(prevState =>
//                     prevState < menuItems.length - 1 ? prevState + 1 : prevState
//                 );
//             }
//         }
//     }, [downPress]);
//     useEffect(() => {
//         console.log("W pressed");
//         if (menuItems.length && upPress) {
//             setCursor(prevState => (prevState > 0 ? prevState - 1 : prevState));
//         }
//     }, [upPress]);
//     useEffect(() => {
//         console.log("ENTER pressed");
//         if (menuItems.length && enterPress) {
//             setSelected(menuItems[cursor]);
//             clickHeader(null,menuItems[cursor]);
//         }
//     }, [enterPress]);
//     useEffect(() => {
//         console.log("cursor:", cursor);
//         setSelected(menuItems[cursor]);
//         speak({text: cursor !== -1 ? menuItems[cursor].name : "", voice: russianVoice});
//     }, [cursor]);
//     useEffect(() => {
//         if (menuItems.length && hovered) {
//             setCursor(menuItems.indexOf(hovered));
//         }
//     }, [hovered]);
//
//     let navigate = useNavigate()
//
//
//
//     const ListItem = ({ item, active, setSelected, setHovered }) => (
//         <div
//             className={`container item ${active ? "active" : ""}`}
//             onClick={(e) => clickHandler(e, item)}
//             onMouseEnter={() => setHovered(item)}
//             onMouseLeave={() => setHovered(undefined)}
//         >
//             <div className={`clip-path-inset-square ${active ? "askar" : ""}`}>
//                 <h2>{item.name}</h2>
//             </div>
//         </div>
//     );
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
//                     <span>{instructionText1}</span>
//                     <span>{instructionText2}</span>
//                 </div>
//             </div>
//             <div className="m-blocks" onClick={playSound}>
//                 {menuItems.map((item, i) => (
//                     <ListItem
//                         key={item.id}
//                         active={i === cursor}
//                         item={item}
//                         setSelected={setSelected}
//                         setHovered={setHovered}
//                     />
//                 ))}
//                 {/*<svg className='svg-hex' width="0" height="0" xmlns="http://www.w3.org/2000/svg" version="1.1">*/}
//                 {/*    <defs>*/}
//                 {/*        <filter id="goo">*/}
//                 {/*            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />*/}
//                 {/*            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9" result="goo" />*/}
//                 {/*            <feComposite in="SourceGraphic" in2="goo" operator="atop" />*/}
//                 {/*        </filter>*/}
//                 {/*    </defs>*/}
//                 {/*</svg>*/}
//             </div>
//             <div className="m-bee-img">
//                 <img src={BEE} alt={'bee'}/>
//             </div>
//         </div>
//     )
// }
//
// export default KeyboardNavigation