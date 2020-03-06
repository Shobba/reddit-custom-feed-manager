import React from "react";
import { useDrag } from 'react-dnd';
import Visibility from "../../reddit/models/visibility";

export const CustomFeed = (props) => {
    const name = props.feed.getName();
    const type = 'custom-feed';
    const [{ isDragging }, drag] = useDrag({
        item: {feed: props.feed, type},
        collect: monitor => ({
            isDragging: monitor.isDragging(),
        })
    });

    const classNames = ['custom-feed'];
    if (isDragging) {
        classNames.push('custom-feed--dragging');
    }

    if (props.feed.getVisibility() === Visibility.HIDDEN) {
        classNames.push('custom-feed--hidden');
    } else if (props.feed.getVisibility() === Visibility.PRIVATE) {
        classNames.push('custom-feed--private');
    }

    return (
        <div ref={drag} className={classNames.join(' ')}>
            <div className="custom-feed__name">{props.feed.getName()}</div>
            <div className="custom-feed__count">{props.feed.getSubreddits().length}</div>
        </div>
    );
};