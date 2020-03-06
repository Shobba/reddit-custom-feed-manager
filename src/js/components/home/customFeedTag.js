import React from "react";

export default class CustomFeedTag extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            clicked: false
        };

        this.ref = React.createRef();
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside);
    }

    handleClickOutside = (event) => {
        if (this.ref && this.ref.current !== event.target) {
            this.setState(prevState => ({
                ...prevState,
                clicked: false
            }));
        }
    };

    clicked = () => {
        if (!this.state.clicked) {
            this.setState(prevState => ({
                ...prevState,
                clicked: true
            }));
            return;
        }

        this.props.onRemove(this.props.feed);
    };

    getClassNames = () => {
        const classNames = ["custom-feed-tag"];

        if (this.state.clicked) {
            classNames.push("custom-feed-tag--clicked");
        }

        return classNames;
    };

    render() {
        return (
            <div ref={this.ref} className={this.getClassNames().join(" ")} onClick={this.clicked} >
                {this.props.feed.getName()}
            </div>
        );
    }
}