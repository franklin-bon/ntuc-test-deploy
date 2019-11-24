import * as qs from 'query-string';
import * as config from '../config.js';

export function clean_mobilenum(mobilenum) {
    let error = 0;
    mobilenum.split("").map((key) => {
        if (key === " ") { error++; }
    });
    return error;
}

function isnumbers(num) {
    let error = 0;
    num.split("").map((key) => {
        if (key.trim()!=="" && isNaN(key)===true) { 
            error++; 
        }
    });
    return error;
}

export function validate_sgmobilenum(mobilenum) {
    let error = 0;
    const MOBNUM = mobilenum.trim();
    const MOBNUMLEN = MOBNUM.length;
    if(MOBNUM === "") { error++; } else {
        if (MOBNUMLEN === 8) { 
            const fir_char = MOBNUM.charAt(0);
            if (fir_char ==="8" || fir_char ==="9") {
                //
            } else { error++; }
        } else if (MOBNUMLEN === 10) { 
            const begin_char = MOBNUM.substring(0,2);
            const fir_char = MOBNUM.charAt(2);
            if (begin_char === "65") {
                if (fir_char ==="8" || fir_char ==="9") {
                    //
                } else { error++; }
            } else { error++;}
        } else if (MOBNUMLEN === 11) { 
            const begin_char = MOBNUM.substring(0,3);
            const fir_char = MOBNUM.charAt(3);
            if (begin_char === "+65") {
                if (fir_char ==="8" || fir_char ==="9") {
                    //
                } else { error++; }
            } else { error++; }
        } else { error++; }
    }
    return error;
}

export function validate_mymobilenum(mobilenum) {
    let error = 0;
    const MOBNUM = mobilenum.trim();
    const MOBNUMLEN = MOBNUM.length;
    if(MOBNUM === "") { error++; } else {
        var country_code = MOBNUM.substring(0,3);
        if (country_code === "+60") { //for complete number
            const loc_code = MOBNUM.substring(3,5);
            if (loc_code==="10" || loc_code==="11" || loc_code==="12" || loc_code==="13" || loc_code==="14" || loc_code==="15" || loc_code==="16" || loc_code==="17" || loc_code==="18" || loc_code==="19") {
                var trim_num = MOBNUM.substr(5);
                if (trim_num.length===6 || trim_num.length===7 || trim_num.length===8 || trim_num.length===9) {
                    if (isnumbers(trim_num) > 0) { error++; }
                } else { error++; }
            } else { error++; }
        } else {
            var country_code = MOBNUM.substring(0,2);
            if (country_code === "60") { //for complete number w/o +
                const loc_code = MOBNUM.substring(2,4);
                if (loc_code==="10" || loc_code==="11" || loc_code==="12" || loc_code==="13" || loc_code==="14" || loc_code==="15" || loc_code==="16" || loc_code==="17" || loc_code==="18" || loc_code==="19") {
                    var trim_num = MOBNUM.substr(4);
                    if (trim_num.length===6 || trim_num.length===7 || trim_num.length===8 || trim_num.length===9) {
                        if (isnumbers(trim_num) > 0) { error++; }
                    } else { error++; }
                } else { error++; }
            } else {
                const loc_code = MOBNUM.substring(0,2);
                if (loc_code==="10" || loc_code==="11" || loc_code==="12" || loc_code==="13" || loc_code==="14" || loc_code==="15" || loc_code==="16" || loc_code==="17" || loc_code==="18" || loc_code==="19") {
                    var trim_num = MOBNUM.substr(2);
                    if (trim_num.length===6 || trim_num.length===7 || trim_num.length===8 || trim_num.length===9) {
                        if (isnumbers(trim_num) > 0) { error++; }
                    } else { error++; }
                } else { error++; }
            }
        }
    }
    return error;
}

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

export function tolink(txt) {
    var link = txt;
    link = link.replace(/ /g, "-");
    link = link.toLowerCase();
    return link;
}

export function tojob(txt) {
    var link = txt;
    link = link.replace(/-/g, " ");
    link = link.toUpperCase();
    return link;
}

export function getApiJobs() {
    let API_URL = config.API_HOMETILES;
    let API_KIOSID = config.API_KIOSKID;

    //--- api request ---//
    var formData = new FormData();
    formData.append('kioskid', API_KIOSID);
    fetch(API_URL, {
        method: 'POST',
        body: formData
    }).then(response => {
        return response.json();
    }).then(json => {
        console.log("global home tiles",json);
        if (json.code === "00") {
            localStorage.setItem('homeTiles', JSON.stringify(json.data)); //stored api data to local storage
        }
    }).catch(error => {
        console.log('There has been a problem with fetching (Job List API): ',error);
    });
}