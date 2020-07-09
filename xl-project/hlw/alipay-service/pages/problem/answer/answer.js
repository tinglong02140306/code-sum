import APIs from "../../../apis/index";
import { getLoginState, hideLoading, showLoading, showToast } from "../../../utils/util";
import { getSettings } from "../../../utils/request";

const app = getApp();
Page({
    data: {
        title: "",
        content: "",
        inuse: false,
        nouse: false,
        inuseNotice: false,
        nouseNotice: false,
        questionId: "",
        logined: false,
        loaded: false
    },
    // 问题评价 1-有帮助；0-无帮助；
    problemEval(type, callback) {
        let params = {
            question_id: this.data.questionId,
            eval_type: type
        };
        showLoading();
        APIs.problemEval(params).then(res => {
            hideLoading();
            callback && callback();
        }).catch(err => {
            hideLoading();
            setTimeout(() => {
                this.setData({ loaded: true });
            }, 200);
            showToast(err.message);
        });
    },
    comment(e) {
        const { type } = e.currentTarget.dataset;
        if (this.data.inuse || this.data.nouse) return;
        let self = this;
        this.problemEval(type, function() {
            self.showTips(type);
        });
    },
    showTips(type) {
        if (type === "1") {
            this.setData({
                inuse: !this.data.inuse
            });
            if (this.data.inuse) {
                this.setData({
                    inuseNotice: true
                });
            }
            setTimeout(() => {
                this.setData({
                    inuseNotice: false
                });
            }, 7000);
            return;
        }
        this.setData({
            nouse: !this.data.nouse
        });
        if (this.data.nouse) {
            this.setData({
                nouseNotice: true
            });
        }
        setTimeout(() => {
            this.setData({
                nouseNotice: false
            });
        }, 7000);
    },
    async onLoad(options) {
        this.setData({
            questionId: options.id,
            logined: await getLoginState()
        });
        let res, res2;
        const params = { question_id: this.data.questionId };
        try {
            showLoading();
            if (this.data.logined) {
                [{ data: res }, { data: res2 }] = await Promise.all([APIs.problemDetail(params), APIs.problemEvalQuery(params)]);
                this.setData({
                    inuse: res2 && res2["eval_type"] === "1",
                    nouse: res2 && res2["eval_type"] === "0"
                });
            } else {
                res = await APIs.problemDetail(params);
                res = res.data;
            }
            this.setData({
                title: res["question"],
                content: res["answer"],
            });
            setTimeout(() => {
                this.setData({ loaded: true });
            }, 200);
            hideLoading();
        } catch (e) {
            hideLoading();
            showToast(e.message);
            setTimeout(() => my.navigateBack(), 2000);
        }
    },
});