import ReactGA from 'react-ga';

const tracking_id = "UA-130371837-2";

export function gInitialize() {
    console.log("Rendered Google Analysis");
    ReactGA.initialize(tracking_id);
}

export function gPageView(pageName) {
    if (pageName !== "") {
        console.log("Rendered Page View", pageName);
        ReactGA.pageview(pageName);
    }
}

export function gRecEvent(category, action) {
    console.log("Rendered Google Event", category + ' -- ' + action);
    ReactGA.event({
        category: category,
        action: category
    });
}

