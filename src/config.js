import * as qs from 'query-string';

export const API_LINK = process.env.NODE_ENV === "development" ? "https://feed-qa.fastjobs.fun/" : "https://feed.fastjobs.sg/";

const API_PARAMETERS = "?c=kioskntuc&key=4173221dfccb31979361d4194f3b2fb7&locale=en&v=1.0";

export const API_KIOSKID = process.env.NODE_ENV === "development" ? "1040" : "1060";

export const API_HOMETILES = API_LINK+"api/kiosk/jobs/list"+API_PARAMETERS;

export const API_GETOTP = API_LINK+"api/kiosk/job-app/sendotp"+API_PARAMETERS;
    
export const API_VERIFYOTP = API_LINK+"api/kiosk/job-app/verifyotp"+API_PARAMETERS;
    
export const API_SAVEUSER = API_LINK+"api/kiosk/job-app/adddetails"+API_PARAMETERS;
    
export const API_GETQUESTIONS = API_LINK+"api/kiosk/job-app/ques-list"+API_PARAMETERS;
    
export const API_SAVEQUESTIONS = API_LINK+"api/kiosk/job-app/ques-submit"+API_PARAMETERS;
    
export const API_GETLOCATIONS = API_LINK+"api/kiosk/job-app/listloc"+API_PARAMETERS;
    
export const API_SAVELOCATIONS = API_LINK+"api/kiosk/job-app/submitloc"+API_PARAMETERS;

export function getLocationId(thisProps) {
    //----- start - save location id parameter -----//
    let locid = thisProps.location.search;
    if (locid.trim() !== "") {
        const PARSED = qs.parse(thisProps.location.search);
        if (PARSED.locid === undefined) {
            locid="";
        } else {
            locid = PARSED.locid;
        }
    } else { 
        locid=""; 
    }
    localStorage.setItem('locID', locid);
    return locid;
    //----- end - save location id parameter -----//
}