import {observable,action} from 'mobx';
class GlobalStore {
    @observable menus = [];
    @action setMenus(menus){
        this.menus = menus;
    }
}

export default GlobalStore;