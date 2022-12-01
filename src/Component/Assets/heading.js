import React from "react";

const Heading = ({heading, instructionTextList}) => {
    return (
        <>
            <h1>{heading}</h1>
            <div className="m-flex">
                {instructionTextList.map((text, i) => {
                    return (
                        <span key={i}>{text}</span>
                    )
                })}
            </div>
        </>
    );
};
export default Heading;