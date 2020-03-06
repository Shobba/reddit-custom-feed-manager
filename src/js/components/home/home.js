import React from 'react';
import {Loading} from "../global/loading";
import queryString from "query-string";
import {Error as ErrorComponent} from "../global/error";
import RedditApi from "../../reddit/reddit-api";
import UserInfo from "../../reddit/models/user-info";
import Subscriptions from "../../reddit/models/subscriptions";
import CustomFeeds from "../../reddit/models/custom-feeds";
import {Subscription} from "./subscription";
import {CustomFeed} from "./customFeed";
import {DndProvider} from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

export default class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true,
            error: false,

            data: {
                userInfo: null,
                subscriptions: null,
                customFeeds: null
            }
        };
    }

    componentDidMount() {
        const parsed = queryString.parse(this.props.location.search);

        if (typeof parsed !== 'undefined' && parsed['error']) {
            this.setError(new Error(parsed['error']));
            return;
        }

        if (typeof parsed !== 'undefined' && parsed['code']) {
            RedditApi.gotAuthCode(parsed['code'])
                .then(this.onAuthorizationDone)
                .catch(this.setError);
            return;
        }

        RedditApi.authorize()
            .then(this.onAuthorizationDone)
            .catch(this.setError);
    }

    onAdd = (subscription, feed) => {
        feed.addSubscription(subscription);
        this.setState(prevState => ({...prevState}));
    };

    onRemove = (subscription, feed) => {
        feed.removeSubscription(subscription);
        this.setState(prevState => ({...prevState}));
    };

    onAuthorizationDone = () => {
        const promises = [
            RedditApi.getUserInfo(),
            RedditApi.getSubscriptions(),
            RedditApi.getCustomFeeds()
        ];

        Promise.all(promises)
            .then(responses => {
                if (!(responses[0] instanceof UserInfo)) {
                    throw new Error('instance-error-userinfo');
                }

                if (!(responses[1] instanceof Subscriptions)) {
                    throw new Error('instance-error-subscriptions');
                }

                if (!(responses[2] instanceof CustomFeeds)) {
                    throw new Error('instance-error-customfeeds');
                }

                this.setState(prevState => ({
                    ...prevState,
                    loading: false,
                    error: false,
                    userInfo: responses[0],
                    subscriptions: responses[1],
                    customFeeds: responses[2]
                }));
            })
            .catch(error => {
                console.log("catch all promises error", error, error.message);
                this.setState(prevState => ({
                    ...prevState,
                    loading: false,
                    error
                }));
            });
    };

    setError = (error) => {
        this.setState(prevState => ({
            ...prevState,
            loading: false,
            error: error
        }));
    };

    getContent = () => {
        if (this.state.loading) {
            return (<Loading/>);
        }

        if (this.state.error) {
            return (<ErrorComponent error={this.state.error}/>);
        }

        return (
            <>
                <div className="header">
                    <i className="fab fa-reddit-alien header__icon"/>
                    <span className="header__name">/u/{this.state.userInfo.getName()}</span>
                </div>

                <DndProvider backend={Backend}>
                    <div className="content">
                        <div className="column column__subscriptions">
                            <div className="column__headline">Your subscriptions</div>
                            {this.state.subscriptions.getSubscriptions().map((subscription) => {
                                return (
                                    <Subscription
                                        subscription={subscription}
                                        customFeeds={this.state.customFeeds}
                                        onAdd={this.onAdd}
                                        onRemove={this.onRemove}
                                        key={'subscription_' + subscription.getId()}
                                    />
                                )
                            })}
                        </div>
                        <div className="column column__custom-feeds">
                            <div className="fixed-custom-feeds">
                                <div className="column__headline">Your custom feeds</div>
                                {this.state.customFeeds.getFeeds().map((feed) => {
                                    return (<CustomFeed key={'customFeed_' + feed.getName()} feed={feed}/>);
                                })}
                            </div>
                        </div>
                    </div>
                </DndProvider>
            </>
        );
    };

    adjustFixedCustomFeedsWidth = () => {
        window.removeEventListener('resize', this.adjustFixedCustomFeedsWidth);
        window.addEventListener('resize', this.adjustFixedCustomFeedsWidth);

        window.requestAnimationFrame(() => {
            const fixedContainers = document.getElementsByClassName('fixed-custom-feeds');
            const parentContainers = document.getElementsByClassName('column__subscriptions');
            if (fixedContainers.length !== 1 || parentContainers.length !== 1) {
                return;
            }

            const fixedContainer = fixedContainers[0];
            const parentContainer = parentContainers[0];
            const parentPaddingLeft = parseInt(window.getComputedStyle(parentContainer, null).getPropertyValue('padding-left'));
            const parentPaddingRight = parseInt(window.getComputedStyle(parentContainer, null).getPropertyValue('padding-right'));
            const parentWidth = parentContainer.clientWidth - parentPaddingLeft - parentPaddingRight;

            fixedContainer.style.width = parentWidth + "px";
        });
    };

    render() {
        this.adjustFixedCustomFeedsWidth();

        return this.getContent();
    }
}