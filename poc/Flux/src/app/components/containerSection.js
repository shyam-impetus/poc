import React from 'react';
import Classnames from 'classnames';

class ContainerSection extends React.Component {
    constructor(props) {
        super(props);
    }

    getListItem() {
        return this.props.list.map((x, i) => {
            return (
                <li key={i} className="card">
                    <div className="card-image-container">
                        <img src={x.srcImg} />
                    </div>
                    <div className="card-description">
                        <p>{x.label}</p>
                    </div>
                </li>
            );
        });
    }

    render() {
        return (
            <div className="content">
                <ul className="cardSection"> {this.getListItem()} </ul>
            </div>
        );
    }
}

export default ContainerSection;