import {createAction} from '../middlewares/http'
import {getLocation} from '../../utils/location/get_location'
import {STATION_LIST} from '../base/url'

const INITIAL_STATE = {
  isLoading:false,
  stations:[],
  center_lng:'',
  center_lat:'',
  errMsg:'',
  loadingText:'',
  isLoadFinish:false
}


export const actionTypes = {
  STATION_REQUEST:'STATION_REQUEST',
  STATION_SUCCESS:'STATION_SUCCESS',
  STATION_FAILURE:'STATION_FAILURE',
  STATION_FINISH:'STATION_FINISH',//油站已加载全部
  LOCATION_REQUEST:'LOCATION_REQUEST',
  LOCATION_SUCCESS:'LOCATION_SUCCESS',
  LOCATION_FAILURE:'LOCATION_FAILURE'
}

//获取用户所在位置的经纬度
export const getLocationAction = (page_num,page_size,oil_type_name,sort_class) => {
    return dispatch => {
      dispatch({type:actionTypes.LOCATION_REQUEST})
      getLocation(res=>{
        dispatch({type:actionTypes.LOCATION_SUCCESS,data:res})
        dispatch(getStationAction(page_num,page_size,res.lng,res.lat,oil_type_name,sort_class))
      },error=>{
        dispatch({type:actionTypes.LOCATION_FAILURE,err:error})
      })
    }
}

//获取油站列表
export const getStationAction = (page_num,page_size,center_lng,center_lat,oil_type_name,sort_class) => {
    const params = {
      page_num:page_num,
      page_size:page_size,
      center_lng:center_lng,
      center_lat:center_lat,
      oil_type_name:oil_type_name,
      sort_class:sort_class
    }
    return dispatch => {
      dispatch({type:actionTypes.STATION_REQUEST,isRefresh:page_num===1})
      return dispatch(createAction({
        url:STATION_LIST,
        params:params,
        success:res=>{
          dispatch({type:actionTypes.STATION_SUCCESS,data:res.data||[],isRefresh:page_num===1})
          if (res.data&&res.data.length<page_size) {
            dispatch({type:actionTypes.STATION_FINISH,data:true})
          }
        },
        fail:res=>{
          dispatch({type:actionTypes.STATION_FAILURE,data:res})
        }
      }))
    }
}

export default function stationReducer (state = INITIAL_STATE, action) {
  switch(action.type){
    case actionTypes.STATION_REQUEST:
        if(action.isRefresh){
          return Object.assign({},state,{loadingText:'正在获取油站...'})
        }else{
          return state
        }
    case actionTypes.STATION_SUCCESS:
        if(action.isRefresh){
          return Object.assign({},state,{loadingText:'',stations:action.data})
        }else{
          return Object.assign({},state,{loadingText:'',stations:[...state.stations,...action.data]})
        }
    case actionTypes.STATION_FAILURE:
        return Object.assign({},state,{loadingText:'',errMsg:action.data})
    case actionTypes.STATION_FINISH:
        return Object.assign({},state,{loadingText:'',isLoadFinish:true})
    case actionTypes.LOCATION_REQUEST:
        return Object.assign({},state,{loadingText:'获取位置信息...'})
    case actionTypes.LOCATION_SUCCESS:
        return Object.assign({},state,{loadingText:'',center_lng:action.data.lng,center_lat:action.data.lat})
    case actionTypes.LOCATION_FAILURE:
        return Object.assign({},state,{loadingText:'',errMsg:'获取位置信息失败'})
    default :
        return state;
  }
}