import axios from 'axios';
import { CUBE_HOST } from './config';

const kitchenOrderApis = {

  limit : 20,
  
  
  async fetchInProgressOrders() {
    try {
      let response = await axios
        .get(`${CUBE_HOST}/orders/status/in-progress?${this.limit}`)
        .then((res) => res);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },

  async fetchInProgressOrderBySSE(reqWaitingNum) {
    try {
      let response = await axios
      .get(
        `${CUBE_HOST}/orders/status/in-progress?lastWaitingNum=${
          reqWaitingNum - 1
        }`)
        .then((res) => res);
      return response.data;
    } catch (e) {
      console.log(e);
    }
  },

  updateOrderProgress(orderStatus,orderId){
      try{
        axios.patch(`${CUBE_HOST}/orders/${orderId}/status`, orderStatus)
      }catch(e){
        console.log(e);
      }
  }

};

export default kitchenOrderApis;
