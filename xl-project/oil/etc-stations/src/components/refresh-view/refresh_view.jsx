import Taro, {Component} from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, ScrollView } from '@tarojs/components'
import {getTouchY} from '../../utils/touch/getTouch'
import './refresh_view.less'

const REFRESH_VIEW = 'refresh-view'

const INDICATOR = { activate: '松开刷新', deactivate: '下拉刷新', release: '正在刷新...', finish: '刷新完成' };

const setTransform = (nodeStyle, value) => {
    nodeStyle.transform = value;
    nodeStyle.webkitTransform = value;
    nodeStyle.MozTransform = value;
}

const isWebView = typeof navigator !== 'undefined' &&
  /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);

class RefreshView extends Component{

    containerRef = null
    contentRef = null
    _to = null
    _startScreenY = null
    _lastScreenY = null
    _timer = undefined

    state = {
        pullText:this.props.indicator.deactivate,
        dragOnEdge:false,
        scrollToBottom:false
    }

    componentDidMount(){
        this.containerRef = document.getElementById('containerRef')
        this.contentRef = document.getElementById('contentRef')
    }

    onTouchStart = e => {
        this._ScreenY = this._startScreenY = e.touches[0].screenY;
        this._lastScreenY = this._lastScreenY || 0;
    }

    onTouchMove = e => {
        const _screenY = e.touches[0].screenY;
        // 拖动方向不符合的不处理
        if (this._startScreenY > _screenY) {
            return;
        }
        //当滚动到最顶端时开始处理下拉操作
        if(this.isEdge(this.containerRef)){
            if (!this.state.dragOnEdge) {
                this._ScreenY = this._startScreenY = e.touches[0].screenY;
                this.setState({ dragOnEdge: true });
            }
            e.preventDefault();
             //手指移动距离
            const _diff = Math.round(_screenY - this._ScreenY);
            this._ScreenY = _screenY;
            //下拉距离
            this._lastScreenY += this.damping(_diff);
            //视图移动
            this.setContentStyle(this._lastScreenY);
            //刷新提示更改
            if (Math.abs(this._lastScreenY) < this.props.distanceToRefresh) {
                this.setState({pullText:this.props.indicator.deactivate});
            } else {
                this.setState({pullText:this.props.indicator.activate});
            }
            if (isWebView && e.changedTouches[0].clientY < 0) {
                this.onTouchEnd();
            }
        }
    }

    onTouchEnd = () => {
        if (this.state.dragOnEdge) {
            this.setState({ dragOnEdge: false });
        }
        if (this.state.pullText === this.props.indicator.activate) {
            this.setState({ pullText:this.props.indicator.release});
            this._timer = setTimeout(() => {
              if (!this.props.refreshing) {
                this.setState({ pullText: this.props.indicator.finish }, () => this.reset());
              }
              this._timer = undefined;
            }, 1000);
            this.props.onRefresh();
        } else {
            this.reset();
        }
        return true
    }

    //滚动到底部
    onScrollToLower = () => {
        this.setState({scrollToBottom:true})
        this.props.onLoadMore()
    }

    //判断是否在最顶端
    isEdge = ele => {
        return ele.scrollTop <= 0;
    }

    //手指下拉加阻尼
    damping = dy => {
        if (Math.abs(this._lastScreenY) > this.props.damping) {
          return 0;
        }
        const ratio = Math.abs(this._ScreenY - this._startScreenY) / window.screen.height;
        dy *= (1 - ratio) * 0.6;
        return dy;
    }

    setContentStyle = (ty) => {
        if (this.contentRef) {
          setTransform(this.contentRef.style, `translate3d(0px,${ty}px,0)`);
        }
    }

    //重置
    reset = () => {
        this._lastScreenY = 0;
        this.setContentStyle(0);
    }

    render(){

        const {pullText, scrollToBottom} = this.state
        const {children, distanceToLoadMore,isLoadFinish} = this.props

        return <ScrollView className={`${REFRESH_VIEW}`} 
          scrollY
          id='containerRef'
          onTouchStart={this.onTouchStart}
          onTouchMove={this.onTouchMove}
          onTouchEnd={this.onTouchEnd}
          onScroll={this.onScroll}
          onScrollToLower={this.onScrollToLower}
          lowerThreshold={distanceToLoadMore}>
          <View className={`${REFRESH_VIEW}-content`} id='contentRef'>
              <View className={`${REFRESH_VIEW}-content-indicator`}>
                  {pullText}
              </View>
              <View className={`${REFRESH_VIEW}-content-children`}>
                  {children||null}
              </View>
              <View className={`${REFRESH_VIEW}-content-loading`} style={{display:scrollToBottom?'block':'none'}}>
                  {isLoadFinish?'已加载全部':'努力加载中...'}
              </View>
          </View>
      </ScrollView> 
    }
}

RefreshView.defaultProps={
    refreshing:false,//正在刷新
    distanceToRefresh:50,//触发下拉刷新的距离
    onRefresh:()=>{},//下拉刷新的回调
    distanceToLoadMore:50,//距离页面底部多少距离时触发上拉加载
    onLoadMore:()=>{},//上拉加载的回调
    isLoadFinish:false,//已加载全部
    damping:100,//牵引阻尼，建议小于200
    indicator:INDICATOR//刷新 提示内容
}

RefreshView.propTypes={
   
}

export default RefreshView