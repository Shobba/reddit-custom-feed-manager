export default class UserInfo extends Object {
    static fromApi = (redditUser) => {
        return new UserInfo(redditUser.name);
    };

    constructor(name) {
        super();
        this._name = name;
    }

    getName = () => {
        return this._name;
    };
}