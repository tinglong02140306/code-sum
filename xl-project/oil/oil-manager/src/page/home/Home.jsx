import React from 'react';
import "./Home.scss";
import {withRouter} from 'react-router-dom';
import SiderMenu from "../../component/sidermenu/SiderMenu";
import {Layout, Dropdown,Menu} from 'antd';
import CRouter from "../../router/router";
import {inject, observer} from "mobx-react";
import ChangePasswordDialog from "../../component/usermenu/ChangePasswordDialog";
import {Redirect} from 'react-router-dom';

const {Header, Content} = Layout;
const HOME_TOP_HEIGHT = 65;
const HOME_LEFT_WIDTH = 200;

@inject("homeStore")
@observer
class Home extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            width: document.body.clientWidth,
            height:window.screen.availHeight,
            collapsed: false,
            mode: 'inline',
            openKey: localStorage.getItem('openKey'),
            selectedKey: localStorage.getItem('selectedKey'),
            firstHide: false,
            modalVisible :false,
            changePsw : false
        };
    }

    componentDidMount() {
        this.setState({
            width: document.body.clientWidth,
            height:document.body.clientHeight,
        });
        window.addEventListener('resize', this.onWindowResize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.onWindowResize)
    }

    onWindowResize = () => {
        this.setState({
            width:document.body.clientWidth,
            height:document.body.clientHeight
        });
    }

    menuClick = e => {
        this.setState({
            selectedKey: e.key
        });
        localStorage.setItem('selectedKey',e.key);
        const { popoverHide } = this.props;
        popoverHide && popoverHide();
    };

    openMenu = v => {
        this.setState({
            openKey: v[v.length - 1],
            firstHide: false,
        })
        localStorage.setItem('openKey', v[v.length - 1]);
    };

    onCancel = () =>{
        this.setState({changePsw:false})
    }

    onChangeSuccess = () => {
        this.setState({changePsw:false});
        this.props.history.push("/login");
    }

    render() {
        const {width,height,changePsw} = this.state;
        const menusJson = localStorage.getItem('menus');
        const menus = JSON.parse(menusJson);
        const menuOverlay=( <Menu>
            <Menu.Item>
                <a onClick={()=>{
                    this.setState({changePsw:true})
                }}>修改密码</a>
            </Menu.Item>
            <Menu.Item>
                <a onClick={()=>{
                    this.props.homeStore.getLogOut((isSuccess) => {
                        if(isSuccess){
                            localStorage.setItem('real_name',null);
                            localStorage.setItem('partner_id',null);
                            localStorage.setItem('partner_name',null);
                            localStorage.setItem('isLogin',"0");
                            this.props.history.push("/login")
                        } 
                    });
                }}>退出登录</a>
            </Menu.Item>
        </Menu>);

        return (
            <div className='home-layout-container' style={{width:width}}>
                <Header className="home-header-container" style={{height:HOME_TOP_HEIGHT}}>
                    <div className="home-header-left">
                        <div className="home-header-left-logo">
                            <span>加油后台管理系统</span>
                        </div>
                    </div>
                    <div className="home-header-right" >
                        <div className="home-header-right-login">
                            <Dropdown overlay={menuOverlay}>
                                <div>
                                    <img alt="用户" src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=313907760,3566551337&fm=27&gp=0.jpg"/>
                                </div>
                            </Dropdown>
                        </div>
                    </div>
                </Header>
                <Content className="home-content-container">
                    <div className='home-sider-box' style={{height:height-65}}>
                        <SiderMenu
                            menus={menus}
                            theme="dark"
                            mode="inline"
                            inlineCollapsed={this.state.collapsed}
                            className="home-content-menu"
                            onClick={this.menuClick}
                            selectedKeys={[this.state.selectedKey]}
                            openKeys={this.state.firstHide ? null : [this.state.openKey]}
                            onOpenChange={this.openMenu}
                            style={{width:HOME_LEFT_WIDTH}}/>
                    </div>                 
                    <div style={{width:width-HOME_LEFT_WIDTH,height:height-HOME_TOP_HEIGHT}}>
                        <Content className="home-content-box">
                            <CRouter/>
                        </Content>
                    </div>
                </Content>
                {changePsw ? <ChangePasswordDialog visible={changePsw} onCancel={this.onCancel} onChangeSuccess={this.onChangeSuccess}/> : null}
                {this.props.homeStore.isTokenOut ? <Redirect push to="/login"/> : null}
            </div>
        );
    }
}

export default withRouter(Home);
