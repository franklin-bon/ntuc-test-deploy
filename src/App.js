import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route, Redirect } from "react-router-dom";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PgHome from "./components/home";
import PgJob from "./components/job";
import * as config from './config.js';
import * as global from './actions/GlobalFunctions.js';

class App extends Component {
    
    state = { jobs:[] }
    
    arrangeJobs(arr) {
        const arrcount = arr.length;
        var newset = [];
        var count = 0;
        if (arrcount > 0) {
            arr.forEach(function(key) {
                count++;
                var joblink = global.tolink(key.jobttl);
                newset.push({ id:count, jobid:key.jobid, ttl:key.jobttl, link:joblink });
            });
        }
        this.setState({ jobs:newset });
    }
    
    getJobs() {
        let API_URL = config.API_HOMETILES;
        let API_KIOSID = config.API_KIOSKID;
        var formData = new FormData();
        formData.append('kioskid', API_KIOSID);
        fetch(API_URL, {
            method: 'POST',
            body: formData
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.code === "00") {
                this.arrangeJobs(json.data);
                localStorage.setItem('homeTiles', JSON.stringify(json.data)); //stored api data to local storage
            }
        }).catch(error => {
            console.log('There has been a problem with fetching (Job List API): ',error);
        });
    }
    
    componentDidMount() {
        this.getJobs();
    }
    
    render() { 
        return (
            <Router>
                <Switch>
                    <Redirect exact from="/" to="home" />
                    <Route path="/home" component={PgHome}></Route>
                    {
                        this.state.jobs.map( key => (
                            <Route key={key.jobid} path={`/job/${key.link}`} component={PgJob}></Route>
                        ))
                    }
                </Switch>
            </Router>
        );
    }
};

export default App;