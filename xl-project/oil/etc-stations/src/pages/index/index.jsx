import Taro, {Component} from '@tarojs/taro'
import { View, Image, Text} from '@tarojs/components'
import { connect } from '@tarojs/redux'
import setTitle from '../../utils/title/set_title'
import StationItem from '../components/item/item'
import PopDown from '../../components/pop-down/pop_down'
import RefreshView from '../../components/refresh-view/refresh_view'
import {getStationAction, getLocationAction} from '../../reducers/modules/stations'
import {StationEmpty} from '../../assets/urls'
import navigatorToMap from '../../utils/navigator/navigator'
import {tabs} from '../constants'
import './index.less'

const STATION_LIST = 'station-list'

let pageNum = 1
const PAGESIZE = 15
let oilType = tabs[0].defaultKey
let sortClass = tabs[1].defaultKey

@connect(state => (state.stationsReducer), 
dispatch =>({
  onGetLocation:(page_num,page_size,oil_type_name,sort_class)=>{
    dispatch(getLocationAction(page_num,page_size,oil_type_name,sort_class))
  },
  onGetStations:(page_num,page_size,center_lng,center_lat,oil_type_name,sort_class) => {
    dispatch(getStationAction(page_num,page_size,center_lng,center_lat,oil_type_name,sort_class))
  }
}))
class Index extends Component {

  componentDidMount(){
    const {center_lng, center_lat} = this.props
    if(center_lng&&center_lat){
      pageNum = 1
      this.props.onGetStations(pageNum,PAGESIZE,center_lng,center_lat,oilType,sortClass)
    }else{
      this.props.onGetLocation(pageNum,PAGESIZE,oilType,sortClass)
    }
  }

  componentDidShow(){
    setTitle('油站列表')
  }

  //item 点击
  onStationItemClick = item => {
      const data = encodeURIComponent(JSON.stringify(item))
      Taro.navigateTo({
        url:`/pages/details/details?params=${data}`
      })
  }

  //导航
  onNavigationClick = item => {
      navigatorToMap(item.latitude_tx,item.longitude_tx,item.name,item.address)
  }

  //筛选条件
  onPopdownClick= (item) => {
    const type = item[0]
    const sort = item[1]
    if (oilType!=type||sortClass!=sort) {
      pageNum = 1
      oilType = type
      sortClass = sort
      const {center_lng, center_lat} = this.props
      this.props.onGetStations(pageNum,PAGESIZE,center_lng,center_lat,oilType,sortClass)
    }
  }

  //下拉刷新
  onRefreshing = () => {
    const {center_lng, center_lat} = this.props
    pageNum = 1
    if(center_lng&&center_lat){
      this.props.onGetStations(pageNum,PAGESIZE,center_lng,center_lat,oilType,sortClass)
    }else{
      this.props.onGetLocation(pageNum,PAGESIZE,oilType,sortClass)
    }
  }

  //上拉加载更多
  onLoadMore = () => {
    const {center_lng, center_lat} = this.props
    pageNum++
    this.props.onGetStations(pageNum,PAGESIZE,center_lng,center_lat,oilType,sortClass)
  }

  render(){
    const {stations, errMsg, loadingText, isLoadFinish} = this.props
    {loadingText?Taro.showLoading({title: loadingText,mask:true}):Taro.hideLoading()}
    {errMsg?Taro.showToast({title: errMsg,icon: 'none'}):null}
    return <View className={`${STATION_LIST}`}>
        <View className={`${STATION_LIST}-popdown`}>
          <PopDown onPopdownClick={this.onPopdownClick} tabs={tabs}></PopDown> 
        </View>
        <RefreshView 
          onRefresh={this.onRefreshing}
          onLoadMore={this.onLoadMore}
          isLoadFinish={isLoadFinish}>
              <View className={`${STATION_LIST}-list`}>
                  {stations&&stations.map((item,index)=>(<StationItem key={index} item={item} onStationItemClick={this.onStationItemClick} onNavigationClick={this.onNavigationClick}></StationItem>))}
              </View>
              <View className={`${STATION_LIST}-empry`} style={{display:(loadingText||(stations&&stations.length))?'none':'flex'}}>
                  <Image class={`${STATION_LIST}-empry-image`} src={StationEmpty}></Image>
                  <Text class={`${STATION_LIST}-empry-text`}>您的附近没有搜索到加油站</Text>
              </View>
        </RefreshView>
    </View>
  }
}

Index.config={
  navigationBarTitleText: '加油站列表',
  navigationBarBackgroundColor: '#233A98',
  navigationBarTextStyle:'white',
}

export default Index
