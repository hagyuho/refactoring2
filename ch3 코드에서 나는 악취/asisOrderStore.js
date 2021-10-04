import { observable, runInAction } from 'mobx';
import axios from 'axios';

// Nginx(ingress) 접속(CORS 설정):
const url = 'http://192.168.159.55:30200';

const OrderStore = observable({
  ordersInProgress: [],
  ordersInProgressOnView: [],
  onePageLimit: 5,
  limit: 20,
  totalPage: '',
  nowPage: 1,

  // [API : R ] 제조중인 주문 요청 조회 ( 초기화면 로딩 시 )
  async fetchOrdersInProgress() {
    try {
      let res = await axios.get(
        `${url}/orders/status/in-progress?${this.limit}`
      );
      runInAction(() => {
        this.setTotalPage(res.data);
        this.setArray(res.data, this.nowPage);
      });
    } catch (err) {
      console.log(err);
    }
  },

  // [API : R ] SSE연동하여 제조중인 주문 요청 조회 및 추가
  addOrdersInProgressBySSE(reqWaitingNum) {
    this.ordersInProgress.length < this.limit
      ? axios
          .get(
            `${url}/orders/status/in-progress?lastWaitingNum=${reqWaitingNum - 1 }`
          )
          .then((res) => {
            this.ordersInProgress = [...this.ordersInProgress, res.data[0]];
            this.setTotalPage(this.ordersInProgress);
            this.setArray(this.ordersInProgress, this.nowPage);
          })
          .catch((error) => {
            alert(error);
          })
      : console.log('enough order Data');
  },

  // [API : U ] 제조 완료 처리
  completeOrderProgress(orderId) {
    const orderStatus = {
      orderStatus: 'complete',
    };

    axios
      .patch(`${url}/orders/${orderId}/status`, orderStatus)
      .catch((error) => {
        alert(error);
      });
  },

  // [내부동작] 화살표 클릭
  clickArrowIcon(signNum) {
    this.setNowPage(this.nowPage + signNum);
    this.setTotalPage(this.ordersInProgress);
    this.setArray(this.ordersInProgress, this.nowPage);
  },

  // [내부동작] 총 페이지 계산 및 세팅
  setTotalPage(array) {
    this.totalPage = Math.ceil(array.length / this.onePageLimit);
  },

  // [내부동작] 현재 페이지 세팅
  setNowPage(page) {
    this.nowPage = page;
  },

  // [내부동작] 화면크기 조절 시 주문내역 표시 개수에 따라 화면변경
  resizingEffect(topNum) {
    const asisOnePageLimit = this.onePageLimit;
    this.onePageLimit = topNum;
    if (topNum !== asisOnePageLimit) {
      this.setArray(this.ordersInProgress, this.nowPage);
    }
  },

  // [내부동작] 배열 세팅
  // 전체 배열(ordersInProgress) 내 데이터 수, 현재 페이지를 고려하여 화면에 보여줄 배열 구성(ordersInProgressOnView)
  setArray(orders, pageNum) {
    this.ordersCount = orders.length;
    this.ordersInProgress = [...orders];
    this.nowPage = pageNum;

    this.ordersInProgressOnView = [];

    this.ordersInProgressOnView =
      this.ordersCount > pageNum * this.onePageLimit
        ? pageNum === 1
          ? [
              ...this.ordersInProgress.slice(
                (pageNum - 1) * this.onePageLimit,
                pageNum * this.onePageLimit
              ),
            ]
          : [
              ...this.ordersInProgress.slice(
                (pageNum - 1) * this.onePageLimit,
                pageNum * this.onePageLimit
              ),
            ]
        : pageNum === 1
        ? [...this.ordersInProgress.slice((pageNum - 1) * this.onePageLimit)]
        : [...this.ordersInProgress.slice((pageNum - 1) * this.onePageLimit)];
  },
});

export default OrderStore;
