import Taro from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Text, Image } from '@tarojs/components'
import {StationBrandDefault} from '../../../assets/urls'
import Navigation from '../navigation/navigation'
import {keepTwoDecimalFull} from '../../../utils/utils'
import './item.less'

const STATION_ITEM = 'station-item'

const StationItem = ({item, onStationItemClick, onNavigationClick}) => {

    const {brand_icon_url=StationBrandDefault, address='', name='', current_station_price={oil_price:'',oil_price_difference:0}, distance=''} = item

    //item 点击
    const onClick = (data,e) => {
        e.stopPropagation()
        onStationItemClick(data)
    }

    const onNavigation = (data) => {
        onNavigationClick(data)
    }

    return <View className={`${STATION_ITEM}`} onClick={e=>{onClick(item,e)}}>
        <Image className={`${STATION_ITEM}-left`} src={brand_icon_url}></Image>
        <View className={`${STATION_ITEM}-center`}>
            <Text className={`${STATION_ITEM}-center-name`}>{name}</Text>
            <Text className={`${STATION_ITEM}-center-address`}>{address}</Text>
            <View className={`${STATION_ITEM}-center-sub`}>
                <View className={`${STATION_ITEM}-center-sub-price`}>
                    <Text className={`${STATION_ITEM}-center-sub-price-hint`}>￥</Text>
                    <Text className={`${STATION_ITEM}-center-sub-price-num`}>{keepTwoDecimalFull(current_station_price.oil_price)}</Text>
                    <Text className={`${STATION_ITEM}-center-sub-price-hint`}>/升</Text>
                </View>
                <View className={`${STATION_ITEM}-center-sub-cut`} style={{display:Number(item.current_station_price.oil_price_difference)?'flex':'none'}}>{`降￥${keepTwoDecimalFull(current_station_price.oil_price_difference)}`}</View>
                {/* <View className={`${STATION_ITEM}-center-sub-prefer`}></View> */}
            </View>
        </View>
       <Navigation item={item} onNavigationClick={onNavigation}></Navigation>
    </View>
}

StationItem.defaultProps={
    onStationItemClick:()=>{},
    onNavigationClick:()=>{},
    item:{
        brand_icon_url:StationBrandDefault,
        address:'',
        name:'',
        current_station_price:{},
        distance:''
    }
}
  
StationItem.propTypes={
    onNavigationClick:PropTypes.func,
    onStationItemClick:PropTypes.func,
    item:PropTypes.object
}



export default StationItem