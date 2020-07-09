// alphas
var curCarNo = [null, null, null, null, null, null],
    curActiveIndex = 0,
    curCarColVal = 0,
    curData;
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
                $html += `<span class="c3b" data-val="${data[i]}">${data[i]}</span>`;
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
        var $this = $('.add-carno-wrap');
        // 添加车牌号输入事件
        $this.off('.input-carno-wrap .item').on('click', '.input-carno-wrap .item', handleEvent.selCarNoEvt);

        // 车牌颜色选择点击事件
        $this.off('.select-car-color-wrap .plate').on('click', '.select-car-color-wrap .plate', handleEvent.selCarColEvt);

        // 添加键盘删除按钮点击事件 清除内容
        $this.off('.btn-del').on('click', '.btn-del', handleEvent.btnDelEvt);

        // 添加键盘确定按钮点击事件  隐藏弹框
        $this.off('.btn-sure').on('click', '.btn-sure', handleEvent.btnSureEvt);

        // 添加键盘文本选择事件
        $this.off('.area-keyboard .content span').on('click', '.area-keyboard .content span', handleEvent.selectKeyBoardItemEvt);

        // ETC车牌号提交点击事件 btn-submit
        $this.off('.btn-submit').on('click', '.btn-submit', handleEvent.submitEvt);

        // 取消添加车牌号点击事件
        $this.off('.btn-cancel').on('click', '.btn-cancel', handleEvent.cancelEvt);


    },
    handleEvent = {
        // 车牌号输入事件
        selCarNoEvt: function() {
            var $this = $(this),
                index = $this.data('index');
            $this.addClass('actived').siblings().removeClass('actived');
            keyBoard.createKeyBoardDom($('.keyboard-wrapper'), index == 0 ? 1 : 2);
            curActiveIndex = index;
        },
        // 车牌颜色选择
        selCarColEvt: function(e) {
            var $this = $(this),
                index = $this.index(),
                val = $(e.currentTarget).data('val');
            // 0-蓝牌；1-黄牌；4-渐变绿；
            $this.addClass(val == 0 ? 'plate-sel-blue selected' : (val == 1 ? 'plate-sel-yellow selected' : 'plate-sel-green selected')).siblings().removeClass('plate-sel-blue plate-sel-yellow plate-sel-green');
            curCarColVal = val;
        },
        // 键盘删除按钮点击事件
        btnDelEvt: function(e) {
            $('.input-carno-wrap span').eq(curActiveIndex).text(null);
            if (curActiveIndex == 6) $('.input-carno-wrap .item').eq(curActiveIndex).addClass('xny-bg new-energy')
        },
        // 键盘确定按钮点击事件
        btnSureEvt: function() {
            $('.keyboard-wrapper').empty();
        },
        // 键盘key值点击事件
        selectKeyBoardItemEvt: function(e) {
            var val = $(e.currentTarget).data('val');
            $('.input-carno-wrap .item').eq(curActiveIndex).text(val);
            curCarNo[curActiveIndex] = val;
            if (curActiveIndex == 6) $('.input-carno-wrap .item').eq(curActiveIndex).removeClass('xny-bg new-energy')
        },
        // ETC 车牌号提交
        submitEvt: function() {
            // 改为本地物理存储
            var plateNo = curCarNo.join(''),
                plateCol = $('.select-car-color-wrap .selected').data('val'),
                obj = {};
            for (var i = 0; i < curCarNo.length; i++) {
                if (i < 6 && curCarNo[i] == null) {
                    util.showToast('请输入正确的车牌号！');
                    return;
                }
            }
            if (!plateCol) {
                util.showToast('请选择车牌颜色！');
                return;
            }
            obj = {
                "plate_no": plateNo,
                "plate_color": plateCol
            }
            curData.vehicleInfoList.push(obj);
            util.setLocalInfos(curData);
            window.location.href = '../../index.html';
            // window.history.back()
        },
        // 取消添加车牌号事件
        cancelEvt: function() {
            window.location.href = '../../index.html';
        }
    };
$(function() {
    addEvent();
    curData = util.getLocalInfos();
    console.log(curData)
        // 0-蓝牌；1-黄牌；4-渐变绿；
        // 输入框第一次进来有默认选择？ 车辆颜色有默认选择吗？
});