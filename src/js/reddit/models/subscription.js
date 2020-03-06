export default class Subscription extends Object {
    static fromApi = (subscription) => {
        return new Subscription(
            subscription.id,
            subscription.title,
            subscription.display_name,
            subscription.public_description,
            subscription.icon_img,
            subscription.key_color
        );
    };

    constructor(id, title, displayName, description, iconUrl, keyColor) {
        super();
        this._id = id;
        this._title = title;
        this._displayName = displayName;
        this._description = description;
        this._iconUrl = iconUrl;
        this._keyColor = keyColor;
    }

    getId = () => {
        return this._id;
    };

    getTitle = () => {
        return this._title;
    };

    getDisplayName = () => {
        return this._displayName;
    };

    getDescription = () => {
        return this._description;
    };

    getIconUrl = () => {
        return this._iconUrl;
    };

    getKeyColor = () => {
        return this._keyColor;
    };
}