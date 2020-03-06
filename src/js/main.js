import '../css/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Home from "./components/home/home";
import { Router, Switch, Route } from 'react-router-dom';
import history from './helpers/history';
import Header from "./components/global/header";
import queryString from "query-string";
import RedditApi from "./reddit/reddit-api";
import UserInfo from "./reddit/models/user-info";
import Subscriptions from "./reddit/models/subscriptions";
import CustomFeeds from "./reddit/models/custom-feeds";
import {Loading} from "./components/global/loading";
import {Error as ErrorComponent} from "./components/global/error";

class App extends React.Component {
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
        const parsed = queryString.parse(history.location.search);

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
            return (<Loading />);
        }

        if (this.state.error) {
            return (<ErrorComponent error={this.state.error}/>);
        }

        const HomeComponent = (props) => (
            <Home
                {...props}
                userInfo={this.state.userInfo}
                subscriptions={this.state.subscriptions}
                customFeeds={this.state.customFeeds}
                onAdd={this.onAdd}
                onRemove={this.onRemove}
            />
        );

        return (
            <Switch>
                <Route component={HomeComponent}/>
            </Switch>
        );
    };

    render() {
        return (
            <>
                <Header userInfo={this.state.userInfo} />
                {this.getContent()}
            </>
        );
    }
}

ReactDOM.render(<Router history={history}><App /></Router>, document.getElementById('root'));