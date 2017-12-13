import React from 'react';
import Classnames from 'classnames';
import { findDOMNode } from 'react-dom';
import ListAction from '../action/listAction';

class FilterSection extends React.Component {
    constructor(props) {
        super(props);
        this.handleLoad = this.handleLoad.bind(this);
        this.jQueryBinding = this.jQueryBinding.bind(this);
    }

    componentDidMount() {
        this.handleLoad();
    }

    handleLoad() {
        this.jQueryBinding();
    }

    jQueryBinding() {

        const el = findDOMNode(this.refs.select1);
        let props = this.props;

        $(el).select2({
            data: [{
                "id": 1,
                "text": "Option 1"
            },
            {
                "id": 2,
                "text": "Option 2"
            }]
        });

        $(el).on('change', function (e) {
            var selected_element = $(e.currentTarget);
            var select_val = selected_element.val();
            ListAction.updateList(select_val);
        });
    }

    render() {
        return (
            <div className="filter">
                <div className="filter-container">
                    <select ref="select1" className="selectBox">
                    </select>
                </div>
            </div>
        );
    }
}

export default FilterSection;