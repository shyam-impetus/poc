import React from 'react';
import HeaderSection from './components/headerSection';
import ContentSection from './components/containerSection';
import FilterSection from './components/filterSection';
import ListStore from './store/listStore';
import ListAction from './action/listAction';

class App extends React.Component {
    constructor() {
        super();
        this.state = {
            list: []
        }
        this.onChange = this.onChange.bind(this);
    }    

    componentDidMount() {
        ListAction.updateList(1);
        ListStore.addChangeListener(this.onChange);
    }

    componentWillUnmount() {
        ListStore.removeChangeListener(this.onChange);
    }

    onChange() {
        this.setState({list: ListStore.getList()});
    }

    render() {
        return(
            <div>
                <HeaderSection/>
                <FilterSection/>
                <ContentSection list={this.state.list}/>
            </div>
        );
    }
}

export default App;