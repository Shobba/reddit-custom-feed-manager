import React from 'react';
import {Subscription} from "./subscription";
import {CustomFeed} from "./customFeed";
import {DndProvider} from 'react-dnd'
import Backend from 'react-dnd-html5-backend'

const Home = (props) => {
    const _adjustFixedCustomFeedsWidth = () => {
        window.removeEventListener('resize', _adjustFixedCustomFeedsWidth);
        window.addEventListener('resize', _adjustFixedCustomFeedsWidth);

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

    _adjustFixedCustomFeedsWidth();

    if (props.subscriptions === null) {
        return null;
    }

    return (
        <>
            <DndProvider backend={Backend}>
                <div className="content">
                    <div className="column column__subscriptions">
                        <div className="column__headline">Your subscriptions</div>
                        {props.subscriptions.getSubscriptions().map((subscription) => {
                            return (
                                <Subscription
                                    subscription={subscription}
                                    customFeeds={props.customFeeds}
                                    onAdd={props.onAdd}
                                    onRemove={props.onRemove}
                                    key={'subscription_' + subscription.getId()}
                                />
                            )
                        })}
                    </div>
                    <div className="column column__custom-feeds">
                        <div className="fixed-custom-feeds">
                            <div className="column__headline">Your custom feeds</div>
                            {props.customFeeds.getFeeds().map((feed) => {
                                return (<CustomFeed key={'customFeed_' + feed.getName()} feed={feed}/>);
                            })}
                        </div>
                    </div>
                </div>
            </DndProvider>
        </>
    );
};

export default Home;