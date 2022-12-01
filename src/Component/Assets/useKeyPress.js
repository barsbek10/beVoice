import React, { useState, useEffect } from "react";

const useKeyPress = (targetKey) => {
    const [keyPressed, setKeyPressed] = useState(false);

    function downHandler(e) {
        if (e.key === targetKey) {
            setKeyPressed(true);
        }
        switch (e.key) {
            case "ArrowDown":
            case "ArrowUp":
                e.preventDefault();
                break;
        }
    }

    const upHandler = ({ key }) => {
        if (key === targetKey) {
            setKeyPressed(false);
        }
        // else {
        //     console.log(key, "was pressed")
        // }
    };

    useEffect(() => {
        window.addEventListener("keydown", downHandler);
        window.addEventListener("keyup", upHandler);

        return () => {
            window.removeEventListener("keydown", downHandler);
            window.removeEventListener("keyup", upHandler);
        };
    });

    return keyPressed;
};

export default useKeyPress;