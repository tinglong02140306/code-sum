import {observable, action} from 'mobx';

class Store {
    @observable width = 100;

    @action setWidth(width) {
        this.width = width;
    }
}

export default Store;