import CustomFeed from "./custom-feed";

export default class CustomFeeds extends Object {
    static fromApi = (multiReddits) => {
        const feeds = multiReddits.map(feed => {
            return CustomFeed.fromApi(feed);
        });

        return new CustomFeeds(
            feeds
        );
    };

    constructor(feeds) {
        super();
        this._feeds = feeds;
    }

    getFeeds = () => {
        return this._feeds;
    };
}