import UserInfo from "./models/user-info";
import Subscriptions from "./models/subscriptions";
import CustomFeeds from "./models/custom-feeds";
import snoowrap from "snoowrap";
import NeedsAuthorizationError from "./error/needs-authorization-error";
import history from '../helpers/history';

export default class RedditApi {
    static _requester = null;

    static _getRequester = () => {
        if (this._requester === null) {
            throw new NeedsAuthorizationError('No requester found');
        }

        return this._requester;
    };

    static startAuthorizationFlow = () => {
        window.location = snoowrap.getAuthUrl({
            clientId: process.env.REDDIT_CLIENT_ID,
            /*
             * identity -> get username
             * mysubreddits -> read subscriptions
             * subscribe -> update multireddits
             * read -> read multireddits
             */
            scope: ['identity', 'mysubreddits', 'subscribe', 'read'],
            redirectUri: process.env.REDDIT_REDIRECT_URL,
            permanent: true,
            state: 'fe211bebc52eb3da9bef8db6e63104d3' // a random string, this could be validated when the user is redirected back
        });
    };

    static gotAuthCode = (code) => {
        return snoowrap.fromAuthCode({
            code: code,
            userAgent: 'reddit-feeds 0.1',
            clientId: process.env.REDDIT_CLIENT_ID,
            redirectUri: process.env.REDDIT_REDIRECT_URL
        }).then(r => {
            this._requester = r;
            history.push('/');
        });
    };

    static authorize = () => {
        return new Promise((resolve, reject) => {
            try {
                this._getRequester();
            } catch (error) {
                reject(error);
            }
        });
    };

    static getUserInfo = () => {
        return new Promise((resolve, reject) => {
            try {
                const requester = this._getRequester();
                requester.getMe()
                    .then(redditUser => UserInfo.fromApi(redditUser))
                    .then(resolve)
                    .catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    };

    static getCustomFeeds = () => {
        return new Promise((resolve, reject) => {
            try {
                const requester = this._getRequester();
                requester.getMyMultireddits()
                    .then(multiReddits => CustomFeeds.fromApi(multiReddits))
                    .then(resolve)
                    .catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    };

    static getSubscriptions = () => {
        return new Promise((resolve, reject) => {
            try {
                const requester = this._getRequester();

                requester.getSubscriptions()
                    .then(subscriptions => {
                        subscriptions.fetchAll()
                            .then(subscriptions => Subscriptions.fromApi(subscriptions))
                            .then(resolve)
                            .catch(reject);
                    })
                    .catch(reject);
            } catch (error) {
                reject(error);
            }
        });
    };
}