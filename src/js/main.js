import '../css/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import Home from "./components/home/home";
import { Router, Switch, Route } from 'react-router-dom';
import history from './helpers/history';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Router history={history}>
            <Switch>
            <Route component={Home}/>
        </Switch>
        </Router>
    );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));