import React from 'react';

const Header = (props) => (
    <div className="header">
        <div className="header__left">
            <div className="header-title__short">RCFM</div>
            <div className="header-title__long">Reddit Custom Feed Manager</div>
        </div>
        {props.userInfo &&
            <div className="header__right">
                <i className="fab fa-reddit-alien header__icon"/>
                <span className="header__name">/u/{props.userInfo.getName()}</span>
            </div>
        }
    </div>
);

export default Header;