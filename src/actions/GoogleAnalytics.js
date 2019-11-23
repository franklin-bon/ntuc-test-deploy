import ReactGA from 'react-ga';

const tracking_id = "UA-130371837-2";

export function gInitialize() {
    //console.log("Rendered Google Analysis");
    ReactGA.initialize(tracking_id);
}

export function gPageView(pageName) {
    if (pageName !== "") {
        //console.log("Rendered Page View", pageName);
        ReactGA.pageview(pageName);
    }
}

export function gRecEvent(category, action, label) {
    //console.log("Rendered Google Event", category + ' -- ' + action + ' -- ' + label);
    ReactGA.event({
        category: category,
        action: action,
        label: label
    });
}

export function gDim(dimnum, val) {
    if (dimnum === 1) { //for locid
        var locid = "";
        if (val === null || val === "" ) {
            locid = "0";
        } else { locid = val; }
        console.log("Rendered Google Dimension Number "+dimnum, locid);
        ReactGA.set({ 'dimension1': val });
    }
}