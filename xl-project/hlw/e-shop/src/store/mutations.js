export default {
    modToken: (state, payload) => state.token = payload,
    updateUserInfo: (state, payload) => state.userInfo = payload,
    updateProductId: (state, payload) => state.productId = payload,
    updateAddressInfo: (state, payload) => state.addressInfo = payload,
    updateOrderId: (state, payload) => state.orderId = payload,
    updateProductList: (state, payload) => state.productList = payload,
    updateNote: (state, payload) => state.note = payload,
    updateCartCount: (state, payload) => state.cartCount = payload,
    updateActiveTab: (state, payload) => state.activeTab = payload,
    updateMoneyAmount: (state, payload) => state.moneyAmount = payload,
    updateViewType: (state, payload) => state.viewType = payload,
    updateAddresslist: (state, payload) => state.addresslist = payload,
    updateRedirectUrl: (state, payload) => state.redirectUrl = payload,
    updateShopId: (state, payload) => state.shopId = payload
};