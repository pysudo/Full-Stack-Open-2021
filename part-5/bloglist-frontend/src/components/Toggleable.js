import React, { useImperativeHandle, useState } from "react";
import PropTypes from "prop-types";


const Toggleable = React.forwardRef((props, ref) => {
    const [visibility, setVisibility] = useState(false);

    const hideWhenVisible = { display: visibility ? "none" : "" };
    const showWhenVisible = { display: visibility ? "" : "none" };

    useImperativeHandle(ref, () => {
        return { setVisibility };
    });

    return (
        <>
            <div style={showWhenVisible}>
                {props.children}
                <button type="button" onClick={() => setVisibility(false)}>
                    cancel
                </button>
            </div>
            <button
                id="btnToggleBlogForm"
                style={hideWhenVisible}
                onClick={() => setVisibility(true)}
            >
                {props.buttonLabel}
            </button>
        </>
    );
});


Toggleable.displayName = "Toggleable";
Toggleable.propTypes = {
    buttonLabel: PropTypes.string.isRequired
};

export default Toggleable;