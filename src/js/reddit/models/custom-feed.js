export default class CustomFeed extends Object {
    static fromApi = (multiReddit) => {
        return new CustomFeed(multiReddit);
    };

    constructor(multiReddit) {
        super();
        this._name = multiReddit.name;
        this._visibility = multiReddit.visibility;
        this._subreddits = multiReddit.subreddits.map(subreddit => Object.assign({}, subreddit).display_name);
        this._multiReddit = multiReddit;
    }

    getName = () => {
        return this._name;
    };

    getSubreddits = () => {
        return this._subreddits;
    };

    getVisibility = () => {
        return this._visibility;
    };

    addSubscription = (subscription) => {
        const subredditName = subscription.getDisplayName();

        if (this._subreddits.includes(subredditName)) {
            return;
        }

        this._subreddits.push(subredditName);

        this._multiReddit.addSubreddit(subredditName);
    };

    removeSubscription = (subscription) => {
        const subredditName = subscription.getDisplayName();
        if (!this._subreddits.includes(subredditName)) {
            return;
        }

        const index = this._subreddits.indexOf(subredditName);
        if (index < 0) {
            return;
        }

        this._subreddits.splice(index, 1);

        this._multiReddit.removeSubreddit(subredditName);
    };
}