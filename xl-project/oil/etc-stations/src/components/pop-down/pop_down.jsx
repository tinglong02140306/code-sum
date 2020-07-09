import Taro, {useState} from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View, Text, Image} from '@tarojs/components'
import {PopDownRight, PopDownUp, PopDownDown} from '../../assets/urls'
import {WINDOW_HEIGHT} from '../../constants/storage'
import {getGlobalData} from '../../constants/global'
import './pop_down.less'

const POP_DOWN = 'pop-down'
const height = getGlobalData(WINDOW_HEIGHT)
const tabHeight = 50
const maskHeight = height

const PopDown = ({tabs,onPopdownClick}) => {
    const [source,setSource] = useState(tabs)
    const [currentData,setCurrentData] = useState([])
    const [currentKey,setCurrentKey] = useState(null)
    const [select,setSelect] = useState(null)
    const [isShow,setIsShow] = useState(false)

    const onTabItemClick = (e,index) => {
        e.stopPropagation()
        setIsShow(true)
        setSelect(index)
        setCurrentData(tabs[index].data)
        setCurrentKey(tabs[index].defaultKey)
    }

    const onItemClick = (e,item) => {
        e.stopPropagation()
        source[select].defaultTitle=item.title
        source[select].defaultKey=item.key
        setSource(source)
        setCurrentKey(item.key)
        setIsShow(false)

        const values = source&&source.map(value=>{
            return value.defaultKey
        })
        onPopdownClick(values)
    }

    const onMaskClick = () => {
        setIsShow(false)
    }

    return <View className={`${POP_DOWN}`}>
        <View className={`${POP_DOWN}-box`} style={{height:`${tabHeight}px`}}></View>
        <View className={`${POP_DOWN}-container`}>
            <View className={`${POP_DOWN}-container-mask`} style={{display:isShow?'flex':'none',height:`${maskHeight}px`}} onClick={onMaskClick}></View>
            <View className={`${POP_DOWN}-container-info`} >
                <View className={`${POP_DOWN}-container-info-box`} style={{height:`${tabHeight}px`}}>
                    {source&&source.map((item,index)=>{
                        return <View className={`${POP_DOWN}-container-info-box-item`} key={item.defaultKey} onClick={e=>{onTabItemClick(e,index)}}>
                            <Text className={`${POP_DOWN}-container-info-box-item-text`} style={{color:(isShow&&index===select)?'#556cd6':'#333333'}}>{item.defaultTitle}</Text>
                            <Image className={`${POP_DOWN}-container-info-box-item-image`} src={(isShow&&index===select)?PopDownUp:PopDownDown}></Image>
                        </View>
                    })}
                </View>
                <View className={`${POP_DOWN}-container-info-content`} style={{display:isShow?'flex':'none'}}>
                    {currentData&&currentData.map(item=>{
                        return <View className={`${POP_DOWN}-container-info-content-item`} key={item.key} onClick={e=>{onItemClick(e,item)}}>
                            <Text className={`${POP_DOWN}-container-info-content-item-text`} style={{color:currentKey===item.key?'#556cd6':'#333333'}}>{item.title}</Text>
                            <Image className={`${POP_DOWN}-container-info-content-item-image`} src={PopDownRight} style={{display:currentKey===item.key?'flex':'none'}}></Image>
                        </View>
                    })}
                </View>
            </View>
        </View>
    </View>
}

PopDown.defaultProps={
    tabs:[{
        defaultTitle:'92#汽油',
        defaultKey:'92#',
        data:[
            {
                title:'92#汽油',
                key:'92#', 
            },{
                title:'98#汽油',
                key:'98#', 
            }
        ]
    },{
        defaultTitle:'距离最近',
        defaultKey:1,
        data:[
            {
                title:'距离最近',
                key:1, 
            },{
                title:'油价最低',
                key:0, 
            }
        ]
    }],
    onPopdownClick:()=>{}
}

PopDown.propTypes={
    tabs:PropTypes.array,
    onPopdownClick:PropTypes.func
}

export default PopDown;