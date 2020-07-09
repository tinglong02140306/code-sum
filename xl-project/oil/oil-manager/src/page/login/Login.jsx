import React from 'react';
import "./Login.scss"
import Logo from "./image/logo.png"
import {Input, Icon, Checkbox, Button,message} from 'antd';
import {isEmpty} from "../../utils/isEmpty";
import {inject, observer} from 'mobx-react';
import {withRouter} from 'react-router-dom';
import {isSpecialChart} from "../../utils/isSpecialChart";
import ChangePasswordDialog from '../../component/usermenu/ChangePasswordDialog';

@inject("loginStore")
@observer
class Login extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            username: '',
            password: '',
            identify:"",
            loading: false,
            isEmptyUserName: false,
            isEmptyPassword: false,
            isCheck: false,
            changePsw:false,
            code: '',
            codeLength: 4,
            fontSizeMin: 20,
            fontSizeMax: 22,
            backgroundColorMin: 240,
            backgroundColorMax: 250,
            colorMin: 10,
            colorMax: 20,
            lineColorMin: 40,
            lineColorMax: 180,
            contentWidth: 96,
            contentHeight: 38,
            showError: false, // 默认不显示验证码的错误信息
        };
    }

    emitEmptyUserName = () => {
        this.userNameInput.focus();
        this.setState({username: ''});
    }

    emitEmptyPassword = () => {
        this.PasswordInput.focus();
        this.setState({password: ''});
    }

    onChangeUserName = (e) => {
        this.setState({username: e.target.value});
    }

    onChangePasswordName = (e) => {
        this.setState({password: e.target.value});
    }

    onChangeIdentify = e=>{
        this.setState({identify: e.target.value});
    }

    onChangeCheckBox = (e) => {
        this.setState({isCheck: e.target.checked});
    }

    enterLoading = () => {
        if (!this.state.username) {
            this.setState({
                isEmptyUserName: true
            });
        } else {
            this.setState({
                isEmptyUserName: false
            });
        }
        if (!this.state.password) {
            this.setState({
                isEmptyPassword: true
            });
        } else {
            this.setState({
                isEmptyPassword: false
            });
        }
        if(this.state.identify.toUpperCase()!==this.state.code.toUpperCase()){
            this.setState({showError: true});
            this.reloadPic();
        }else{
            this.setState({
                showError: false
            });
        }
        const {history} = this.props;
        if (this.state.username && this.state.password &&(this.state.identify.toUpperCase()===this.state.code.toUpperCase())) {
            const username = this.state.username;
            const password = this.state.password;
            localStorage.setItem('username', username);
            if (this.state.isCheck) {
                localStorage.setItem('password', password);
            } else {
                localStorage.setItem('password', "");
            }
            this.props.loginStore.getLogin(this.state.username, this.state.password, (isSuccess,menus)=> {
                if(isSuccess){
                    if (menus&&menus[0].sub) {
                        let openKey = menus[0].key;
                        let selectedKey = menus[0].sub[0].key;
                        localStorage.setItem('openKey',openKey);
                        localStorage.setItem('selectedKey',selectedKey);
                        localStorage.setItem('isLogin', "1");
                        let menusStr = JSON.stringify(menus);
                        localStorage.setItem('menus',menusStr);
                        history.push(selectedKey);
                    }else {
                        message.error('菜单解析出错')
                    }
                }else{
                    this.reloadPic();
                    if(menus==='50003'){//需强制用户修改密码
                        this.setState({changePsw:true})
                    }
                }
            });
        }
    }

    componentWillMount() {
        this.canvas = React.createRef()
    }

    componentDidMount() {
        this.drawPic();
        if (!isEmpty(localStorage.getItem('username'))) {
            this.setState({username: localStorage.getItem('username')});
            if (!isEmpty(localStorage.getItem('password'))) {
                this.setState({password: localStorage.getItem('password'), isCheck: true});
            } else {
                this.setState({password: "", isCheck: false});
            }
        }
    }

    // 生成一个随机数
    randomNum = (min, max) => {
        return Math.floor(Math.random() * (max - min) + min)
    }

    drawPic = () => {
        this.randomCode()
    }

    // 生成一个随机的颜色
    // eslint-disable-next-line react/sort-comp
    randomColor(min, max) {
        const r = this.randomNum(min, max)
        const g = this.randomNum(min, max)
        const b = this.randomNum(min, max)
        return `rgb(${r}, ${g}, ${b})`
    }

    drawText(ctx, txt, i) {
        ctx.fillStyle = this.randomColor(this.state.colorMin, this.state.colorMax)
        const fontSize = this.randomNum(this.state.fontSizeMin, this.state.fontSizeMax)
        ctx.font = fontSize + 'px SimHei'
        const padding = 10;
        const offset = (this.state.contentWidth - 40) / (this.state.code.length - 1)
        let x = padding;
        if (i > 0) {
            x = padding + (i * offset)
        }
        let y = this.randomNum(this.state.fontSizeMax, this.state.contentHeight - 5)
        if (fontSize > 40) {
            y = 40
        }
        const deg = this.randomNum(-10, 10)
        // 修改坐标原点和旋转角度
        ctx.translate(x, y)
        ctx.rotate(deg * Math.PI / 180)
        ctx.fillText(txt, 0, 0)
        // 恢复坐标原点和旋转角度
        ctx.rotate(-deg * Math.PI / 180)
        ctx.translate(-x, -y)
    }

    drawLine(ctx) {
        // 绘制干扰线
        for (let i = 0; i < 1; i++) {
            ctx.strokeStyle = this.randomColor(this.state.lineColorMin, this.state.lineColorMax)
            ctx.beginPath()
            ctx.moveTo(this.randomNum(0, this.state.contentWidth), this.randomNum(0, this.state.contentHeight))
            ctx.lineTo(this.randomNum(0, this.state.contentWidth), this.randomNum(0, this.state.contentHeight))
            ctx.stroke()
        }
    }

    drawDot(ctx) {
        // 绘制干扰点
        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = this.randomColor(0, 255)
            ctx.beginPath()
            ctx.arc(this.randomNum(0, this.state.contentWidth), this.randomNum(0, this.state.contentHeight), 1, 0, 2 * Math.PI)
            ctx.fill()
        }
    }

    // 随机生成验证码
    randomCode() {
        let random = ''
        // 去掉了I l i o O,可自行添加
        const str = 'QWERTYUPLKJHGFDSAZXCVBNMqwertyupkjhgfdsazxcvbnm1234567890'
        for (let i = 0; i < this.state.codeLength; i++) {
            const index = Math.floor(Math.random() * 57);
            random += str[index];
        }
        this.setState({
            code: random
        }, () => {
            const canvas = this.canvas.current;
            const ctx = canvas.getContext('2d')
            ctx.textBaseline = 'bottom'
            // 绘制背景
            ctx.fillStyle = this.randomColor(this.state.backgroundColorMin, this.state.backgroundColorMax)
            ctx.fillRect(0, 0, this.state.contentWidth, this.state.contentHeight)
            // 绘制文字
            for (let i = 0; i < this.state.code.length; i++) {
                this.drawText(ctx, this.state.code[i], i)
            }
            this.drawLine(ctx)
            this.drawDot(ctx)
        })
    }

    reloadPic = () => {
        this.drawPic();
        this.setState({identify:""});
    }

    onKeydown = (e) => {
        if (e.key === 'Enter'){
            this.enterLoading();
        }
    }

    onCancel = () =>{
        this.setState({changePsw:false});
    }

    onChangeSuccess = () =>{
        this.reloadPic();
        this.setState({changePsw:false,identify:""});
    }

    render() {
        const {username,password,identify,changePsw, showError} = this.state;
        const suffixUserName = username ?
            <Icon type="close-circle" onClick={this.emitEmptyUserName} style={{color: "#d5d5d5"}}/> : null;
        const suffixPassword = password ?
            <Icon type="close-circle" onClick={this.emitEmptyPassword} style={{color: "#d5d5d5"}}/> : null;
        return (
            <div className="login-div">
                <div className="login-container">
                    <img src={Logo} alt="山东高速"/>
                    {/*<a id="name">加油后台管理系统</a>*/}
                    <Input
                        type="text"
                        value={username}
                        suffix={suffixUserName}
                        className="login-container-input"
                        placeholder="用户名"
                        style={{width:250,margin:0}}
                        onChange={this.onChangeUserName}
                        onKeyDown={this.onKeydown}
                        ref={node => this.userNameInput = node}
                        prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}}/>}/>
                    <div style={{visibility: this.state.isEmptyUserName ? "visible" : "hidden"}}>请输入正确的用户名</div>
                    <Input
                        type="password"
                        value={password}
                        suffix={suffixPassword}
                        className="login-container-input"
                        placeholder="密码"
                        style={{width:250,margin:0}}
                        onChange={this.onChangePasswordName}
                        onKeyDown={this.onKeydown}
                        ref={node => this.PasswordInput = node}
                        prefix={<Icon type="lock" style={{color: 'rgba(0,0,0,.25)'}}/>}/>
                    <div style={{visibility: this.state.isEmptyPassword ? "visible" : "hidden"}}>请输入密码
                    </div>
                    <div className="identify-box">
                        <Input  
                            className="identify-input"
                            placeholder="验证码"
                            value={identify}
                            onChange={this.onChangeIdentify}></Input>
                        <canvas 
                            ref={this.canvas}
                            width='100'
                            height='40'
                            onClick={this.reloadPic}>
                        </canvas>
                    </div>
                    <div style={{visibility: showError ? "visible" : "hidden"}}>请输入正确的验证码</div>
                    <div className="login-check-container">
                        <Checkbox
                            className="login-check-box"
                            checked={this.state.isCheck}
                            onChange={this.onChangeCheckBox}>记住密码</Checkbox>
                    </div>
                    <Button type="primary"
                            className="login-button"
                            onClick={this.enterLoading}
                            loading={this.props.loginStore.isLoading}>
                        登录
                    </Button>
                </div>
                {changePsw ? <ChangePasswordDialog title="密码过于简单,请重置密码" visible={changePsw} onCancel={this.onCancel} onChangeSuccess={this.onChangeSuccess}/> : null}
            </div>
        );
    }
}

export default withRouter(Login);