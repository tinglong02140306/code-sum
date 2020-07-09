import React from 'react';
import './Rules.scss';
import { Button, Input, Select } from 'antd';
import { PropTypes } from 'prop-types';
let inputValues = [];
let inputValues2 = [];
let selecValues = [];

class Rules extends React.Component {
	state = {
		rules: [],
		doms: [{display:true,ref1:React.createRef(),ref2:React.createRef(),ref3:React.createRef()}]
	};

	onAddClick = () => {
		const { doms } = this.state;
		doms.push({ display:true,ref1:React.createRef(),ref2:React.createRef(),ref3:React.createRef()});
		this.setState({doms:doms});
    };

	onInputChange = () => {
        const {doms} = this.state;
        const inputArray = doms&&doms.filter(item=>{
            const value = item.ref1.current.input.value;
            item.value = value||null;
            return item.display;
        })
        inputValues = inputArray&&inputArray.map(item=>{
            return item.value;
        })
        const obj = {};
        const objSub = {};
        inputValues&&inputValues.map((item,index)=>{
            obj[item]={
               'coupon_id': selecValues&&selecValues.length>=index?selecValues[index]:null,
                'limit_cnt': inputValues2&&inputValues2.length>=index?inputValues2[index]:null
                }
            return item;
        })
        this.props.onChange(obj);
    };

    onInputChange2 = () => {
        const {doms} = this.state;
        console.log(doms)
        const inputArray = doms&&doms.filter(item=>{
            const value = item.ref3.current.input.value;
            item.value = value||null;
            return item.display;
        })
        inputValues2 = inputArray&&inputArray.map(item=>{
            return item.value;
        })
        const obj = {};
        inputValues2&&inputValues2.map((item,index)=>{
            obj[inputValues&&inputValues.length>=index?inputValues[index]:null]={
                'limit_cnt':item,
                'coupon_id': selecValues&&selecValues.length>=index?selecValues[index]:null,
            };
            return item;
        })
        this.props.onChange(obj);
    };
    
    onSelectChange = () =>{
        const {doms} = this.state;
        setTimeout(()=>{
            const selectArray = doms&&doms.filter(item=>{
                const state = item.ref2.current.rcSelect.state;
                item.value = (state.value&&state.value.length&&state.value[0])||null;
                return item.display;
            });
            selecValues = selectArray&&selectArray.map(item=>{
                return item.value;
            })
            const obj = {};
            selecValues&&selecValues.map((item,index)=>{
                obj[inputValues&&inputValues.length>=index?inputValues[index]:null] = {
                    'coupon_id':item,
                    'limit_cnt': inputValues2&&inputValues2.length>=index?inputValues2[index]:null
                }
                return item
            })
            this.props.onChange(obj);
        },100);
    }


	renderItem = (canDelete,item,index) => {
        const {doms} = this.state;
        const onDelete = () => {
            doms[index].display = false;
            inputValues.splice(index,1);
            selecValues.splice(index,1);
            inputValues2.splice(index,1);
            const obj = {};
            selecValues&&selecValues.map((item,index)=>{
                obj[inputValues&&inputValues.length>=index?inputValues[index]:null]={
                    'coupon_id':item,
                    'limit_cnt': inputValues2&&inputValues2.length>=index?inputValues2[index]:null
                };
                return item
            })
            this.props.onChange(obj);
            this.setState({doms:doms});
        }
        const {data} = this.props;
		return (
			<div className="rules-item" key={index}>
				<span>满</span>
				<Input ref={item.ref1} onChange={this.onInputChange} />
				<span>元，就赠</span>
				<Select className="rules-item-select" placeholder="请选择优惠券"
                    onChange={this.onSelectChange} ref={item.ref2}>
                        {data&&data.map(item=>{
                            return <Select.Option key={item.id} value={item.id}>{item.coupon_name}</Select.Option>
                        })}
				</Select>
                <span style={{marginLeft:15}}>限</span>
                <Input ref={item.ref3} onChange={this.onInputChange2} />
                <span>张</span>
                {canDelete ? <span className="rules-item-delate" onClick={onDelete}>删除</span> : null}
			</div>
		);
    };
    
    render_add = () =>{
        const {doms} = this.state;
        return (
			<div className="rules-container">
				<div className="rules-box">
                    {doms&&doms.map((item,index)=>item.display?this.renderItem(index,item,index):null)}
                </div>
				<Button type="dashed" icon="plus" onClick={() => this.onAddClick()}>
					增加规则
				</Button>
			</div>
		);
    }

    render_show = () =>{
        const {data} = this.props;
        return (
			<div className="rules-container">
				<div className="rules-box">
                    {data&&data.map((item,index)=>{
                        return <div className="rules-item" key={index}>
                        <span>满</span>
                        <Input disabled value={item.amount}/>
                        <span>元，就赠</span>
                        <Select className="rules-item-select" disabled defaultValue={item.coupon_id}>
                            <Select.Option value={item.coupon_id}>{item.coupon_name}</Select.Option>
                        </Select>
                            <span style={{marginLeft:15}}>限</span>
                            <Input disabled value={item.limit_cnt}/>
                            <span>张</span>
                    </div>
                    })}
                </div>
			</div>
		);
    }

	render() {
        const {disabled} = this.props;
        return disabled?this.render_show():this.render_add();
		
	}
}

export default Rules;


Rules.propTypes = {
	onChange: PropTypes.func,
    value: PropTypes.object,
    data:PropTypes.array,
    disabled:PropTypes.bool
};
