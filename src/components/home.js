import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import imgBanner from '../img/banner-home.jpg';
import * as config from '../config.js';
import * as global from '../actions/GlobalFunctions.js';
import * as smpdata from '../actions/DefaultData.js';
import StatusBar from "./statusbar";
import * as ga from '../actions/GoogleAnalytics';
import ReactGA from 'react-ga';

class Home extends Component {
    
    state = { homeTiles:[], tiles:[], tiles_mobile:[] }
    
    getLocalData() {
        var localData = '';
        if (localStorage.getItem('homeTiles')) { //get data from local storage
            localData = JSON.parse(localStorage.getItem('homeTiles'));
        } else {
            localData = smpdata.primary_data.data;
            localStorage.setItem('homeTiles', JSON.stringify(localData));
        }
        this.dataTiles(localData);
        this.dataTilesMobile(localData);
        this.setState({ homeTiles:localData });
        console.log("Using data from local.");
    }
    
    dataTiles(arr) {
        const ORIGDATA = arr;
        const COUNT_ORIG = ORIGDATA.length;
        var MAINSET = [];
        var MAIN_COUNT = 0;
        if (COUNT_ORIG > 0) {
            MAIN_COUNT++;
            var NEWSET = [];
            var COUNT = 0;
            ORIGDATA.forEach(function(key) {
                COUNT++;
                NEWSET.push({ id:COUNT, jobid:key.jobid, ttl:key.jobttl, img:key.img });
                const MODULUS_CON = COUNT % 3;
                if (COUNT_ORIG === COUNT) {
                    MAINSET.push({ main_count:MAIN_COUNT, data:NEWSET });
                    if (COUNT_ORIG > 3) {
                        const MODULUS_MISSING = COUNT % 3;
                        if (MODULUS_MISSING === 1) {
                            COUNT++;
                            NEWSET.push({ id:COUNT, jobid:"", ttl:"", img:"" });
                            COUNT++;
                            NEWSET.push({ id:COUNT, jobid:"", ttl:"", img:"" });
                        } else if (MODULUS_MISSING === 2) {
                            COUNT++;
                            NEWSET.push({ id:COUNT, jobid:"", ttl:"", img:"" });
                        }
                    } 
                } else if (MODULUS_CON === 0) {
                    MAINSET.push({ main_count:MAIN_COUNT, data:NEWSET });
                    NEWSET = [];
                    MAIN_COUNT++;
                }       
            });
        }
        this.setState({ tiles:MAINSET });
    }
    
    dataTilesMobile(arr) {
        const ORIGDATA = arr;
        const COUNT_ORIG = ORIGDATA.length;
        var MAINSET = [];
        var MAIN_COUNT = 0;
        if (COUNT_ORIG > 0) {
            MAIN_COUNT++;
            var NEWSET = [];
            var COUNT = 0;
            ORIGDATA.forEach(function(key) {
                COUNT++;
                NEWSET.push({ id:COUNT, jobid:key.jobid, ttl:key.jobttl, img:key.img });
                const MODULUS_CON = COUNT % 2;
                if (COUNT_ORIG === COUNT) {
                    MAINSET.push({ main_count:MAIN_COUNT, data:NEWSET });
                    if (COUNT_ORIG > 2) {
                        const MODULUS_MISSING = COUNT % 2;
                        if (MODULUS_MISSING === 1) {
                            COUNT++;
                            NEWSET.push({ id:COUNT, jobid:"", ttl:"", img:"" });
                        }
                    }
                } else if (MODULUS_CON === 0) {
                    MAINSET.push({ main_count:MAIN_COUNT, data:NEWSET });
                    NEWSET = [];
                    MAIN_COUNT++;
                }   
            });
        }
        this.setState({ tiles_mobile:MAINSET });
    }

    componentDidMount() {
        ga.gInitialize();
        ga.gPageView("Home");
        
        var locid = global.getLocationId(this.props);
        if (locid !== "") {  ga.gDim(1, locid); }
        
        this.getLocalData();
    }
    
    nextStep(id, name) {
        ga.gRecEvent("Home","ViewJob", id + ' - ' + name); 
        const locid = global.getLocationId(this.props) === "" ? "" : "&locid="+global.getLocationId(this.props);
        window.location.href = "job/" + global.tolink(name) + "?id=" + id + locid;
    }

    render() { 
        return (
            <div className="contnr" >
                <StatusBar/>
                <Container style={{ marginBottom:"20px" }}>
                    <Row>
                        <img 
                            src={imgBanner}
                            alt="header banner"
                            style={{ width:"100%" }}
                        />
                    </Row>
                    <Row>
                        <Col xs={12} md={12}>
                            <div className="home-hdr" >
                                JOB OPPORTUNITIES
                            </div>
                        </Col>
                    </Row>
                    {
                        this.state.tiles.map( keys => (
                            <Row key={keys.main_count} className="version-web" >
                                {
                                    keys.data.map( key => (
                                        <Col key={key.jobid} className="home-tileweb">
                                            <img 
                                                src={key.img}
                                                alt={key.ttl}
                                                className={ key.ttl === '' ? 'home-tileimg hide' : 'home-tileimg' }
                                                onClick={() => this.nextStep(key.jobid, key.ttl)}
                                            />
                                            <div 
                                                className={ key.ttl === '' ? 'home-subtle hide' : 'home-subtle' } 
                                                onClick={() => this.nextStep(key.jobid, key.ttl)}
                                            >
                                                {key.ttl}
                                            </div>
                                        </Col>
                                    ))
                                }
                            </Row>      
                        ))
                    }
                    <Row id="version-mobile" >
                        <Col xs={12} md={12}>
                            <table style={{ width:"100%" }}>
                                <tbody>
                                    {
                                        this.state.tiles_mobile.map( keys => (
                                             <tr key={keys.main_count} >
                                                {
                                                    keys.data.map( key => (
                                                        <td key={key.jobid} className="home-tblcol">
                                                            <img 
                                                                src={key.img}
                                                                alt={key.ttl}
                                                                className={ key.ttl === '' ? 'home-tileimg hide' : 'home-tileimg' }
                                                                onClick={() => this.nextStep(key.jobid)}
                                                            />
                                                            <div className={ key.ttl === '' ? 'homem-subtle hide' : 'homem-subtle' } onClick={() => this.nextStep(key.jobid)} >
                                                                {key.ttl}
                                                            </div>
                                                        </td>
                                                    ))
                                                }
                                            </tr>  
                                        ))
                                    }
                                </tbody>
                            </table>
                        </Col>
                    </Row>
                </Container>
            </div>
        );
    }
};

export default Home;