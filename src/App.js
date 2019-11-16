import React from 'react';
//import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import PgHome from "./components/home";
import PgJob from "./components/job";

function App() {
    return (
        <Router>
            <Switch>
                <Redirect exact from="/" to="home" />
                <Route path="/home" component={PgHome}></Route>
                <Route path="/job/online-picker" component={PgJob}></Route>
            </Switch>
        </Router>
    );
}

export default App;
