import { PreferenceMoney, PerferPull, PerferUsed, PerferLose, PerferQrcode, PreferenceCar } from '../../../../../assets/url/url'
Component({
    options: {
        multipleSlots: true
    },
    props: {
        type: 0,
        item: {}
    },
    data: {
        money_icon: PreferenceMoney,
        car_icon: PreferenceCar,
        pull_icon: PerferPull,
        finish_icon: PerferUsed,
        prefer_qrcode: PerferQrcode,
        showRules: false, //是否展示使用规则 
        titleColor: 'color:#333333',
        contentColor: 'color:#666666',
        moneyStyle: 'text-shadow:6px 6px 12px #1d85ff',
        borderRadius: 'border-bottom-left-radius: 8rpx;',
        background: 'background:linear-gradient(to bottom right, #73D4FE, #1378ff);',
        backgroundG: `background:linear-gradient(to bottom right, ${'#44B291'}, ${'#164D3F'});`,
        backgroundB: `background:linear-gradient(to bottom right, ${'#73D4FE'}, ${'#1378ff'});`,
        backgroundY: `background:linear-gradient(to bottom right, ${'#fad88a'}, ${'#f19156'});`,
        animation: null,
        rules: null
    },
    didMount() {
        this.dealTypeStyle();
    },
    methods: {
        //设置默认使用优惠券
        onSetDefaultClick() {
            const { item } = this.props;
            this.props.onSetDefault(item);
        },

        //选择去使用跳转
        onSetSelectClick() {
            const { item } = this.props;
            this.props.onSetSelect(item);
        },

        //查看优惠券
        onSeeCouponClick() {
            const { item } = this.props;
            this.props.onSeeCoupon(item.put_id);
        },

        //使用规则点击
        onSeeRuleClick() {
            const { item } = this.props;
            const { showRules } = this.data;
            this.setData({
                showRules: !showRules,
                borderRadius: `border-bottom-left-radius: ${showRules?8:0}rpx;`
            })
        },
        dealTypeStyle() {
            const radius = 8;
            const type = this.props.type;
            const color = type == 0 ? '#074DB4' : type == 1 ? '#B34E23' : '#c6c6c6'
            const topLeft = type == 0 ? '#5BC7FF' : type == 1 ? '#FFC854' : '#c6c6c6';
            const bottomRight = type == 0 ? '#074DB4' : type == 1 ? '#B34E23' : '#c6c6c6';
            const titleColor = type == 4 ? '#999999' : '#333333';
            const contentColor = type == 4 ? '#999999' : '#333333';
            this.setData({
                money_icon: PreferenceMoney,
                titleColor: `color:${titleColor}`,
                contentColor: `color:${contentColor}`,
                moneyStyle: `text-shadow:6px 6px 12px ${color};`,
                borderRadius: `border-bottom-left-radius: ${radius}rpx;`,
                background: `background:linear-gradient(to bottom right, ${topLeft}, ${bottomRight});`,
                backgroundG: `background:linear-gradient(to bottom right, ${'#44B291'}, ${'#164D3F'});`,
                backgroundB: `background:linear-gradient(to bottom right, ${'#5BC7FF'}, ${'#074DB4'});`,
                backgroundY: `background:linear-gradient(to bottom right, ${'#FFC854'}, ${'#B34E23'});`,
                backgroundGray: `background:linear-gradient(to bottom right, ${'#999999'}, ${'#333333'});`,
                finish_icon: type == 2 ? PerferUsed : PerferLose,
            });
        }
    }
})