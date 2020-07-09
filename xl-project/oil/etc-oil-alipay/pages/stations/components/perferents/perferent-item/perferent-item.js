// pages/station/components/perferent/perferent.js
import {
    PerferPull,
    FastOrderUnCheck,
    FastOrderCheck
} from '../../../../../assets/url/url'

Component({
    props: {
        item: null,
        index: 0
    },

    data: {
        showRules: false, //是否展示使用规则 
        animation: null,
        rules: null,
        pull_icon: PerferPull,
        check_icon: FastOrderCheck,
        uncheck_icon: FastOrderUnCheck
    },
    methods: {
        //选择优惠券
        onCheckClick() {
            this.props.onCheckClick(this.props.index);
        },
        //使用规则点击
        onSeeRuleClick() {
            this.props.onRuleClick(this.props.index);
        }
    }
})