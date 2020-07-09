// alphas
var curCarNo = [],
    curActiveIndex = 0,
    curCarColVal = 0;
var keyBoard = {
        province: ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '苏', '琼', '新', '藏'],
        numAlpha: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '警'],
        // type 1: province 2: numAlphas
        createKeyBoardDom: function($dom, type) {
            // if(type == )
            var data = type && type == 1 ? this.province : this.numAlpha;
            var $html = `<div class="keyboard-wrap">
                        <div class="area-keyboard">
                            <div class="content">`;
            for (var i = 0; i < data.length; i++) {
                $html += `<span data-val="${data[i]}">${data[i]}</span>`;
            }
            $html += `</div>
                    <div class="btn-wrap">
                        <span class="btn-del"></span>
                        <span class="btn-sure">确定</span>
                    </div>
                </div>`;
            $dom.empty().append($html);
        }
    },
    addEvent = function() {
        var $this = $('.wrap');
        // 添加车牌号输入事件
        $this.off('.input-carno-wrap span').on('click', '.input-carno-wrap span', handleEvent.selCarNoEvt);

        // 车牌颜色选择点击事件
        $this.off('.select-car-color-wrap span').on('click', '.select-car-color-wrap span', handleEvent.selCarColEvt);

        // 添加键盘删除按钮点击事件 清除内容
        $this.off('.btn-del').on('click', '.btn-del', handleEvent.btnDelEvt);

        // 添加键盘确定按钮点击事件  隐藏弹框
        $this.off('.btn-sure').on('click', '.btn-sure', handleEvent.btnSureEvt);

        // 添加键盘文本选择事件
        $this.off('.area-keyboard .content span').on('click', '.area-keyboard .content span', handleEvent.selectKeyBoardItemEvt);

        // ETC车牌号提交点击事件 btn-submit
        $this.off('.btn-submit').on('click', '.btn-submit', handleEvent.submitEvt);
    },
    handleEvent = {
        // 车牌号输入事件
        selCarNoEvt: function() {
            var $this = $(this),
                index = $this.index();
            $this.addClass('active').siblings().removeClass('active');
            keyBoard.createKeyBoardDom($('.keyboard-wrapper'), index == 0 ? 1 : 2);
            curActiveIndex = index;
        },
        // 车牌颜色选择
        selCarColEvt: function(e) {
            var $this = $(this),
                index = $this.index(),
                val = $(e.currentTarget).data('val')
            $this.addClass('selected').siblings().removeClass('selected');
            // keyBoard.createKeyBoardDom($('.keyboard-wrapper'), index == 0 ? 1 : 2);
            curCarColVal = val;
        },
        // 键盘删除按钮点击事件
        btnDelEvt: function(e) {
            $('.input-carno-wrap span').eq(curActiveIndex).text('');
            if (curActiveIndex == 7) $('.input-carno-wrap span').eq(curActiveIndex).addClass('xny-bg')
        },
        // 键盘确定按钮点击事件
        btnSureEvt: function() {
            $('.keyboard-wrapper').empty();
            // if (curActiveIndex == 7) $('.input-carno-wrap span').addClass('xny-bg')
        },
        // 键盘key值点击事件
        selectKeyBoardItemEvt: function(e) {
            var val = $(e.currentTarget).data('val');
            $('.input-carno-wrap span').eq(curActiveIndex).text(val);
            curCarNo[curActiveIndex] = val;
            if (curActiveIndex == 7) $('.input-carno-wrap span').eq(curActiveIndex).removeClass('xny-bg')
        },
        // ETC 车牌号提交
        submitEvt: function() {
            requestEvent.submitEtcInfo()
        }
    },
    requestEvent = {
        // 信息提交
        submitEtcInfo: function() {
            var param = '',
                token = '';
            util.ajaxRequest('/isp/alipay/service/bills', param, token, function(res) {
                var data = res.data;
                if (res.code == '0000') {

                } else {
                    // util.toastDialog(res.message);
                }
                // util.hideMask();
            }, function(res) {
                // util.toastDialog(res.message)
            })
        }
    }
$(function() {
    addEvent();

    // 输入框第一次进来有默认选择？ 车辆颜色有默认选择吗？
});