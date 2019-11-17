import React, { Component } from 'react';

class Status extends Component {
    state = { online_offline: "offline" }
    
    internetChecker() {
        setInterval(() => { 
            if (navigator.onLine) {
                this.setState({ online_offline:"online" });
            } else {
                this.setState({ online_offline:"offline" });
            }
        }, 1000);
    }
        
    componentDidMount() {
        this.internetChecker();
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className={`contnr fixed int-con ${this.state.online_offline}`} >
                    { this.state.online_offline === "online" ? "Online" : "No connection" }
                </div>
            </React.Fragment>
        );
    }
};
 
export default Status;