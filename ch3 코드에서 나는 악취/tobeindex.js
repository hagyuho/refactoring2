import { observer } from 'mobx-react';
import React, { useEffect, useRef } from 'react';
import KitchenOrderFrame from '../../component/kitchen/KitchenOrderFrame';
import UseStore from '../../stores/UseStore';
import EventSource from 'eventsource';
import ArrowIcon from '../../component/kitchen/ArrowIcon';
import EmptyBox from '../../component/kitchen/EmptyBox';
import { NOTI_HOST } from '../../utils/config';
import './index.css';
import RemoveAllButton from '../../component/kitchen/RemoveAllButton';

const Kitchen = observer(() => {
  const { OrderStore } = UseStore();
  const kitchenContainer = useRef();

  //메인 useEffect : 초기 목록조회, 사이징처리, sse세팅
  useEffect(() => {
    OrderStore.fetchInProgressOrders().then();
    resizing();
    const es_ = new EventSource(`${NOTI_HOST}/kitchen`);
    es_.onmessage = (e) => {
      let sseCode = JSON.parse(e.data).sseCode;
      let waitingNum = JSON.parse(e.data).data.waitingNum;
      //sseCode : K001(신규주문생성), K002(주문승인)
      sseCode === 'K001'
        ? OrderStore.addInProgressOrdersBySSE(waitingNum)
        : OrderStore.fetchInProgressOrders().then();
    };
    return () => {
      es_.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //서브 useEffect : 리사이징 함수 호출
  useEffect(() => {
    window.addEventListener('resize', resizing);
    return () => {
      window.removeEventListener('resize', resizing);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // window 크기가 변할때마다 노출 갯수 변경
  const orderFrameWidth = 371;
  const resizing = () => {
    let topNum =
      kitchenContainer.current.clientWidth - 40 <= orderFrameWidth
        ? 1
        : Math.floor(
            (kitchenContainer.current.clientWidth - 40) / orderFrameWidth
          );
    OrderStore.setTopNum(topNum);
    OrderStore.setTotalPage();
    OrderStore.checkNowPage();
  };

  return (
    <>
      <div className={'kitchen-top'}>
        <RemoveAllButton />
      </div>
      <div className={'kitchen-container'} ref={kitchenContainer}>
        <div className={'left-arrow-space'}>
          <ArrowIcon direction={'left'} />
        </div>
        {OrderStore.ordersInProgress.length === 0 ? (
          <EmptyBox />
        ) : (
          OrderStore.ordersInProgress
            .slice((OrderStore.nowPage - 1) * OrderStore.topNum, OrderStore.nowPage * OrderStore.topNum)
            .map((order) => (
              <KitchenOrderFrame key={order.orderId} order={order}/>
            ))
        )}
        <div className={'right-arrow-space'}>
          <ArrowIcon direction={'right'} />
        </div>
      </div>
    </>
  );
});

export default Kitchen;
