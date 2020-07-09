var province = ['京', '津', '渝', '沪', '冀', '晋', '辽', '吉', '黑', '浙', '皖', '闽', '赣', '鲁', '豫', '鄂', '湘', '粤', '川', '贵', '云', '陕', '甘', '青', '蒙', '桂', '宁', '苏', '琼', '新', '藏'],
    numAlphas = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P', 'A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Z', 'X', 'C', 'V', 'B', 'N', 'M'];
// alphas
var keyBoard = {
    // type 1: province 2: numAlphas
    createKeyBoardDom: function($dom, type) {
        // if(type == )
        var data = type && type == 1 ? province : numAlphas;
        var $html = `<div class="area-keyboard">
                        <div class="content">`;
        for (var i = 0; i < data.length; i++) {
            $html += `<span>${data[i]}</span>`
        }
        $html += `</div>
                    <div class="btn-wrap">
                        <span class="btn-del"></span>
                        <span class="btn-sure">确定</span>
                    </div>`;
        $dom.empty().append($html);
    }
}