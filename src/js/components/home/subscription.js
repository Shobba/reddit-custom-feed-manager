import React, { useState } from "react";
import { useDrop } from 'react-dnd';
import CustomFeedTag from "./customFeedTag";

export const Subscription = (props) => {
    const [justDropped, setJustDropped] = useState(false);
    const [didDrop, setDidDrop] = useState(false);

    const [didDropTimer, setDidDropTimer] = useState(null);
    const [disableDropTimer, setDisableDropTimer] = useState(null);

    const dropped = (feed) => {
        props.onAdd(props.subscription, feed);
    };

    const removeFeed = (feed) => {
        props.onRemove(props.subscription, feed);
    };

    const [{ canDrop, isOver }, drop] = useDrop({
        accept: 'custom-feed',
        drop: (item) => {
            dropped(item.feed);

            setJustDropped(true);
            setDidDrop(false);

            if (didDropTimer !== null) {
                window.clearTimeout(didDropTimer);
            }

            if (disableDropTimer !== null) {
                window.clearTimeout(disableDropTimer);
            }

            setDidDropTimer(
                window.setTimeout(() => {
                    setJustDropped(false);
                    setDidDrop(true);
                    setDidDropTimer(null);
                }, 500)
            );

            setDisableDropTimer(
                window.setTimeout(() => {
                    setJustDropped(false);
                    setDidDrop(false);
                    setDisableDropTimer(null);
                }, 1500)
            );
        },
        collect: monitor => ({
            canDrop: monitor.canDrop(),
            isOver: monitor.isOver()
        })
    });

    const getCustomFeedsOfSubscription = () => {
        if (!props.customFeeds || props.customFeeds.getFeeds().length <= 0) {
            return [];
        }

        return props.customFeeds.getFeeds().filter((feed) => {
            return feed.getSubreddits().includes(props.subscription.getDisplayName());
        });
    };

    const customFeedsOfSubscription = getCustomFeedsOfSubscription();

    const classNames = ['subscription'];
    if (justDropped) {
        classNames.push('subscription--just-dropped');
    } else if (didDrop) {
        classNames.push('subscription--did-drop');
    } else if (canDrop && isOver) {
        classNames.push('subscription--active');
    }

    return (
        <div ref={drop} className={classNames.join(" ")}>
            <div className="subscription__display-name">/r/{props.subscription.getDisplayName()}</div>
            <div className="subscription__title">{props.subscription.getTitle()}</div>
            {customFeedsOfSubscription.length > 0 &&
                <div className="subscription__custom-feeds">
                    {
                        getCustomFeedsOfSubscription().map((feed) => {
                            return (
                                <CustomFeedTag feed={feed} onRemove={removeFeed} key={"subscription-" + props.subscription.getId() + "-custom-" + feed.getName()}/>
                            );
                        })
                    }
                </div>
            }
        </div>
    );
};