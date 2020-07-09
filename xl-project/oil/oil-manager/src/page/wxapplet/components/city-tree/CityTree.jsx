import React from 'react';
import {Input, Tree} from 'antd';
import "./CityTree.scss"
import {city} from '../../../../constants/city_key'
const { TreeNode } = Tree;
const { Search } = Input;
let cityArr = [];
class CityTree extends React.Component {
    
    state = {
        autoExpandParent: true,
        checkedKeys:this.props.value||[]
    };

    //城市选择
    renderTreeNodes = data =>
    data.map(item => {
        if (item.children) {
            return (
            <TreeNode title={item.title} key={item.key} dataRef={item}>
                {this.renderTreeNodes(item.children)}
            </TreeNode>
            );
        }
        return <TreeNode key={item.key} {...item} />;
    });

    //搜索
    onChange = e => {
        const { value } = e.target;
        const keys = this.dealSearchValue(value);
        this.setState({checkedKeys:keys});
        this.dealCheckKeys(keys);
    };

    //处理搜索的key
    dealSearchValue = title => {
        let keyArray = [];
        for(let i=0; i<city.length; i++){
            const item = city[i];
            if (item.title.indexOf(title) >= 0) {
                keyArray.push(item.key);
            }
            const children = item.children;
            if(children&&children.length){
                for(let k=0; k<children.length; k++){
                    const _item = children[k];
                    if (_item.title.indexOf(title) >= 0) {
                        keyArray.push(_item.key);
                    } 
                }
            }
        }
        return keyArray;
    }

    //选择
    onCheckPages = (expandedKeys,e) => {
        this.setState({checkedKeys:expandedKeys});
        this.dealCheckKeys(expandedKeys)
    };

    //处理选中内容
    dealCheckKeys = (_keys) => {
        if(!_keys) return
        let keys = this.deepClone(_keys);
        let indexArray = [];
        let newIndex = [];
        if(_keys.indexOf("000000")>=0){
            newIndex.push("000000")
        }else{
            for(let i=0; i<keys.length; i++){
                const key = keys[i];
                if (key.endsWith('0000')) {
                    const subCode = key.substring(0,2);
                    for(let j=0; j<keys.length;j++){
                        const _sub = keys[j];
                        if(_sub!==`${subCode}0000`&&_sub.startsWith(subCode)){
                           indexArray.push(j);
                        }
                    }
                }
            }
            for (let i=0;i<keys.length; i++) {
                if (indexArray.indexOf(i) === -1) {
                    newIndex.push(keys[i])
                }
            }
        }
        this.props.onChange(newIndex)
        console.log(newIndex);
        return newIndex;
    }

    dealData = (search,_city) => {
        for(let i=0; i<_city.length;i++){
            const item = _city[i];
            if(search==item.key){
                cityArr.push(item.title);
            }else{
                const children = item.children;
                if(children&&children.length){
                    this.dealData(search,children);
                }
            }
        }
    }


    deepClone = (arr) => {
        let obj=arr.constructor===Array?[]:{};
    　　for(let item in arr){
            if(typeof arr[item]==="object"){
                obj[item]=this.deepClone(arr[item]);
            }else{
                obj[item]=arr[item];
            }
        }
        return obj;
    }

    render() {
        const {checkedKeys} = this.state;
        return (<div>
            <Search style={{ marginBottom: 8 }} placeholder="查询/搜索" onChange={this.onChange} />
            <Tree checkable className="city-tree"
                onCheck={this.onCheckPages}
                checkedKeys={checkedKeys}
                autoExpandParent={true}>{this.renderTreeNodes(city)}</Tree>
        </div>);
    }
}

export default CityTree;


CityTree.defaultProps = {
    onChange:()=>{},
}