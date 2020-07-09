import React from 'react';
import './Points.scss';
import { Button, Table, Modal, Transfer, Checkbox, Spin, message } from 'antd';
import { inject, observer } from 'mobx-react/index';
import province from '../../constants/province';
import { PropTypes } from 'prop-types';
@inject('ticketPointStore')
@observer
class Points extends React.Component {
	state = {
		show_modal: false,
		indeterminate_brands: false,
		check_all_brands: false,
		checked_brands: [],
		indeterminate_province: false,
		check_all_province: false,
		checked_province: [],
		targetKeys: [],
		selectedKeys: [],
		targetArray: [],
		pagination: {
			total: 0,
			pageSize: 5,
			showQuickJumper: true
		}
	};

	componentDidMount() {
		this.props.ticketPointStore.getBrandsStation();
		this.props.ticketPointStore.getBrandsWasher();
	}

	// handleTableChange = (pagination) => {
	// 	// pager.current = pagination.current;
	// };

	handleChange = (nextTargetKeys, direction, moveKeys) => {
		this.setState({ targetKeys: nextTargetKeys });
	};

	handleSelectChange = (sourceSelectedKeys, targetSelectedKeys) => {
		this.setState({ selectedKeys: [ ...sourceSelectedKeys, ...targetSelectedKeys ] });
	};

	onBrandsChange = (checkedList) => {
		const { type } = this.props; //1:油站 2:洗车
		const { checked_province } = this.state;
		const { brands_station, brands_washer } = this.props.ticketPointStore;
		const brands = type === 1 ? brands_station : brands_washer;
		this.setState({
			checked_brands: checkedList,
			indeterminate_brands: !checkedList.length && checkedList.length < brands.length,
			check_all_brands: checkedList.length === brands.length
		});
		type === 1 ? this.fetch_station(checkedList, checked_province) : this.fetch_washer(checkedList);
	};

	onCheckBrandsChange = (e) => {
		const { type } = this.props; //1:油站 2:洗车
		const { checked_province } = this.state;
		const { brands_station, brands_washer } = this.props.ticketPointStore;
		const brands = type === 1 ? brands_station : brands_washer;
		const value = brands && brands.map((item) => item.key);
		this.setState({
			checked_brands: e.target.checked ? value : [],
			indeterminate_brands: false,
			check_all_brands: e.target.checked
		});
		type === 1 ? this.fetch_station(value, checked_province) : this.fetch_washer(value);
	};

	onProvinceChange = (checkedList) => {
		const { type } = this.props; //1:油站 2:洗车
		const { checked_brands } = this.state;
		this.setState({
			checked_province: checkedList,
			indeterminate_province: !!checkedList.length && checkedList.length < province.length,
			check_all_province: checkedList.length === province.length
		});
		type === 1 ? this.fetch_station(checked_brands, checkedList) : this.fetch_washer(checked_brands);
	};

	onCheckProvinceChange = (e) => {
		const { type } = this.props; //1:油站 2:洗车
		const { checked_brands } = this.state;
		const value = province && province.map((item) => item.value);
		this.setState({
			checked_province: e.target.checked ? value : [],
			indeterminate_province: false,
			check_all_province: e.target.checked
		});
		type === 1 ? this.fetch_station(checked_brands, value) : this.fetch_washer(checked_brands);
	};

	handleSearch = () => {
		this.setState({
			targetKeys: [],
			selectedKeys: [],
		})
	};

	//获取加油站
	fetch_station = (checked_brands, checked_province) => {
		if (checked_brands.length && checked_province.length) {
			const params = {
				page_num: 1,
				page_size: 0,
				brand_id_array: checked_brands,
				province_code_array: checked_province
			};
			this.props.ticketPointStore.getStations(params);
		}
	};

	//获取洗车机
	fetch_washer = (checked_brands) => {
		if (checked_brands&&checked_brands.length) {
			const params = {
				page_num: 1,
				page_size: 0,
				brand_id_array: checked_brands
			};
			this.props.ticketPointStore.getWashers(params);
		}
	};

	hideModal = () => {
		this.setState({
			show_modal: false,
			indeterminate_brands: false,
			check_all_brands: false,
			checked_brands: [],
			indeterminate_province: false,
			check_all_province: false,
			checked_province: [],
			targetKeys: [],
			selectedKeys: [],
			targetArray: [],
			pagination: {
				total: 0,
				pageSize: 5,
				showQuickJumper: true
			}
		});
		this.props.ticketPointStore.stations = [];
		this.props.ticketPointStore.washers = [];
	};

	onAdd = () => {
		const { type } = this.props; //1:油站 2:洗车
		const { targetKeys } = this.state;
		const { stations, washers } = this.props.ticketPointStore;
		const points = type === 1 ? stations : washers;
		
		if (targetKeys.length) {
			const data =
				targetKeys &&
				targetKeys.map((item) => {
					for (let i = 0; i < points.length; i++) {
						const obj = points[i];
						if (obj.key === item) {
							return obj;
						}
					}
				});
			this.setState({
				targetArray: data,
				pagination: {
					total: data.length,
					pageSize: 5,
					showQuickJumper: true
				}
			});
			console.log(data)
            this.props.onChange(data);
			this.hideModal();
		} else {
			message.error('请添加网点');
		}
	};

	//网点选择
	modal = () => {
		const {
			show_modal,
			indeterminate_brands,
			check_all_brands,
			checked_brands,
			checked_province,
			indeterminate_province,
			check_all_province,
			targetKeys,
			selectedKeys
		} = this.state;
		const { type } = this.props; //1:油站 2:洗车
		const { brands_station, brands_washer, loadingPoints, stations, washers } = this.props.ticketPointStore;
		const brands = type === 1 ? brands_station : brands_washer;
		const points = type === 1 ? stations : washers;
		const brands_length = brands && brands.length;
		const brands_check_length = checked_brands && checked_brands.length;
		const province_length = province && province.length;
		const province_check_length = checked_province && checked_province.length;
		return (
			<Modal
				visible={show_modal}
				title="添加网点"
				footer={null}
				width={type === 1 ? 900 : 700}
				onCancel={() => this.hideModal()}
			>
				<div className="ticket-points-modal-box">
					<div className="ticket-points-modal-trees">
						<div className="ticket-points-modal-trees-item">
							<div className="ticket-points-modal-trees-item-header">
								<div className="ticket-points-modal-trees-item-header-left">
									<Checkbox
										indeterminate={indeterminate_brands}
										checked={check_all_brands}
										onChange={this.onCheckBrandsChange}
									/>
									<span>
										{brands_check_length}/{brands_length} 条
									</span>
								</div>
								<span id="title">品牌</span>
							</div>
							<Checkbox.Group
								className="ticket-points-modal-checkbox-group"
								options={brands}
								value={checked_brands}
								onChange={this.onBrandsChange}
							/>
						</div>
						<div
							className="ticket-points-modal-trees-item"
							style={{ display: type === 1 ? 'inline-block' : 'none' }}
						>
							<div className="ticket-points-modal-trees-item-header">
								<div className="ticket-points-modal-trees-item-header-left">
									<Checkbox
										indeterminate={indeterminate_province}
										checked={check_all_province}
										onChange={this.onCheckProvinceChange}
									/>
									<span>
										{province_check_length}/{province_length} 条
									</span>
								</div>
								<span id="title">省份</span>
							</div>
							<Checkbox.Group
								className="ticket-points-modal-checkbox-group"
								options={province}
								value={checked_province}
								onChange={this.onProvinceChange}
							/>
						</div>
						<Spin spinning={loadingPoints}>
							<Transfer
								className="ticket-points-modal-transfer"
								titles={[ type === 1 ? '加油站' : '洗车机', '已选中' ]}
								showSearch
								onSearch={this.handleSearch}
								targetKeys={targetKeys}
								selectedKeys={selectedKeys}
								onChange={this.handleChange}
								onSelectChange={this.handleSelectChange}
								render={(item) => item.title}
								dataSource={points}
							/>
						</Spin>
					</div>
					<div className="ticket-points-modal-btns">
						<Button onClick={() => this.hideModal()}>取消</Button>
						<Button type="primary" onClick={() => this.onAdd()}>
							添加
						</Button>
					</div>
				</div>
			</Modal>
		);
	};

	render() {
		const { show_modal, pagination } = this.state;
		const {value} = this.props;
		return (
			<div className="ticket-points-container">
				<Button
					className="ticket-points-btn"
					icon="plus-circle"
					onClick={() => this.setState({ show_modal: true })}
				>
					{value&&value.length ? '修改网点' : '添加网点'}
				</Button>
				<div className="ticket-points-table-box" style={{ display: value&&value.length ? 'flex' : 'none' }}>
					<Table
						className="ticket-points-table"
						bordered
						size="small"
						columns={this.columns}
						onChange={this.handleTableChange}
						dataSource={value}
						pagination={pagination}
					/>
				</div>
				{show_modal ? this.modal() : null}
			</div>
		);
	}

	columns = [
		{
			title: '油站ID',
			dataIndex: 'key',
			key: 'key',
			align: 'center'
		},
		{
			title: '网点名称',
			dataIndex: 'title',
			key: 'title',
			align: 'center'
		}
	];
}

export default Points;

Points.propTypes = {
	type: PropTypes.number, //类型  1:油站 2:洗车
	onChange: PropTypes.func,
	value: PropTypes.array
};
