import Taro from '@tarojs/taro'
import { View, Image, Text } from '@tarojs/components'
import setTitle from '../../utils/title/set_title'
import {keepOneDecimalFull,keepTwoDecimalFull} from '../../utils/utils'
import {StationPhotoDefault,StationNavigator} from '../../assets/urls'
import navigatorToMap from '../../utils/navigator/navigator'
import './details.less'

const STATION_DETAILS = 'staion-details'

class StaionDetails extends Taro.Component {

    componentDidShow () {
        setTitle("详情");
    }

      //导航
    onNavigationClick = () => {
        if (this.$router.params.params) {
            let item = JSON.parse(decodeURIComponent(this.$router.params.params))
            navigatorToMap(item.latitude_tx,item.longitude_tx,item.name,item.address)
        }
    }

    render(){
        let data = {}
        if (this.$router.params.params) {
            data = JSON.parse(decodeURIComponent(this.$router.params.params))
        }
        const {station_photo_url,address,name,brand_icon_url,distance,station_price} = data
        return <View className={`${STATION_DETAILS}`}>
            <Image className={`${STATION_DETAILS}-top`} src={station_photo_url||StationPhotoDefault}></Image>
            <View className={`${STATION_DETAILS}-center`}>
                <Text className={`${STATION_DETAILS}-center-name`}>{name}</Text>
                <View className={`${STATION_DETAILS}-center-info`}>
                    <Image className={`${STATION_DETAILS}-center-info-icon`} src={brand_icon_url}></Image>
                    <Text className={`${STATION_DETAILS}-center-info-address`}>{address}</Text>
                    <View className={`${STATION_DETAILS}-center-info-separation`}></View>
                    <View className={`${STATION_DETAILS}-center-info-distance`} onClick={this.onNavigationClick}>
                        <Image className={`${STATION_DETAILS}-center-info-distance-icon`} src={StationNavigator}></Image>
                        <Text className={`${STATION_DETAILS}-center-info-distance-num`}>{`${keepOneDecimalFull(distance)}km`}</Text>
                    </View>
                </View>
            </View>
            <View className={`${STATION_DETAILS}-bottom`}>
                <View className='etc-sub-box sub'>
                    <View className='etc-sub-sepatation'></View>
                    <Text className='etc-sub-text'>今日油价信息</Text>
                </View>
                <View className={`${STATION_DETAILS}-bottom-price`}>
                    {station_price&&station_price.map((item,index)=>{
                        return (<View className={`${STATION_DETAILS}-bottom-price-item`} key={index}>
                            <View className={`${STATION_DETAILS}-bottom-price-item-info`}>
                                <Text className={`${STATION_DETAILS}-bottom-price-item-info-oil`}>{item.oil_no}{item.oil_type=="1"?"汽油":"柴油"}</Text>
                                <Text className={`${STATION_DETAILS}-bottom-price-item-info-price`}>{`￥${keepTwoDecimalFull(item.oil_price)}`}</Text>
                            </View>
                            <View className={`${STATION_DETAILS}-bottom-price-item-separation`} style={{display:(index+1)%3?'flex':'none'}}></View>
                        </View>)
                    })}
                </View>
            </View>
        </View>
    }
}

// 指定 props 的默认值：
StaionDetails.defaultProps = {
   
};

StaionDetails.config={
    navigationBarTitleText: '详情',
    navigationBarBackgroundColor: '#233A98',
    backgroundColor:'#fff',
    navigationBarTextStyle:'white',
}

export default StaionDetails