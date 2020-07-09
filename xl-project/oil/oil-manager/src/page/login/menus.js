const sortMenus = function (dataArray) {
    dataArray.sort((item1, item2) => {
        return item1.index - item2.index
    });
}

export function menus(data) {
    let menus = [];
    let business = {
        key: '/business', title: '企业管理', icon: 'tags-o',
        sub: [],
    }
    let order = {
        key: '/order', title: '订单报表', icon: 'paper-clip',
        sub: [],
    }
    let financial = {
        key: '/financial', title: '财务报表', icon: 'bar-chart',
        sub: [],
    }
    let invoice = {
        key: '/invoice', title: '发票', icon: 'contacts',
        sub: [],
    }
    let wxcard = {
        key: '/wx-member-card', title: '微信会员卡', icon: 'red-envelope',
        sub: [],
    }
    let wx = {
        key: '/wx-applet', title: '微信小程序', icon: 'save',
        sub: [],
    }
    let account = {
        key: '/account', title: '账户', icon: 'save',
        sub: [],
    }
    let ticket = {
        key: '/ticket', title: '优惠券', icon: 'gift',
        sub: [],
    }
    let billFix = {
        key: '/bill-fix', title: '订单差调', icon: 'paper-clip',
        sub: [],
    }
    let system = {
        key: '/system', title: '系统管理', icon: 'setting',
        sub: [],
    }
    let shell = {
        key: '/shell', title: '壳牌加油业务', icon: 'tag',
        sub: [],
    }
    let station = {
        key: '/station', title: '油站信息管理', icon: 'folder',
        sub: [],
    }
    let discount = {
        key: '/discount', title: '油站折扣', icon: 'folder',
        sub: [],
    }
    let washer = {
        key: '/vehicle-cleaning', title: '洗车', icon: 'folder',
        sub: [],
    }


    for (let menu of data) {
        if (menu === "business-partner") {
            business.sub.push({ key: '/business-partner', title: '合作方', icon: '', index: 0 })
        } else if (menu === "business-organization") {
            business.sub.push({ key: '/business-organization', title: '机构方', icon: '', index: 1 });
        } else if (menu === "shell-oil-price") {
            station.sub.push({ key: '/shell-oil-price', title: '市场油价', icon: '', index: 0 });
        } else if (menu === "station-company") {
            station.sub.push({ key: '/station-company', title: '合作伙伴', icon: '', index: 1 });
        } else if (menu === "station-brand") {
            station.sub.push({ key: '/station-brand', title: '品牌管理', icon: '', index: 2 });
        } else if (menu === "station-info") {
            station.sub.push({ key: '/station-info', title: '油站管理', icon: '', index: 3 });
        } else if (menu === "station-image") {
            station.sub.push({ key: '/station-image', title: '油站图片', icon: '', index: 4 });
        } else if (menu === "station-oil-price") {
            station.sub.push({ key: '/station-oil-price', title: '油价管理', icon: '', index: 5 });
        } else if (menu === "station-terminal") {
            station.sub.push({ key: '/station-terminal', title: '终端管理', icon: '', index: 6 });
        } else if (menu === "station-oil-gun") {
            station.sub.push({ key: '/station-oil-gun', title: '油枪查询', icon: '', index: 7 });
        } else if (menu === "station-cache") {
            station.sub.push({ key: '/station-cache', title: '缓存管理', icon: '', index: 8 });
        } else if (menu === "discount-catory") {
            discount.sub.push({ key: '/discount-catory', title: '折扣', icon: '', index: 0 });
        } else if (menu === "discount-station") {
            discount.sub.push({ key: '/discount-station', title: '油站关联', icon: '', index: 1 });
        } else if (menu === "shell-oil-price-updata") {
            shell.sub.push({ key: '/shell-oil-price-updata', title: '油价更新结果', icon: '', index: 1 });
        } else if (menu === "shell-terminal-group") {
            shell.sub.push({ key: '/shell-terminal-group', title: '终端分组维护', icon: '', index: 2 });
        } else if (menu === "shell-terminal") {
            shell.sub.push({ key: '/shell-terminal', title: '终端信息维护', icon: '', index: 3 });
        } else if (menu === "shell-forms") {
            shell.sub.push({ key: '/shell-forms', title: '销售明细报表', icon: '', index: 4 });
        } else if (menu === "shell-summary-report") {
            shell.sub.push({ key: '/shell-summary-report', title: '销售汇总报表', icon: '', index: 5 });
        } else if (menu === "order-waybill") {
            order.sub.push({ key: '/waybill-query', title: '运单表', icon: '', index: 0 });
        } else if (menu === "order-water") {
            order.sub.push({ key: '/order-water', title: '消费流水', icon: '', index: 1 });
        } else if (menu === "order-water-collect") {
            order.sub.push({ key: '/order-water-collect', title: '流水统计表', icon: '', index: 2 });
        } else if (menu === "account-check") {
            order.sub.push({ key: '/account-check', title: '对账数据', icon: '', index: 4 });
        } else if (menu === "financial-daily") {
            financial.sub.push({ key: '/financial', title: '财务日报表', icon: '', index: 0 });
        } else if (menu === "financial-product") {
            financial.sub.push({ key: '/oil-product', title: '产品消费报表', icon: '', index: 1 });
        } else if (menu === "report-wx-recharge") {
            financial.sub.push({ key: '/report-wx-recharge', title: '会员卡充值报表', icon: '', index: 2 });
        } else if (menu === "report-wx-consume") {
            financial.sub.push({ key: '/report-wx-consume', title: '会员卡消费报表', icon: '', index: 3 });
        } else if (menu === "oil-card-statistics") {
            financial.sub.push({ key: '/oil-card-statistics', title: '电子卡运营统计', icon: '', index: 4 });
        } else if (menu === "oil-product-statistics") {
            financial.sub.push({ key: '/oil-product-statistics', title: '各产品消费统计', icon: '', index: 5 });
        } else if (menu === "report-fee-import") {
            financial.sub.push({ key: '/report-fee-import', title: '上传通道手续费', icon: '', index: 6 });
        } else if (menu === "invoice-all") {
            invoice.sub.push({ key: '/invoice', title: '增值税专票', icon: 'contacts', index: 0 });
        } else if (menu === "invoice-regular") {
            invoice.sub.push({ key: '/invoice-regular', title: '普通发票', icon: 'contacts', index: 1 });
        } else if (menu === "wx-pos-user") {
            wxcard.sub.push({ key: '/wx-pos-user', title: '小票用户查询', icon: '', index: 0 });
        } else if (menu === "wx-etc-interests") {
            wx.sub.push({ key: '/wx-etc-interests', title: '权益专区', icon: '', index: 0 });
        } else if (menu === "wx-etc-blacklist") {
            wx.sub.push({ key: '/wx-etc-blacklist', title: 'ETC黑名单', icon: '', index: 1 });
        } else if (menu === "wx-static") {
            wx.sub.push({ key: '/wx-static', title: '静态资源', icon: '', index: 2 });
        } else if (menu === "wx-banner") {
            wx.sub.push({ key: '/wx-banner', title: 'banner', icon: '', index: 3 });
        } else if (menu === "account-etc-gold") {
            account.sub.push({ key: '/account-etc-gold', title: '加油金', icon: '', index: 0 });
        } else if (menu === "bill-online") {
            billFix.sub.push({ key: '/bill-online', title: '在线支付订单', icon: '', index: 0 });
        } else if (menu === "bill-etc") {
            billFix.sub.push({ key: '/bill-etc', title: '扫码刷卡订单', icon: '', index: 1 });
        }
        // else if (menu==="bill-partner"){
        //     billFix.sub.push( { key: '/bill-partner', title: '第三方订单', icon: '', index:2});
        // }
        else if (menu === "bill-ticket") {
            billFix.sub.push({ key: '/bill-ticket', title: '第三方小票打印', icon: '', index: 3 });
        } else if (menu === "system-user") {
            system.sub.push({ key: '/system-user', title: '用户管理', icon: '', index: 0 });
        } else if (menu === "system-role") {
            system.sub.push({ key: '/system-role', title: '角色管理', icon: '', index: 1 });
        } else if (menu === "system-params") {
            system.sub.push({ key: '/system-params', title: '系统参数', icon: '', index: 4 });
        } else if (menu === "system-quartz") {
            system.sub.push({ key: '/system-quartz', title: '任务管理', icon: '', index: 5 });
        } else if (menu === "vehicle-cleaning-brand") {
            washer.sub.push({ key: '/vehicle-cleaning-brand', title: '洗车机品牌', icon: '', index: 0 });
        } else if (menu === "vehicle-cleaning-info") {
            washer.sub.push({ key: '/vehicle-cleaning-info', title: '洗车机信息', icon: '', index: 1 });
        } else if (menu === "vehicle-cleaning-order") {
            washer.sub.push({ key: '/vehicle-cleaning-order', title: '洗车机订单', icon: '', index: 2 });
        } else if (menu === "ticket-manage") {
            ticket.sub.push({ key: '/ticket-manage', title: '优惠券管理', icon: '', index: 0 });
        } else if (menu === "ticket-grant") {
            ticket.sub.push({ key: '/ticket-grant', title: '优惠券发放', icon: '', index: 1 });
        } else if (menu === "ticket-bag") {
            ticket.sub.push({ key: '/ticket-bag', title: '洗车券包管理', icon: '', index: 2 });
        } else if (menu === "ticket-bag-order") {
            ticket.sub.push({ key: '/ticket-bag-order', title: '洗车券包订单', icon: '', index: 3 });
            ticket.sub.push({ key: '/ticket-white-list', title: '白名单录入', icon: '', index: 3 });
        }
    }

    sortMenus(business.sub);
    sortMenus(station.sub);
    sortMenus(discount.sub);
    sortMenus(shell.sub);
    sortMenus(order.sub);
    sortMenus(financial.sub);
    sortMenus(invoice.sub);
    sortMenus(wxcard.sub);
    sortMenus(wx.sub);
    sortMenus(account.sub);
    sortMenus(ticket.sub);
    sortMenus(billFix.sub);
    sortMenus(system.sub);
    sortMenus(washer.sub);


    business.sub.length ? menus.push(business) : null;
    station.sub.length ? menus.push(station) : null;
    discount.sub.length ? menus.push(discount) : null;
    shell.sub.length ? menus.push(shell) : null;
    order.sub.length ? menus.push(order) : null;
    financial.sub.length ? menus.push(financial) : null;
    invoice.sub.length ? menus.push(invoice) : null;
    wxcard.sub.length ? menus.push(wxcard) : null;
    wx.sub.length ? menus.push(wx) : null;
    washer.sub.length ? menus.push(washer) : null;
    account.sub.length ? menus.push(account) : null;
    ticket.sub.length ? menus.push(ticket) : null;
    billFix.sub.length ? menus.push(billFix) : null;
    system.sub.length ? menus.push(system) : null;

    console.log(washer.sub)
    return menus;
}