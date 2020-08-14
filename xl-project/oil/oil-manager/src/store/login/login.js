import {
    observable,
    action
} from 'mobx';
import http from "../../http/http";
import {
    message
} from 'antd';
import {
    menus
} from '../../page/login/menus';
import { encrypt } from "../../utils/RSAUtil";

class LoginStore {
    @observable isLoginSuccess = false;

    @action setIsLoginSuccess(isLoginSuccess) {
        this.isLoginSuccess = isLoginSuccess;
    }

    @observable isLoading = false;

    @action setIsLoading(isLoading) {
        this.isLoading = isLoading;
    }

    @action getLogin(username, password, identify, callBack) {
        this.setIsLoading(true);
        const reqDate = {
            username: username,
            password: password,
            check_code: identify,
        }
        http.post("/website/user/user-login", encrypt(JSON.stringify(reqDate)), response => {
            this.setIsLoading(false);
            localStorage.setItem('real_name', response.real_name);
            localStorage.setItem('partner_id', response.partner_id);
            // localStorage.setItem('partner_id', '100');
            localStorage.setItem('nick_name', response.nick_name);
            callBack(true, menus(response.page_array));
        }, (err, code) => {
            this.setIsLoading(false);
            callBack(false, code);
            if (code !== '50003') {
                message.error(err);
            }
        });
    }
}

export default LoginStore;