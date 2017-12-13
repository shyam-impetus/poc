import React from 'react';
import EventEmitter from 'events';
import ListDispatcher from '../dispatcher/listDispatcher';

let store = {
    list: []
};

let updateItem = (item) => {
    store.list = item;
};

class ListStore extends EventEmitter {
    getList() {
        return store.list;
    }

    emitChange() {
        this.emit('change');
    }

    addChangeListener(cb) {
        this.on('change', cb);
    }

    removeChangeListener(cb) {
        this.removeListener('change', cb);
    }
}

let listStore = new ListStore;

ListDispatcher.register((payload) => {
    const action = payload.action;
    switch (action.type) {
        case 'UPDATE_ITEM':
            updateItem(action.data);
            listStore.emitChange();
            break;
        default:
            return true;
    }
});

export default listStore;