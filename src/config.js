
export const INTERNET_CON = navigator.onLine;

export const host = window.location.host === "pwa.fastjobs.sg" ? "https://feed.fastjobs.sg/" : "https://feed-qa.fastjobs.fun/";

const parameters = "?c=kioskntuc&key=4173221dfccb31979361d4194f3b2fb7&locale=en&v=1.0";

export const API_KIOSKID = window.location.host === "pwa.fastjobs.sg" ? "1060" : "1040";

export const API_HOMETILES = host + "api/kiosk/jobs/list" + parameters;

export const API_GETOTP = host + "api/kiosk/job-app/sendotp" + parameters;
    
export const API_VERIFYOTP = host + "api/kiosk/job-app/verifyotp" + parameters;
    
export const API_SAVEUSER = host + "api/kiosk/job-app/adddetails" + parameters;
    
export const API_GETQUESTIONS = host + "api/kiosk/job-app/ques-list" + parameters;
    
export const API_SAVEQUESTIONS = host + "api/kiosk/job-app/ques-submit" + parameters;
    
export const API_GETLOCATIONS = host + "api/kiosk/job-app/listloc" + parameters;
    
export const API_SAVELOCATIONS = host + "api/kiosk/job-app/submitloc" + parameters;