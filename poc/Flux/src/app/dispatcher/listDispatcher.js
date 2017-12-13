import {Dispatcher} from 'flux';

class ListDispatcher extends Dispatcher {
    handleAction(action) {
        this.dispatch({
            source: 'VIEW_ACTION',
            action
        });
    }
}

export default new ListDispatcher;

