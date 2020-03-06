import React from 'react';
import RedditApi from "../../reddit/reddit-api";

export const Login = (props) => {
    return (
        <div className="login">
            <div className="login__wrapper">
                <button className="button" onClick={RedditApi.startAuthorizationFlow}>
                    <i className="fab fa-reddit-alien button__icon"/>
                    Login via reddit
                </button>
                <div className="login__description">
                    <div>
                        The login via reddit will request following permissions:
                    </div>
                    <div className="login__permissions">
                        <div className="permission">
                            <div className="permission__header">identity</div>
                            <div className="permission__description">Necessary to read<br />your username</div>
                        </div>
                        <div className="permission">
                            <div className="permission__header">mysubreddits</div>
                            <div className="permission__description">Necessary to get a list of<br />your subscribed subreddits</div>
                        </div>
                        <div className="permission">
                            <div className="permission__header">read</div>
                            <div className="permission__description">Necessary to get a list of<br />your custom feeds</div>
                        </div>
                        <div className="permission">
                            <div className="permission__header">subscribe</div>
                            <div className="permission__description">Necessary to edit your<br />custom feeds</div>
                        </div>
                    </div>
                    <div>
                        More information about the reddit api permissions: <a href="https://www.reddit.com/dev/api/" target="_blank">reddit.com/dev/api</a>
                    </div>
                </div>
            </div>
        </div>
    );
};