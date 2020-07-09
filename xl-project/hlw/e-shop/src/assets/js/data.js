let skuObj = {

    sku: {
        // 所有sku规格类目与其值的从属关系，比如商品有颜色和尺码两大类规格，颜色下面又有红色和蓝色两个规格值。
        // 可以理解为一个商品可以有多个规格类目，一个规格类目下可以有多个规格值。
        tree: [{
            k: '品种规格',
            k_s: 's1',
            v: [{ id: '', name: '' }]
        }],
        list: [],
        price: '5.00',
        stock_num: 100, // 商品总库存
        none_sku: false, // 是否无规格商品 
        hide_stock: true // 是否隐藏剩余库存
    },
    goods_id: '946755',
    goods_info: {},
    initialSku: {},
    weight: "", // 单位kg
    dealData(product, type) {
        let specs = product.specs_list,
            sku = skuObj.sku;
        sku.tree[0].v = [];
        sku.list = [];
        // 后台会传一个最低价格 如果规格就一个 就显示最低价格 1个以上显示最低价格加 起
        sku.price = product.lowest_price + (specs.length > 1 ? '起' : '');
        for (let i = 0; i < specs.length; i++) {
            if (type != 'detail') {
                if (specs[i].is_selected) {
                    skuObj.initialSku = {
                        s1: specs[i].specs_id,
                        selectedNum: product.quantity
                    }
                    skuObj.weight =specs[i].weight
                }
            } else {
                skuObj.initialSku = {}
            }
            let obj = {
                    id: specs[i].specs_id,
                    name: specs[i].specs_name,
                },
                listObj = {
                    price: parseFloat(specs[i].price) * 100, //价格
                    s1: specs[i].specs_id,
                    s2: '0',
                    stock_num: 10000000, //库存 
                    goods_id: product.product_id,
                    weight:specs[i].weight
                }
            sku.tree[0].v.push(obj);
            sku.list.push(listObj);
            skuObj.goods_info.picture = type == 'detail' ? product.images[0] : product.image;
        }
        return skuObj.initialSku;
    }
};
export default skuObj;