import {observable,action} from 'mobx';
class RouterStore {
    @observable history = "";
    @action
    setHistory(history) {
        this.history = history;
    }
}
export default RouterStore;