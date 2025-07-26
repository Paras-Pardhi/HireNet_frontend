import React from "react"
// import {errorimg} from '../../public/errorboundry.png'

class Errorboundry extends React.Component {
    constructor(props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    };

    componentDidCatch(error, errorInfo) {
        console.error("Error caught by ErrorBoundry", error, errorInfo)
    }

    handleRefresh(){
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="error-container">
                <div className="error-img">
                    <img src="/errorboundry.png" alt="" />
                </div>
                    <button onClick={this.handleRefresh} className="refresh-btn">Refresh</button>
                </div>
            )
        }
       return this.props.children
    }
}

export default Errorboundry;