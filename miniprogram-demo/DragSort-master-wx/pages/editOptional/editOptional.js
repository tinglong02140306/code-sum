Page({
    data: {
        optionsListData: [],
        movableViewPosition: {
            x: 0,
            y: 0,
            className: "none",
            data: {}
        },
        scrollPosition: {
            everyOptionCell: 65,
            top: 47,
            scrollTop: 0,
            scrollY: true,
            scrollViewHeight: 1000,
            scrollViewWidth: 375,
            windowViewHeight: 1000,
        },
        selectItemInfo: {
            sName: "",
            sDtSecCode: "",
            sCode: "",
            selectIndex: -1,
            selectPosition: 0,
        },
    },
    bindscroll: function (event) {
        var scrollTop = event.detail.scrollTop;
        this.setData({
            'scrollPosition.scrollTop': scrollTop
        })
    },
    getOptionInfo: function (code) {
        for (var i = 0, j = this.data.optionsListData.length; i < j; i++) {
            var optionData = this.data.optionsListData[i];
            if (optionData.sDtSecCode == code) {
                optionData.selectIndex = i;
                return optionData;
            }
        }
        return {};
    },
    getPositionDomByXY: function (potions) {
        var y = potions.y - this.data.scrollPosition.top + this.data.scrollPosition.scrollTop;
        var optionsListData = this.data.optionsListData;
        var everyOptionCell = this.data.scrollPosition.everyOptionCell;
        for (var i = 0, j = optionsListData.length; i < j; i++) {
            if (y >= i * everyOptionCell && y < (i + 1) * everyOptionCell) {
                return optionsListData[i];
            }
        }
        return optionsListData[0];
    },
    draggleTouch: function (event) {
        var touchType = event.type;
        switch (touchType) {
            case "touchstart":
                this.scrollTouchStart(event);
                break;
            case "touchmove":
                this.scrollTouchMove(event);
                break;
            case "touchend":
                this.scrollTouchEnd(event);
                break;
        }
    },
    scrollTouchStart: function (event) {
        // console.log(event);
        var firstTouchPosition = {
            x: event.changedTouches[0].pageX,
            y: event.changedTouches[0].pageY,
        }
        console.log("firstTouchPosition:", firstTouchPosition);
        var domData = this.getPositionDomByXY(firstTouchPosition);
        console.log("domData:", domData);

        //movable-area滑块位置处理
        var movableX = 0;
        var movableY = firstTouchPosition.y - this.data.scrollPosition.top - this.data.scrollPosition.everyOptionCell / 2;

        this.setData({
            movableViewPosition: {
                x: movableX,
                y: movableY,
                className: "",
                data: domData
            }
        })

        var secCode = domData.sDtSecCode;
        var secInfo = this.getOptionInfo(secCode);
        secInfo.selectPosition = event.changedTouches[0].clientY;
        secInfo.selectClass = "dragSelected";

        this.data.optionsListData[secInfo.selectIndex].selectClass = "dragSelected";

        var optionsListData = this.data.optionsListData;

        this.setData({
            'scrollPosition.scrollY': false,
            selectItemInfo: secInfo,
            optionsListData: optionsListData,
            'scrollPosition.selectIndex': secInfo.selectIndex
        })
    },
    scrollTouchMove: function (event) {
        var selectItemInfo = this.data.selectItemInfo;
        var selectPosition = selectItemInfo.selectPosition;
        var moveDistance = event.changedTouches[0].clientY;
        var everyOptionCell = this.data.scrollPosition.everyOptionCell;
        var optionsListData = this.data.optionsListData;
        var selectIndex = selectItemInfo.selectIndex;

        console.log("event.changedTouches:", event.changedTouches);
        //movable-area滑块位置处理
        var movableX = 0;
        var movableY = event.changedTouches[0].pageY - this.data.scrollPosition.top - this.data.scrollPosition.everyOptionCell / 2;


        this.setData({
            movableViewPosition: {
                x: movableX,
                y: movableY,
                className: "",
                data: this.data.movableViewPosition.data
            }
        })

        if (moveDistance - selectPosition > 0 && selectIndex < optionsListData.length - 1) {
            if (optionsListData[selectIndex].sDtSecCode == selectItemInfo.sDtSecCode) {
                optionsListData.splice(selectIndex, 1);
                optionsListData.splice(++selectIndex, 0, selectItemInfo);
                selectPosition += everyOptionCell;
            }
        }

        if (moveDistance - selectPosition < 0 && selectIndex > 0) {
            if (optionsListData[selectIndex].sDtSecCode == selectItemInfo.sDtSecCode) {
                optionsListData.splice(selectIndex, 1);
                optionsListData.splice(--selectIndex, 0, selectItemInfo);
                selectPosition -= everyOptionCell;
            }
        }

        this.setData({
            'selectItemInfo.selectPosition': selectPosition,
            'selectItemInfo.selectIndex': selectIndex,
            optionsListData: optionsListData,
        });
    },
    scrollTouchEnd: function (event) {
        console.log(event);
        var optionsListData = this.optionsDataTranlate(this.data.optionsListData, "");

        this.setData({
            optionsListData: optionsListData,
            'scrollPosition.scrollY': true,
            'movableViewPosition.className': "none"
        })
    },
    
    optionsDataTranlate: function (optionsList, selectClass) {
        for (var i = 0, j = optionsList.length; i < j; i++) {
            optionsList[i].selectClass = selectClass;
        }
        return optionsList;
    },
    onLoad: function (options) {
        var systemInfo = wx.getSystemInfoSync();
        var optionsList = [{
            "sCode": "600879",
            "sDtSecCode": "0101600879",
            "sName": "航天电子",
            "iUpdateTime": 1496362315,
            "fNow": "--",
            "sRate": "--",
            "className": "block_wave block_stop"
        }, {
            "sCode": "00700",
            "sDtSecCode": "020100700",
            "sName": "腾讯控股",
            "iUpdateTime": 1495531418,
            "fNow": "--",
            "sRate": "--",
            "className": "block_wave block_stop"
        }];
        optionsList = this.optionsDataTranlate(optionsList, "");
        // 开始加载页面
        var scrollViewHeight = systemInfo.windowHeight;
        var scrollViewWidth = systemInfo.windowWidth;
        this.setData({
            optionsListData: optionsList,
            'scrollPosition.scrollViewWidth': scrollViewWidth,
            'scrollPosition.scrollViewHeight': scrollViewHeight,
            'scrollPosition.windowViewHeight': systemInfo.windowHeight,
        });
    }
});