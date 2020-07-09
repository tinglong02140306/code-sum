import Taro from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Text, Image } from '@tarojs/components'
import {StationNavigation} from '../../../assets/urls'
import {keepOneDecimalFull} from '../../../utils/utils'
import './navigation.less'

const NAVIGATION = 'navigator'

const Navigation = ({item, onNavigationClick}) => {

    const onNavigation = (e) => {
        e.stopPropagation()
        onNavigationClick(item)
    }
    
    return  <View className={`${NAVIGATION}`} onClick={onNavigation}>
        <Image className={`${NAVIGATION}-icon`} src={StationNavigation}></Image>
        <Text className={`${NAVIGATION}-distance`}>{`${keepOneDecimalFull(item.distance)}km`}</Text>
    </View>
}

Navigation.defaultProps={
    onNavigationClick:()=>{},
    item:{}
}
  
Navigation.propTypes={
    onNavigationClick:PropTypes.func,
    item:PropTypes.object
}

export default Navigation