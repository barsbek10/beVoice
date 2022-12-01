import React from 'react'
import LOGO from '../../images/Logo.svg'
import './NavBar.css'
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import useKeyPress from "../Assets/useKeyPress";


const NavBar = () => {

    const [selected, setSelected] = useState(undefined);
    const escapePress = useKeyPress("Escape");
    const backspacePress = useKeyPress("Backspace");

    const goBackOrMain = () => {
        window.location.pathname !== "/" ? navigate(-1) : mainPage();
    }

    useEffect(() => {
        if (escapePress) {
            console.log("Escape pressed");
            goBackOrMain();
        }
    }, [escapePress]);
    useEffect(() => {
        if (backspacePress) {
            console.log("Backspace pressed");
            // goBackOrMain();
        }
    }, [backspacePress]);

    let navigate = useNavigate()

    const mainPage = () => {
        navigate('/')
    };

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

    return (
        <div className='n-wrapper'>
            <div className='n-left'>
                { useLocation().pathname !== "/"
                    ? <div onClick={playSound}>
                            <div className='closeModal' onClick={() => navigate(-1)}><span>Назад</span></div>
                      </div>
                    : <div className='n-name'>
                           <img src={LOGO} alt={'logo'} onClick={mainPage}/>
                      </div>
                }
            </div>
        </div>
    )
}

export default NavBar