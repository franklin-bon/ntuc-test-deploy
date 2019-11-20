import React, { Component } from 'react';
import { FormControl } from 'react-bootstrap';
import * as qs from 'query-string';
import * as config from '../config.js';
import * as global from '../actions/GlobalFunctions.js';
import * as ga from '../actions/GoogleAnalytics';
import StatusBar from "./statusbar";
import imgFairPrice from '../img/fairprice-logo-header.png';
import imgBack from '../img/icon-back.png';
import imgBtnApply from '../img/button-apply.png';
import imgBtnNext from '../img/button-next.png';
import imgBtnVerify from '../img/button-verify.png';
import imgBtnBrowse from '../img/button-browse-jobs.png';
import imgSMS from '../img/icon-sms-otp.png';
import imgInfo from '../img/icon-basic-info.png';
import imgChkOn from '../img/icon-checkbox-on.png';
import imgChkOff from '../img/icon-checkbox-off.png';
import imgJobApp from '../img/icon-jobapp-thankyou.png';
import gifLoading from '../img/loading.gif';

class Jobs extends Component {
    
    state = {
        apiAppId: "", apiTxtMobile: "", apiTxtOTP: "", apiTxtName: "", apiReturnQst: [],
        questTitle: "",
        apiQues: [],
        quesArr: [],
        activeStep: "job_desc", homeTiles:[],
        jobBanner: "", jobDescHtml: "", chosenJob: "", chosenJobId: "",
        stepApply:"", stepNumber:"hide", stepInfo:"hide", stepLocation:"hide", stepThanks:"hide", 
        selectedLoc: [],
        chkBoxAgree: imgChkOff,
        stepQuestions: "hide",
        mobType: "password", //text or password
        mobMsg: "SHOW", //SHOW or HIDE
        otpStatus: "off", otpCount: 100, 
        smsBtnNext: "btn-apply hide", smsBtnVerify: "btn-apply hide", smsTxtVerify: "hide",
        modalDisplay: "hide", modalButton: "hide", modalTxt: "", modalTxtAlign: "center"
    }
    
    getLocalData() {
        if (localStorage.getItem('newData')) {
            var savData = JSON.parse(localStorage.getItem('newData'));
            var locData = JSON.parse(localStorage.getItem('homeTiles'));
            if (savData.jobid) {
                var savJobId = savData.jobid;
                var locJobs = locData;
                if (locJobs.length > 0) {
                    for (var i=0; i < locJobs.length; i++) {
                        if (locJobs[i].jobid === savJobId) {
                            this.setState({ chosenJobId: savJobId });
                            this.setState({ chosenJob: locJobs[i].jobttl });
                            this.setState({ jobBanner: locJobs[i].bannerurl });
                            this.setState({ jobDescHtml: locJobs[i].desc });
                        }
                    }
                }
            }
        }
    }
    
    saveLocalQues(newQues) {
        var NEWQUESTION = newQues;
        var CURRENTJOBID = this.state.chosenJobId;
        if (localStorage.getItem('dataQues')) {
            var QUESLOCALDATA = JSON.parse(localStorage.getItem('dataQues'));
            var NEWSET = [];
            var CHECKER = 0;
            QUESLOCALDATA.forEach(function(qst) {
                if (qst.jobid === CURRENTJOBID) {
                    CHECKER++;
                    NEWSET.push({jobid:CURRENTJOBID, jobques:NEWQUESTION});
                } else {
                    NEWSET.push({jobid:qst.jobid, jobques:qst.jobques});
                }
            });
            if (CHECKER === 0) {
                NEWSET.push({jobid:CURRENTJOBID, jobques:NEWQUESTION});
            }
            localStorage.setItem('dataQues', JSON.stringify(NEWSET));
            this.setState({apiReturnQst:NEWSET});
        } else {
            var NEWSETv2 = [{jobid:CURRENTJOBID, jobques:NEWQUESTION}];
            localStorage.setItem('dataQues', JSON.stringify(NEWSETv2));
            this.setState({apiReturnQst:NEWSETv2});
        }
    }
    
    getLocalQuestions() {
        var CURRENTJOBID = this.state.chosenJobId;
        var LOCALQUES = this.state.apiReturnQst;
        if (LOCALQUES.length === 0) {
            if (localStorage.getItem('dataQues')) {
                LOCALQUES = JSON.parse(localStorage.getItem('dataQues'));
                this.setState({ apiReturnQst:LOCALQUES });
            }
        }
        if (this.state.apiReturnQst.length === 0) {
            this.showMsg('alert','No questions available. Please try your actions again.');
        } else {
            var i = 0;
            var title = "";
            var questionid = "";
            LOCALQUES.forEach(function(qst) {
                if (qst.jobid === CURRENTJOBID) {
                    var SPECIFICQUES = qst.jobques.data[0];
                    Object.keys(SPECIFICQUES).map((key) => {
                        i++;
                        if (i === 1) {
                            title = SPECIFICQUES[key].ques;
                        } else if (i === 2) {
                            questionid = SPECIFICQUES[key].quesid;
                        }
                    });
                }
            });
            this.setState({ questTitle: title });
            this.setState({ apiQues: [{ quesid: questionid, ansid: "", anstext: "", img:"" }] });
            this.setState({ activeStep:"questions", stepInfo:"hide", stepQuestions:"" });
        } 
    }
    
    getLocalLocations() {
        if (localStorage.getItem('dataLoc')) {
            var LOCALDATALOC = JSON.parse(localStorage.getItem('dataLoc'));
            var NEWLOC = [];
            Object.keys(LOCALDATALOC).map((key) => {
                NEWLOC.push({ locid:key, loctxt:LOCALDATALOC[key], check:"" });
            });
            this.setState({ selectedLoc:NEWLOC });
        }
    }
    
    checkLocation(selectedid, txt) {
        console.log(txt);
        var ALLACTIVE = 0;
        this.state.selectedLoc.map((keyactive) => {
            if (keyactive.check === "yes") { ALLACTIVE++; }
        });
        var NEWLOC = [];
        this.state.selectedLoc.map((key) => {
            var CHECKVALUE = "";
            if (key.locid === selectedid) {
                if (key.check === "") { CHECKVALUE="yes"; }
                if (ALLACTIVE === 2 && CHECKVALUE==="yes") { 
                    CHECKVALUE = key.check;
                    this.showMsg('alert','Maximum selection allowed is 2');
                }
            } else {
                CHECKVALUE = key.check;
            }
            NEWLOC.push({ locid:key.locid, loctxt:key.loctxt, check:CHECKVALUE });
        });
        this.setState({ selectedLoc:NEWLOC });
    }
    
    backStep() {
        if (this.state.activeStep === "job_desc") {
            const LOCID = global.getLocationId(this.props) === "" ? "" : "?locid="+global.getLocationId(this.props);
            window.location.href = "../home"+LOCID;
        } else if (this.state.activeStep === "sms_step1" || this.state.activeStep === "sms_step2") {
            this.setState({ activeStep:"job_desc" });
            this.setState({ stepApply:"", stepNumber:"hide" });
        } else if (this.state.activeStep === "contact_details") {
            this.setState({ activeStep:"sms_step2" });
            this.setState({ stepNumber:"", stepInfo:"hide" });
            this.setState({ apiTxtMobile:"", smsTxtVerify:"hide", apiTxtOTP:"", smsBtnNext:"btn-apply", smsBtnVerify:"btn-apply hide" });
        } else if (this.state.activeStep === "questions") {
            this.setState({ activeStep:"contact_details" });
            this.setState({ stepInfo:"", stepQuestions:"hide" });
        } else if (this.state.activeStep === "location") {
            this.getLocalQuestions();
            this.setState({ activeStep:"questions" });
            this.setState({ stepQuestions:"", stepLocation:"hide" });
        }
    }
    
    mobShowHide() {
        if (this.state.mobType === "text") {
            this.setState({ mobType:"password", mobMsg:"SHOW" });
        } else {
            this.setState({ mobType:"text", mobMsg:"HIDE" });
        }
    }
    
    chkBoxAgree() {
        if (this.state.chkBoxAgree === imgChkOff) {
            this.setState({ chkBoxAgree:imgChkOn });
        } else {
            this.setState({ chkBoxAgree:imgChkOff });
        }
    }
    
    txtMobileNo = (event) => {
        var input = event.target.value;
        this.setState({ apiTxtMobile:input });
    }
    
    txtOTP = (event) => {
        var input = event.target.value;
        this.setState({ apiTxtOTP:input });
    }
    
    txtName = (event) => {
        var input = event.target.value;
        this.setState({ apiTxtName:input });
    }
    
    apiGetOTP() {
        this.setState({ otpCount:'wait' });
        let API_URL = config.API_GETOTP; console.log(API_URL);
        var API_KIOSID = config.API_KIOSKID;
        var JOBID = this.state.chosenJobId;
        var MOBNUM = this.state.apiTxtMobile;
        var MOBNUMLEN = MOBNUM.length;
        if (global.validate_sgmobilenum(MOBNUM) === 0) { 
            const LOCID = global.getLocationId(this.props) === "" ? "" : global.getLocationId(this.props);
            this.showMsg('loading','');
            var formData = new FormData();
            formData.append('kioskid', API_KIOSID);
            formData.append('jobid', JOBID);
            formData.append('mobn', MOBNUM);
            formData.append('locid', LOCID);
            fetch(API_URL, {
                method: 'POST',
                body: formData
            }).then(response => {
                return response.json();
            }).then(json => {
                if (json.code === "00") {
                    this.closeMsg();
                    this.setState({ apiAppId:json.data[0].appid });
                    this.setState({ activeStep:"sms_step2" });
                    this.setState({ smsBtnNext:"btn-apply hide", smsBtnVerify:"btn-apply", smsTxtVerify:"" });
                    this.setState({ otpCount:60, otpStatus:"on", apiTxtOTP:"" });
                } else {
                    this.showMsg('alert',json.message[0]);
                } 
            }).catch(error => {
                this.showMsg('alert','System error. Please send an email to customercare@fastjobs.sg');
                console.log('There has been a problem with fetching (Get OTP API): ',error);
            });
        } else {
            this.showMsg('alert','Please input valid mobile number');
        }
    }
    
    apiVerifyOTP() {
        this.showMsg('loading','');
        var MOBNUM = this.state.apiTxtMobile;
        var OTPNUM = this.state.apiTxtOTP;
        if (MOBNUM === "") {
            this.showMsg('alert','Please input your mobile number');
        } else if (OTPNUM === "") {
            this.showMsg('alert','Please input the 4-digit OTP');
        } else {
            var API_URL = config.API_VERIFYOTP; console.log(API_URL);
            var formData = new FormData();
            formData.append('appid', this.state.apiAppId);
            formData.append('otp', OTPNUM);
            fetch(API_URL, {
                method: 'POST',
                body: formData
            }).then(response => {
                return response.json();
            }).then(json => {
                if (json.code === "00") {
                    ga.gPageView("UserDetails");
                    this.closeMsg();
                    this.setState({ activeStep:"contact_details" });
                    this.setState({ stepNumber:"hide", stepInfo:"" });
                    this.setState({ chkBoxAgree:imgChkOff, apiTxtName:json.data[0].name });
                    this.setState({ otpCount:'wait', otpStatus:"off" });
                } else {
                    this.showMsg('alert',json.message[0]);
                }
            }).catch(error => {
                this.showMsg('alert','System error. Please send an email to customercare@fastjobs.sg');
                console.log('There has been a problem with fetching (Verify OTP API): ',error);
            });
        }
    }
    
    apiSaveUser() {
        this.showMsg('loading','');
        var API_URL = config.API_SAVEUSER; console.log(API_URL);
        var APPID = this.state.apiAppId;
        var USERNAME = this.state.apiTxtName;
        if (USERNAME === "") {
            this.showMsg('alert','Please input your name.');
        } else if (this.state.chkBoxAgree === imgChkOff) {
            this.showMsg('alert','Please check the checkbox if you are agree.');
        } else {
            var formData = new FormData();
            formData.append('appid', APPID);
            formData.append('name', USERNAME);
            fetch(API_URL, {
                method: 'POST',
                body: formData
            }).then(response => {
                return response.json();
            }).then(json => {
                if (json.code === "00") {
                    ga.gPageView("Questions");
                    this.closeMsg();
                    this.apiRequestQuestions();
                } else {
                    this.showMsg('alert',json.message[0]);
                }
            }).catch(error => {
                this.showMsg('alert','System error. Please send an email to customercare@fastjobs.sg');
                console.log('There has been a problem with fetching (Saving User API): ',error);
            });
        }
    }
    
    apiRequestQuestions() {
        this.showMsg('loading','');
        var API_URL = config.API_GETQUESTIONS; console.log(API_URL);
        var API_KIOSID = config.API_KIOSKID;
        var JOBID = this.state.chosenJobId;
        var formData = new FormData();
        formData.append('kioskid', API_KIOSID);
        formData.append('jobid', JOBID);
        formData.append('appid', this.state.apiAppId);
        fetch(API_URL, {
            method: 'POST',
            body: formData
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.code === "00") {
                this.closeMsg();
                this.saveLocalQues(json);
                this.getLocalQuestions();
            } else {
                console.log(json.message[0]);
                this.getLocalQuestions();
            }
        }).catch(error => {
            this.closeMsg();
            console.log('There has been a problem with fetching (Questions API): ',error);
            this.getLocalQuestions();
        });
    }
    
    apiSaveQuestions() {
        this.showMsg('loading','');
        var ANSWERS = this.state.apiQues;
        var finalAnswer = {};
        ANSWERS.forEach(function(qst) {
            var quesid = qst.quesid;
            var eachAns = {};
            eachAns["ansid"] = qst.ansid;
            eachAns["anstext"] = qst.anstext;
            finalAnswer[quesid] = eachAns;
        });
        finalAnswer = JSON.stringify(finalAnswer);
        //
        var API_URL = config.API_SAVEQUESTIONS; console.log(API_URL);
        var API_KIOSID = config.API_KIOSKID;
        var JOBID = this.state.chosenJobId;
        var formData = new FormData();
        formData.append('kioskid', API_KIOSID);
        formData.append('jobid', JOBID);
        formData.append('appid', this.state.apiAppId);
        formData.append('ans', finalAnswer);
        fetch(API_URL, {
            method: 'POST',
            body: formData
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.code === "00") {
                ga.gPageView("Locations");
                this.closeMsg();
                this.apiGetLocation();
            } else {
                this.showMsg('alert',json.message[0]);
            }
        }).catch(error => {
            this.showMsg('alert','System error. Please send an email to customercare@fastjobs.sg');
            console.log('There has been a problem with fetching (Saving Questions API): ',error);
        });
    }
    
    apiGetLocation() {
        this.showMsg('loading','');
        var API_URL = config.API_GETLOCATIONS; console.log(API_URL);
        var JOBID = this.state.chosenJobId;
        var APPID = this.state.apiAppId;
        var formData = new FormData();
        formData.append('jobid', JOBID);
        formData.append('appid', APPID);
        fetch(API_URL, {
            method: 'POST',
            body: formData
        }).then(response => {
            return response.json();
        }).then(json => {
            if (json.code === "00") {
                this.closeMsg();
                localStorage.setItem('dataLoc', JSON.stringify(json.data[0]));
                this.setState({ activeStep:"location" });
                this.setState({ stepQuestions:"hide", stepLocation:"" });
                this.getLocalLocations();
            } else {
                this.showMsg('alert',json.message[0]);
            }
        }).catch(error => {
            this.showMsg('alert','System error. Please send an email to customercare@fastjobs.sg');
            console.log('There has been a problem with fetching (Get Locations API): ',error);
        });
    }
    
    apiSaveLocation() {
        var COUNTANS = 0;
        var LOCID = "";
        this.state.selectedLoc.map((key) => {
            if(key.check === "yes") { 
                if (LOCID === "") {
                    COUNTANS++;
                    LOCID += key.locid + ",";
                } else {
                    COUNTANS++;
                    LOCID += key.locid;
                }
            }
        });
        //
        if (COUNTANS === 2) {
            this.showMsg('loading','');
            var API_URL = config.API_SAVELOCATIONS; console.log(API_URL);
            var JOBID = this.state.chosenJobId;
            var APPID = this.state.apiAppId;
            var formData = new FormData();
            formData.append('jobid', JOBID);
            formData.append('appid', APPID);
            formData.append('locids', APPID);
            fetch(API_URL, {
                method: 'POST',
                body: formData
            }).then(response => {
                return response.json();
            }).then(json => {
                if (json.code === "00") {
                    ga.gPageView("Thankyou");
                    this.closeMsg();
                    this.setState({ activeStep:"thanks_page" });
                    this.setState({ stepLocation:"hide", stepThanks:"" });
                    localStorage.removeItem("newData");
                } else {
                    this.showMsg('alert',json.message[0]);
                }
            }).catch(error => {
                this.showMsg('alert','System error. Please send an email to customercare@fastjobs.sg');
                console.log('There has been a problem with fetching (Save Locations API): ',error);
            });
        } else {
            this.showMsg('alert','Maximum selection allowed is 2');
        }
    }
    
    nextStep(status) {
        if (status === "apply") {
            ga.gPageView("Otp");
            ga.gRecEvent("JobAds", "ApplyJob", this.state.chosenJobId+' - '+this.state.chosenJob);
            this.setState({ activeStep:"sms_step1" });
            this.setState({ stepApply:"hide", stepNumber:"" });
            this.setState({ smsBtnNext:"btn-apply", smsBtnVerify:"btn-apply hide", smsTxtVerify:"hide" });
            this.setState({ stepApply:"hide", stepNumber:"" });
        } else if (status === "sms_next") {
            ga.gRecEvent("Otp", "otp_SubmitMobn", this.state.chosenJobId+' - '+this.state.chosenJob);
            this.apiGetOTP();
        } else if (status === "sms_verify") {
            ga.gRecEvent("Otp", "otp_Verify", this.state.chosenJobId+' - '+this.state.chosenJob);
            this.apiVerifyOTP();
        } else if (status === "dtls_next") {
            ga.gRecEvent("UserDetails", "dtls_Save", this.state.chosenJobId+' - '+this.state.chosenJob);
            this.apiSaveUser();
        } else if (status === "questions") {
            ga.gRecEvent("Questions", "qts_Save", this.state.chosenJobId+' - '+this.state.chosenJob);
            setTimeout(() => { this.apiSaveQuestions(); },100);
        } else if (status === "location") {
            ga.gRecEvent("Locations", "loc_Save", this.state.chosenJobId+' - '+this.state.chosenJob);
            this.apiSaveLocation();
        } else if (status === "browse") {
            ga.gRecEvent("Thankyou", "BrowseJobs", this.state.chosenJobId+' - '+this.state.chosenJob);
            const LOCID = global.getLocationId(this.props) === "" ? "" : "?locid="+global.getLocationId(this.props);
            window.location.href = "../home"+LOCID;
        }
    }

    nltobr(val) {
        return val.replace(/\n/g,'<br>');
    }
    
    getQuesName(val) {
        var RETURNNAME = "";
        var CURRENTJOBID = this.state.chosenJobId;
        var LOCALQUES = this.state.apiReturnQst;
        if (LOCALQUES.length > 0) {
            LOCALQUES.forEach(function(qst) {
                if (qst.jobid === CURRENTJOBID) {
                    var SPECIFICQUES = qst.jobques.data[0];
                    RETURNNAME = SPECIFICQUES[val].ques;
                }
            });
        }
        return RETURNNAME;  
    }
    
    getQuesImg(quesId, answerId) {
        var SPECIFICQUES = {};
        var CURRENTJOBID = this.state.chosenJobId;
        var LOCALQUES = this.state.apiReturnQst;
        if (LOCALQUES.length > 0) {
            LOCALQUES.forEach(function(qst) {
                if (qst.jobid === CURRENTJOBID) {
                    SPECIFICQUES = qst.jobques.data[0];
                }
            });
        }
        if (SPECIFICQUES !== undefined) {
            var img = SPECIFICQUES[quesId].img;
            return <tr className={ img === '' ? 'hide' : '' } >
                <td colSpan="4" align={"center"} style={{ padding:"0px 25% 20px 25%" }} >
                    <img src={ img } alt="Next" className="img-qst" />
                </td>
            </tr>
        }
    }
    
    getAnswers(quesId, answerId) {
        var SPECIFICQUES = {};
        var CURRENTJOBID = this.state.chosenJobId;
        var LOCALQUES = this.state.apiReturnQst;
        if (LOCALQUES.length > 0) {
            LOCALQUES.forEach(function(qst) {
                if (qst.jobid === CURRENTJOBID) {
                    SPECIFICQUES = qst.jobques.data[0];
                }
            });
        }
        if (SPECIFICQUES !== undefined) {
            var ansData = SPECIFICQUES[quesId].ans;
            if (ansData.length === 2) {
                return <tr className={ answerId === '' ? '' : 'hide' } >
                    <td colSpan="2" align="center" style={{ width:"50%", padding:"0px 10px 20px 40px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[0].ansid, ansData[0].nextques, ansData[0].ans, ansData[0].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                         >
                             <img src={ansData[0].img} alt={ansData[0].ans} className="img-ans" />
                             <div dangerouslySetInnerHTML={{__html:this.nltobr('1. '+ansData[0].ans)}} style={{ fontSize:"14px" }}></div>
                        </div>
                    </td>
                    <td colSpan="2" align="center" style={{ width:"50%", padding:"0px 40px 20px 10px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[1].ansid, ansData[1].nextques, ansData[1].ans, ansData[1].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                        >
                            <img src={ansData[1].img} alt={ansData[1].ans} className="img-ans" />
                            <div dangerouslySetInnerHTML={{__html:this.nltobr('2. '+ansData[1].ans)}} style={{ fontSize:"14px" }}></div>
                         </div>
                    </td>
                </tr>
            } else if (ansData.length === 3) {
                return <React.Fragment>
                 <tr className={ answerId === '' ? '' : 'hide' } >
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 10px 20px 40px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[0].ansid, ansData[0].nextques, ansData[0].ans, ansData[0].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                         >
                             <img src={ansData[0].img} alt={ansData[0].ans} className="img-ans" />
                             <div dangerouslySetInnerHTML={{__html:this.nltobr('1. '+ansData[0].ans)}} style={{ fontSize:"14px" }}></div>
                        </div>
                    </td>
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 40px 20px 10px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[1].ansid, ansData[1].nextques, ansData[1].ans, ansData[1].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                        >
                            <img src={ansData[1].img} alt={ansData[1].ans} className="img-ans" />
                            <div dangerouslySetInnerHTML={{__html:this.nltobr('2. '+ansData[1].ans)}} style={{ fontSize:"14px" }}></div>
                         </div>
                    </td>
                </tr>
                <tr className={ answerId === '' ? '' : 'hide' } >
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 10px 20px 40px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[2].ansid, ansData[2].nextques, ansData[2].ans, ansData[2].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                        >
                             <img src={ansData[2].img} alt={ansData[2].ans} className="img-ans" />
                             <div dangerouslySetInnerHTML={{__html:this.nltobr('3. '+ansData[2].ans)}} style={{ fontSize:"14px" }}></div>
                        </div>
                    </td>
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 40px 20px 10px" }} >
                        
                    </td>
                </tr>
                </React.Fragment>
            } else if (ansData.length === 4) {
                return <React.Fragment>
                 <tr className={ answerId === '' ? '' : 'hide' } >
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 10px 20px 40px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[0].ansid, ansData[0].nextques, ansData[0].ans, ansData[0].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                         >
                             <img src={ansData[0].img} alt={ansData[0].ans} className="img-ans" />
                             <div dangerouslySetInnerHTML={{__html:this.nltobr('1. '+ansData[0].ans)}} style={{ fontSize:"14px" }}></div>
                        </div>
                    </td>
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 40px 20px 10px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[1].ansid, ansData[1].nextques, ansData[1].ans, ansData[1].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                        >
                            <img src={ansData[1].img} alt={ansData[1].ans} className="img-ans" />
                            <div dangerouslySetInnerHTML={{__html:this.nltobr('2. '+ansData[1].ans)}} style={{ fontSize:"14px" }}></div>
                         </div>
                    </td>
                </tr>
                <tr className={ answerId === '' ? '' : 'hide' } >
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 10px 20px 40px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[2].ansid, ansData[2].nextques, ansData[2].ans, ansData[2].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                        >
                             <img src={ansData[2].img} alt={ansData[2].ans} className="img-ans" />
                             <div dangerouslySetInnerHTML={{__html:this.nltobr('3. '+ansData[2].ans)}} style={{ fontSize:"14px" }}></div>
                        </div>

                    </td>
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 40px 20px 10px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[3].ansid, ansData[3].nextques, ansData[3].ans, ansData[3].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                        >
                            <img src={ansData[3].img} alt={ansData[3].ans} className="img-ans" />
                             <div dangerouslySetInnerHTML={{__html:this.nltobr('4. '+ansData[3].ans)}} style={{ fontSize:"14px" }}></div>
                         </div>
                    </td>
                </tr>
                </React.Fragment>
            } else if (ansData.length === 5) {
                return <React.Fragment>
                 <tr className={ answerId === '' ? '' : 'hide' } >
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 10px 20px 40px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[0].ansid, ansData[0].nextques, ansData[0].ans, ansData[0].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                         >
                             <img src={ansData[0].img} alt={ansData[0].ans} className="img-ans" />
                             <div dangerouslySetInnerHTML={{__html:this.nltobr('1. '+ansData[0].ans)}} style={{ fontSize:"14px" }}></div>
                        </div>
                    </td>
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 40px 20px 10px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[1].ansid, ansData[1].nextques, ansData[1].ans, ansData[1].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                        >
                            <img src={ansData[1].img} alt={ansData[1].ans} className="img-ans" />
                            <div dangerouslySetInnerHTML={{__html:this.nltobr('2. '+ansData[1].ans)}} style={{ fontSize:"14px" }}></div>
                         </div>
                    </td>
                </tr>
                <tr className={ answerId === '' ? '' : 'hide' } >
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 10px 20px 40px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[2].ansid, ansData[2].nextques, ansData[2].ans, ansData[2].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                        >
                             <img src={ansData[2].img} alt={ansData[2].ans} className="img-ans" />
                             <div dangerouslySetInnerHTML={{__html:this.nltobr('3. '+ansData[2].ans)}} style={{ fontSize:"14px" }}></div>
                        </div>

                    </td>
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 40px 20px 10px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[3].ansid, ansData[3].nextques, ansData[3].ans, ansData[3].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                        >
                            <img src={ansData[3].img} alt={ansData[3].ans} className="img-ans" />
                             <div dangerouslySetInnerHTML={{__html:this.nltobr('4. '+ansData[3].ans)}} style={{ fontSize:"14px" }}></div>
                         </div>
                    </td>
                </tr>
                <tr className={ answerId === '' ? '' : 'hide' } >
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 10px 20px 40px" }} >
                        <div 
                            onClick={() => this.quesAns(quesId, ansData[4].ansid, ansData[4].nextques, ansData[4].ans, ansData[4].img)}
                            style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer" }} 
                        >
                             <img src={ansData[2].img} alt={ansData[4].ans} className="img-ans" />
                             <div dangerouslySetInnerHTML={{__html:this.nltobr('5. '+ansData[4].ans)}} style={{ fontSize:"14px" }}></div>
                        </div>
                    </td>
                    <td colSpan="2" align={"center"} style={{ width:"50%", padding:"0px 40px 20px 10px" }} >
                        
                    </td>
                </tr>
                </React.Fragment>
            }
        }
         
    }
    
    quesAns(quesid, ansid, nexid, anstxt, imgurl) {
        var newAns = [];
        this.state.apiQues.forEach(function(qst) {
            if (qst.quesid === quesid) {
                newAns.push({ quesid:qst.quesid, ansid:ansid, anstext:anstxt, img:imgurl });
            } else {
                newAns.push({ quesid:qst.quesid, ansid:qst.ansid, anstext:qst.anstext, img:qst.img });
            }
        });
        if (nexid === '') {
            this.nextStep('questions');
        } else {
           newAns.push({ quesid:nexid, ansid:"", anstext:"", img:"" }); 
        }
        this.setState({ apiQues:newAns });
    }
    
    closeMsg() {
        this.setState({ modalDisplay:"hide", modalButton:"hide", modalTxt:"", modalTxtAlign:"center" });
    }
    
    showMsg(type, txtmsg) {
        if (type === "loading") {
            this.setState({ modalDisplay:"", modalButton:"hide", modalTxt:"", modalTxtAlign:"center" });
        } else {
            this.setState({ modalDisplay:"", modalButton:"", modalTxt:txtmsg, modalTxtAlign:"left" });
        }
    }
    
    componentDidMount() {
        this.getLocalData();
        
        
        setInterval(() => {
            var count = this.state.otpCount;
            if (this.state.otpStatus === "on" && count <= 60) {
                count = count - 1;
                if (count === 0) {
                    this.setState({ otpCount:"link", otpStatus:"off" });
                } else {
                    this.setState({ otpCount:count });
                }
            } 
        }, 1000);
        

        // for parameters id
        console.log(this.props.location.search);
        const parsed = qs.parse(this.props.location.search);
        console.log(parsed);
        
        ga.gInitialize();
        ga.gPageView("JobAds");
    }

    render() {
        return (
            <div>
                
                <section className={ this.state.modalDisplay } >
                    <section className="modal-bg" ></section>
                    <section className="modal-popup" >
                        <table style={{width:"100%", height:"100%"}} >
                            <tbody>
                                <tr>
                                    <td align="center" style={{ padding:"25px"}} >
                                        <table className="modal-css" >
                                            <tbody>
                                                <tr>
                                                    <td style={{ padding:"25px" }}>
                                                        <section style={{ textAlign:this.state.modalTxtAlign }}>{ this.state.modalTxt }</section>
                                                        <section className={ this.state.modalButton === "hide" ? "" : "hide" } style={{ textAlign:"center" }} >
                                                            <img src={gifLoading} alt="Loading" style={{ width:"90px" }} />
                                                        </section>
                                                        <section className={ this.state.modalButton } style={{ textAlign:"right" }} >
                                                            <button type="button" className="btn btn-primary" onClick={ () => this.closeMsg() } style={{ marginTop:"20px", fontFamily:"Arial", width:"70px", height:"30px", fontSize:"12px" }} >OK</button>
                                                        </section> 
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </section>
                </section>
                    
                
                <div className="contnr fixed-top">
                    <div style={{ backgroundColor:"#1c5abc", textAlign:"center", padding:"20px" }} >
                        <table style={{ width:"100%" }}>
                            <tbody>
                                <tr>
                                    <td align={"center"} style={{ width:"5%"}} >
                                         <span className={ this.state.stepThanks === '' ? 'hide' : '' } onClick={() => this.backStep()} style={{ cursor:"pointer" }} >
                                            <img src={imgBack} alt="Back" style={{ height:"28px" }} />
                                         </span>
                                    </td>
                                    <td align={"center"} style={{ width:"90%"}} >
                                        <img src={imgFairPrice} alt="Fair Price" className="jobHeader" />
                                    </td>
                                    <td align={"center"} style={{ width:"5%"}} >

                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
                <div style={{ height:"77px" }} ></div>
                
                <StatusBar/>
                
                <div className={this.state.stepApply} >
                    <div className="contnr" style={{ marginBottom:"50px" }} >
                        <img 
                            src={ this.state.jobBanner }
                            alt="Job Banner"
                            style={{ width:"100%" }}
                        />
                        <div id="jobDesc" dangerouslySetInnerHTML={{__html: this.state.jobDescHtml}} ></div>
                    </div>
                    <div className="contnr">
                        <div style={{ textAlign:"center", marginBottom:"50px" }}>
                            <img src={imgBtnApply} alt="Apply Now" className="btn-apply" onClick={() => this.nextStep('apply')} />
                        </div>
                    </div>
                </div>
                
                
                
                <div className={this.state.stepNumber} >
                    <div className="contnr" style={{ marginBottom:"20px" }} >
                        <div className="bannerNum" style={{ backgroundColor:"#1c5abc", textAlign:"center" }}>
                            <img src={ imgSMS } alt="SMS" className="img-sms" />
                            <div className="txt-ttl" style={{ color:"white", margin:"10px 0px" }} >
                                <strong>Verification</strong>
                            </div>
                            <div className="txt-subttl" style={{ color:"white" }} >
                                Please enter your mobile number and we will send you the verification.
                            </div>
                        </div>
                    </div>
                    <div className="contnr" style={{ marginBottom:"50px", padding:"0px 40px" }} >
                        <div style={{ marginBottom:"20px", borderBottom:"1px solid rgb(206, 212, 218)" }} >
                            <span className="txt-subttl" ><b>Mobile Number</b></span>
                            <table style={{ width:"100%" }} >
                                <tbody>
                                    <tr>
                                        <td style={{ width:"99%" }}>
                                           <FormControl 
                                               type={ this.state.mobType }
                                               placeholder="Your mobile number" 
                                               className="mr-sm-2"
                                               value={this.state.apiTxtMobile}
                                               onChange={ this.txtMobileNo }
                                               style={{ fontWeight:"bolder", border:"0px solid #ced4da", padding:"5px 0px", fontSize:"20px" }}
                                           />
                                        </td>
                                      <td style={{ width:"1%" }}>
                                            <b onClick={ () => this.mobShowHide() } style={{ cursor:"pointer", color:"rgb(206, 212, 218)", fontSize:"18px", marginLeft:"10px" }} >
                                               { this.state.mobMsg }
                                            </b>
                                      </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className={this.state.smsTxtVerify} style={{ marginBottom:"28px", borderBottom:"1px solid rgb(206, 212, 218)" }} >
                            <span className="txt-subttl" ><b>Verification Code</b></span>
                            <table style={{ width:"100%" }} >
                                <tbody>
                                    <tr>
                                        <td style={{ width:"100%" }}>
                                           <FormControl 
                                               type="text" 
                                               placeholder="Enter 4-digit OTP" 
                                               className="mr-sm-2"
                                               value={this.state.apiTxtOTP}
                                               onChange={ this.txtOTP }
                                               style={{ fontWeight:"bolder", border:"0px solid #ced4da", padding:"5px 0px", fontSize:"20px" }}
                                           />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                       <div style={{ textAlign:"center", marginBottom:"20px" }}>
                           <img src={imgBtnNext} alt="Next" className={this.state.smsBtnNext} onClick={() => this.nextStep('sms_next')} />
                           <img src={imgBtnVerify} alt="Verify" className={this.state.smsBtnVerify} onClick={() => this.nextStep('sms_verify')} />
                       </div>
                       <div className={this.state.smsTxtVerify} style={{ textAlign:"center", marginBottom:"10px", fontSize:"15px", fontWeight:"500" }}>Did not receive OTP?</div>
                       <div className={this.state.smsTxtVerify} style={{ textAlign:"center", fontSize:"15px", fontWeight:"500" }}>
                            { this.state.otpCount === 'link' ? <a onClick={() => this.nextStep('sms_next')} style={{ color:"#007bff", cursor:"pointer" }} >Resend OTP</a> : '' }
                            { this.state.otpCount < 60 ? 'Resend in '+this.state.otpCount+' seconds' : '' }
                            { this.state.otpCount === 'wait' ? 'Wait...' : '' }
                       </div>
                    </div>
                </div>
                
                
                <div className={this.state.stepInfo} >
                    <div className="contnr" style={{ marginBottom:"20px" }} >
                        <div className="bannerNum" style={{ backgroundColor:"#1c5abc", textAlign:"center" }}>
                            <img src={ imgInfo } alt="Contact Details" className="img-sms" />
                            <div className="txt-ttl" style={{ color:"white", margin:"10px 0px" }} >
                                <strong>Contact Details</strong>
                            </div>
                            <div className="txt-subttl" style={{ color:"white" }} >
                                Please enter your name and contact details below.
                            </div>
                        </div>
                    </div>
                    <div className="contnr" style={{ marginBottom:"50px", padding:"0px 40px" }} >
                        <div style={{ marginBottom:"35px", borderBottom:"1px solid rgb(206, 212, 218)" }} >
                            <span className="txt-subttl" ><b>Name</b></span>
                            <table style={{ width:"100%" }} >
                                <tbody>
                                    <tr>
                                        <td style={{ width:"100%" }}>
                                           <FormControl 
                                               type="text" 
                                               placeholder="Your Name" 
                                               className="mr-sm-2"
                                               value={ this.state.apiTxtName }
                                               onChange={ this.txtName }
                                               style={{ fontWeight:"bolder", border:"0px solid #ced4da", padding:"5px 0px", fontSize:"20px" }}
                                           />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div style={{ marginBottom:"28px" }} >
                            <table style={{ width:"100%" }} >
                                <tbody>
                                    <tr>
                                        <td valign={"top"} style={{ width:"1%" }}>
                                            <img src={this.state.chkBoxAgree} alt="Checkbox" onClick={() => this.chkBoxAgree()} style={{ width:"28px", cursor:"pointer", margin:"5px 10px 0px 0px" }} />
                                        </td>
                                        <td style={{ width:"99%" }}>
                                            <span style={{ fontSize:"15px", lineHeight:"0", fontWeight:"500" }}>I consent to the collection, use, processing and disclosure of my personal data by NTUC Fairprice Co-operative Ltd for the purposes of assessing my suitability for the position applied for and other positions which may be available in NTUC Fairprice Co-operative Ltd and its related companies.</span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                       <div style={{ textAlign:"center", marginBottom:"20px" }}>
                           <img src={imgBtnNext} alt="Next" className="btn-apply" onClick={() => this.nextStep('dtls_next')} />
                       </div>
                    </div>
                </div>
                
                
                <div className={this.state.stepQuestions} >
                    <div className="contnr" >
                        <div style={{ fontSize:"15px", fontWeight:"500", padding:"20px 40px" }} >
                            <b className="txt-subttl" >
                                {this.state.questTitle}
                            </b>
                        </div>
                    </div>
                </div>
                <div className={this.state.stepQuestions} >
                    <div className="contnr" >
                        <div>
                        {
                            this.state.apiQues.map( qst => (
                                <div key={qst.quesid}  >
                                    <div style={{ fontSize:"15px", fontWeight:"500", padding:"20px 40px" }} >
                                        <b className="txt-subttl" >{ this.getQuesName(qst.quesid) }</b>
                                    </div>
                                    <table style={{ width:"100%" }}>
                                        <tbody>
                                            { this.getQuesImg(qst.quesid, qst.ansid) }
                                            <tr className={ qst.ansid === '' ? 'hide' : '' } >
                                                <td colSpan="4" align="center" style={{ padding:"0px 25% 20px 25%" }} >
                                                    <div style={{ backgroundColor:"#f2f2f2", padding:"10px", borderRadius:"20px", cursor:"pointer", margin:"0px 25px" }} >
                                                         <img src={ qst.img } alt={ qst.anstext } className="img-ans" />
                                                         <div dangerouslySetInnerHTML={{__html:this.nltobr(qst.anstext)}} style={{ fontSize:"14px" }}></div>
                                                    </div>
                                                </td>
                                            </tr>
                                            { this.getAnswers(qst.quesid, qst.ansid) }
                                        </tbody>
                                    </table>
                                </div>
                            ))
                        }
                        </div>
                    </div>
                </div>
                
                
                <div className={this.state.stepLocation} >
                    <div className="contnr" >
                        <div style={{fontWeight:"500", padding:"30px 50px 25px 50px" }} >
                            <b className="txt-loc" >Please choose from below your preferred working location:</b>
                            <br/>
                            <i style={{ fontSize:"15px" }} >(Maximum selection allowed is 2)</i>
                        </div>
                    </div>
                </div>
                <div className={this.state.stepLocation} >
                    <div className="contnr" >
                        <div style={{ marginBottom:"28px", padding:"0px 50px" }} >
                            <table style={{ width:"100%" }} >
                                <tbody>
                                    {
                                         this.state.selectedLoc.map((key) => (
                                            <tr key={key.locid}  >
                                                <td valign={"top"} style={{ width:"1%" }}>
                                                    <img 
                                                        src={ key.check==="" ? imgChkOff : imgChkOn } 
                                                        alt="Checkbox Location" 
                                                        onClick={() => this.checkLocation(key.locid, key.loctxt)} 
                                                        style={{ width:"28px", cursor:"pointer", margin:"5px 10px 0px 0px" }} />
                                                </td>
                                                <td style={{ width:"99%", paddingBottom:"20px"}}>
                                                    <span className="txt-loc" >{ key.loctxt }</span>
                                                </td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        </div>
                       <div style={{ textAlign:"center", marginBottom:"20px" }}>
                           <img src={imgBtnNext} alt="Next" className="btn-apply" onClick={() => this.nextStep('location')} />
                       </div>
                    </div>
                </div>
                
                
                <div className={this.state.stepThanks} >
                    <div className="contnr" style={{ marginBottom:"30px" }} >
                        <div className="bannerNum" style={{ backgroundColor:"#1c5abc", textAlign:"center" }}>
                            <img src={ imgJobApp } alt="Application Submitted" className="img-sms" />
                            <div className="txt-ttl" style={{ color:"white", margin:"10px 0px" }} >
                                <strong>Application Submitted</strong>
                            </div>
                        </div>
                    </div>
                    <div className="contnr" style={{ marginBottom:"50px", padding:"0px 8%" }} >
                            <div style={{ textAlign:"center", fontSize:"16px", fontWeight:"500" }}>
                                Thank you for your application with us.
                            </div>
                            <div style={{ textAlign:"center", fontSize:"16px", fontWeight:"500", marginBottom:"30px" }}>
                                Your application is currently being processed.
                            </div>
                            <div style={{ textAlign:"center", fontSize:"16px", fontWeight:"500", marginBottom:"28px" }}>
                            Shortlisted candidates will be contacted for an interview within <b>2 weeks</b> from the date of application.
                            </div>
                       <div style={{ textAlign:"center", marginBottom:"20px" }}>
                           <img src={imgBtnBrowse} alt="Browse Job" className="btn-apply" onClick={() => this.nextStep('browse')} />
                       </div>
                    </div>
                </div>
                
            </div>
        );
    }
};

export default Jobs;