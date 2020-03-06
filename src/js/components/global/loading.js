import React from 'react';
import {PacmanLoader} from "react-spinners";

export const Loading = () => (
    <div className="loading">
        <div className="loading__spinner">
            <PacmanLoader size={15} color={"#19C5C6"}/>
        </div>
    </div>
);