import React from 'react';
import NeedsAuthorizationError from "../../reddit/error/needs-authorization-error";
import {Login} from "./login";

export const Error = (props) => {
    if (props.error instanceof NeedsAuthorizationError) {
        return (
            <Login/>
        );
    }

    return (
        <div className="error">
            <div className="error__message">
                Error<br/>
                <a href="/">Try again</a>
            </div>
        </div>
    );
};