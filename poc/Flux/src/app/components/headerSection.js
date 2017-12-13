import React from 'react';
import Classnames from 'classnames';

class HeaderSection extends React.Component {
    constructor(props) {
        super(props);
    }

    getButton() {
        return (
            <a href="http://www.google.com" className="button js-button">Show content</a>
        );
    }

    render() {
        return (
            <div className="header">
                <div className="title">Landing Page</div>
                <div className="view">
                    {this.getButton()}
                </div>
            </div>
        );
    }
}

export default HeaderSection;