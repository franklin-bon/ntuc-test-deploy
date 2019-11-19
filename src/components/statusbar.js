import React, { Component } from 'react';

class Status extends Component {
    state = { online_offline:"offline", fade:"fadeOut" }
    
    internetChecker() {
        setInterval(() => {
            if (navigator.onLine) {
                this.setState({ online_offline:"online", fade:"fadeOut" });
            } else {
                this.setState({ online_offline:"offline", fade:"fadeIn" });
            }
        }, 1000);
    }
        
    componentDidMount() {
        this.internetChecker();
    }

    render() { 
        return ( 
            <React.Fragment>
                <div className={`contnr fixed ${this.state.fade} int-con offline`} >No connection</div>
            </React.Fragment>
        );
    }
};
 
export default Status;