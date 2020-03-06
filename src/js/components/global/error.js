import React from 'react';
import NeedsAuthorizationError from "../../reddit/error/needs-authorization-error";
import RedditApi from "../../reddit/reddit-api";

export const Error = (props) => {
    if (props.error instanceof NeedsAuthorizationError) {
        return (
            <div className="error">
                <div className="error__message">
                    <a href="javascript:void(0);" onClick={RedditApi.startAuthorizationFlow}>Login</a>
                </div>
            </div>
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