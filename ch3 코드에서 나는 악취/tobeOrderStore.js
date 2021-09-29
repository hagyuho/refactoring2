import { observable, runInAction } from 'mobx';
import kitchenOrderApis from '../utils/KitchenOrderAPI';

const OrderStore = observable({
  ordersInProgress: [],
  topNum: 5,
  limit: 20,
  totalPage: 1,
  nowPage: 1,

  // [API : R ] 제조중인 주문 요청 조회 ( 초기화면 로딩 시 )
  async fetchInProgressOrders() {
    try {
      let res = await kitchenOrderApis.fetchInProgressOrders();
      runInAction(() => {
        this.ordersInProgress = [...res];
        this.setTotalPage();
        this.checkNowPage();
      });
    } catch (err) {
      console.log(err);
    }
  },

  // [API : R ] SSE연동하여 제조중인 주문 요청 조회 및 추가
  async addInProgressOrdersBySSE(reqWaitingNum) {
    try {
      if (this.ordersInProgress.length < this.limit) {
        let res = await kitchenOrderApis.fetchInProgressOrderBySSE(reqWaitingNum);
        runInAction(() => {
          this.ordersInProgress = [...this.ordersInProgress, res[0]];
          this.setTotalPage();
        });
      } 
    } catch (e) {
      console.log(e);
    }
  },

  // [API : U ] 제조 완료 처리
  completeOrderProgress(orderId) {
    try{
      let orderStatus = {
        orderStatus: 'complete',
      };
      kitchenOrderApis.updateOrderProgress(orderStatus,orderId);
    }catch(e){
      console.log(e)
    }
  },

  // [내부동작] 총 페이지 계산 및 세팅
  setTotalPage() {
    runInAction(() => {
      this.totalPage = Math.ceil(this.ordersInProgress.length / this.topNum);
    });
  },

  // [내부동작] 현재 페이지 세팅
  setNowPage(page) {
    runInAction(() => {
      this.nowPage = page;
    });
  },

  // [내부동작] 화면표시개수 세팅
  setTopNum(topNum) {
    runInAction(() => {
      this.topNum = topNum;
    });
  },

  // [화면 렌더링] 현재페이지와 총페이지 비교하여 랜더링
  checkNowPage() {
    if (this.totalPage !== 0 && this.nowPage > this.totalPage) {
      this.setNowPage(this.totalPage);
    }
  },
});

export default OrderStore;
