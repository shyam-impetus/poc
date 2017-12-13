import ListDispatcher from '../dispatcher/listDispatcher';
import axios from 'axios';

const listActions = {
    updateList(option) {
        axios.get(`/src/app/data/${option}.json`).then(res => {
            ListDispatcher.handleAction({
                type: 'UPDATE_ITEM',
                data: res.data
            });
        });
    }
};

export default listActions;