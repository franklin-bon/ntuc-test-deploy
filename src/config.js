import * as qs from 'query-string';

export const API_LINK = process.env.NODE_ENV === "development" ? "https://feed-qa.fastjobs.sg/" : "https://feed.fastjobs.sg/";

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


export const sample_tiles = {
    "isSuccess": 1,
    "code": "00",
    "message": [],
    "totalResult": 6,
    "data": [
        {
            "kioskjobid": "1022",
            "kioskid": "1040",
            "jobid": "1022",
            "jobttl": "CASHIER",
            "bannerurl": "https://www.fastjobs.sg/img/kiosk/jobs/banner/banner-cashier.jpg?t=1573928535",
            "desc": "<p style=\"text-align: center; font-size: 35px; margin: 0; padding: 0;\"><strong>Job Responsibilities</strong></p><p style=\"margin: 0; padding: 0;\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://www.fastjobs.sg/img/kiosk/jobs/desc/cashier.jpg?t=1552030242\" alt=\"\" width=\"100%\" /></p><p style=\"text-align: center; font-size: 35px; padding: 0;\"><strong>Working Hours</strong> </p><ul style=\"font-size: 26px;width:80%;margin:0 auto; padding-left: 15%;\"><li>6 days work week (including Weekends & Public Holidays)</li><li>Rotating shift<ul style=\"list-style: none; margin:0 auto; padding-left: 5%;\"><li>- Full-Time: 7am–3pm / 3pm–11pm</li><li>- Part-Time: 7am–12pm / 12pm–5pm / 5pm–10pm</li></ul></li><li>Permanent night shift (11pm–7am) position available</li></ul>",
            "img": "https://www.fastjobs.sg/img/kiosk/jobs/fairprice-cashier.jpg?t=1573928535"
        },
        {
            "kioskjobid": "1021",
            "kioskid": "1040",
            "jobid": "1021",
            "jobttl": "RETAIL ASSISTANT",
            "bannerurl": "https://www.fastjobs.sg/img/kiosk/jobs/banner/banner-retail-assistant.jpg?t=1573928535",
            "desc": "<p style=\"text-align: center; font-size: 35px; margin: 0; padding: 0;\"><strong>Job Responsibilities</strong></p><p style=\"margin: 0; padding: 0;\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://www.fastjobs.sg/img/kiosk/jobs/desc/retail-assistant.jpg?t=1552030242\" width=\"100%\" /></p><p style=\"text-align: center; font-size: 35px;\"><strong>Working Hours</strong></p><ul style=\"font-size: 26px;width:80%;margin:0 auto; padding-left: 15%;\"><li>6 days work week (including Weekends & Public Holidays)</li><li>Rotating shift<ul style=\"list-style: none; margin:0 auto; padding-left: 5%;\"><li>- Full-Time: 7am–3pm / 3pm–11pm</li><li>- Part-Time: 7am–12pm / 12pm–5pm / 5pm–10pm</li></ul></li><li>Permanent night shift (11pm–7am) position available</li></ul>",
            "img": "https://www.fastjobs.sg/img/kiosk/jobs/fairprice-retail-assistance.jpg?t=1573928535"
        },
        {
            "kioskjobid": "1020",
            "kioskid": "1040",
            "jobid": "1020",
            "jobttl": "ONLINE PICKER",
            "bannerurl": "https://www.fastjobs.sg/img/kiosk/jobs/banner/banner-online-fulfilment-assistant.jpg?t=1573928535",
            "desc": "<p style=\"text-align: center; font-size: 35px; margin: 0; padding: 0;\"><strong>Job Responsibilities</strong></p><p style=\"margin: 0; padding: 0;\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://www.fastjobs.sg/img/kiosk/jobs/desc/online-picker.jpg?t=1552030242\" alt=\"\" width=\"100%\" /></p><p style=\"text-align: center; font-size: 35px;\"><strong>Working Hours</strong></p><ul style=\"font-size: 26px;width:80%;margin:0 auto; padding-left: 15%;\"><li>6 days work week (including Weekends & Public Holidays)</li><li>Rotating shift<ul style=\"list-style: none; margin:0 auto; padding-left: 5%;\"><li>- Full-Time: 7am–3pm / 3pm–11pm</li></ul></li></ul>",
            "img": "https://www.fastjobs.sg/img/kiosk/jobs/fairprice-online-fulfilment-assistance.jpg?t=1573928535"
        },
        {
            "kioskjobid": "1025",
            "kioskid": "1040",
            "jobid": "1025",
            "jobttl": "RETAIL SUPERVISOR",
            "bannerurl": "https://www.fastjobs.sg/img/kiosk/jobs/banner/banner-retail-supervisor.jpg?t=1573928535",
            "desc": "<p style=\"text-align: center; font-size: 35px; margin: 0; padding: 0;\"><strong>Job Responsibilities</strong></p><p style=\"margin: 0; padding: 0;\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://www.fastjobs.sg/img/kiosk/jobs/desc/retail-supervisor.jpg?t=1552030242\" alt=\"\" width=\"100%\" /></p><p style=\"text-align: center; font-size: 35px;\"><strong>Working Hours</strong></p><ul style=\"font-size: 26px;width:80%;margin:0 auto; padding-left: 15%;\"><li>6 days work week (including Weekends & Public Holidays)</li><li>Rotating shift<ul style=\"list-style: none; margin:0 auto; padding-left: 5%;\"><li>- Full-Time: 7am–3pm / 3pm–11pm</li></ul></li><li>Permanent night shift (11pm–7am) position available</li></ul>",
            "img": "https://www.fastjobs.sg/img/kiosk/jobs/fairprice-retail-supervisor.jpg?t=1573928535"
        },
        {
            "kioskjobid": "1024",
            "kioskid": "1040",
            "jobid": "1024",
            "jobttl": "STOREKEEPER",
            "bannerurl": "https://www.fastjobs.sg/img/kiosk/jobs/banner/banner-storekeeper.jpg?t=1573928535",
            "desc": "<p style=\"text-align: center; font-size: 35px; margin: 0; padding: 0;\"><strong>Job Responsibilities</strong></p><p style=\"margin: 0; padding: 0;\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://www.fastjobs.sg/img/kiosk/jobs/desc/storekeeper.jpg?t=1552030242\" alt=\"\" width=\"100%\" /><br /></p><p style=\"text-align: center; font-size: 35px;\"><strong>Working Hours</strong></p><ul style=\"font-size: 26px;width:80%;margin:0 auto; padding-left: 15%;\"><li>6 days work week (including Weekends & Public Holidays)</li></ul>",
            "img": "https://www.fastjobs.sg/img/kiosk/jobs/fairprice-storekeeper.jpg?t=1573928535"
        },
        {
            "kioskjobid": "1023",
            "kioskid": "1040",
            "jobid": "1023",
            "jobttl": "SKILLED CUTTER",
            "bannerurl": "https://www.fastjobs.sg/img/kiosk/jobs/banner/banner-skilled-cutter.jpg?t=1573928535",
            "desc": "<p style=\"text-align: center; font-size: 35px; margin: 0; padding: 0;\"><strong>Job Responsibilities</strong></p><p style=\"margin: 0; padding: 0;\"><img style=\"display: block; margin-left: auto; margin-right: auto;\" src=\"https://www.fastjobs.sg/img/kiosk/jobs/desc/skilled-cutter.jpg?t=1552030242\" alt=\"\" width=\"100%\" /></p><p style=\"text-align: center; font-size: 35px;\"><strong>Working Hours</strong></p><ul style=\"font-size: 26px;width:80%;margin:0 auto; padding-left: 15%;\"><li>6 days work week (including Weekends & Public Holidays)</li><li>Rotating shift<ul style=\"list-style: none; margin:0 auto; padding-left: 5%;\"><li>- Full-Time: 7am–3pm / 3pm–11pm</li><li>- Part-Time: 7am–12pm / 12pm–5pm / 5pm–10pm</li></ul></li></ul>",
            "img": "https://www.fastjobs.sg/img/kiosk/jobs/fairprice-skilled-cutter.jpg?t=1573928535"
        }
    ]
    }
