import Subscription from "./subscription";

export default class Subscriptions extends Object {
    static fromApi = (subscriptionsListing) => {
        const subscriptions = subscriptionsListing.map(subscription => {
            return Subscription.fromApi(subscription);
        });

        return new Subscriptions(subscriptions);
    };

    constructor(subscriptions) {
        super();
        this._subscriptions = subscriptions;
    }

    getSubscriptions = () => {
        return this._subscriptions;
    };
}