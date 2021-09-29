import { observer } from 'mobx-react';
import React, { useEffect, useRef, useState } from 'react';
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
  const [topNum, setTopNum] = useState(0);
  const kitchenContainer = useRef();
  
  //메인 useEffect : 초기 목록조회, 사이징처리, sse세팅
  useEffect(() => {
    OrderStore.fetchOrdersInProgress().then();
    resizing();
    
    const es_ = new EventSource(`${NOTI_HOST}/kitchen`);
    es_.onmessage = (e) => {
      const reqWaitingNum = JSON.parse(e.data).data.waitingNum;
      OrderStore.addOrdersInProgressBySSE(reqWaitingNum);
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
  const orderFrameWidth = 326;
  const resizing = () => {
    setTopNum(() =>
    Math.floor((kitchenContainer.current.clientWidth -140)  / orderFrameWidth));
    OrderStore.resizingEffect(Math.floor((kitchenContainer.current.clientWidth -140)  / orderFrameWidth));
  };

  return (
    <>
      <div className={'kitchen-top'}>
          <RemoveAllButton/>
      </div>
      <div className={'kitchen-container'} ref={kitchenContainer}>
        <div className={'left-arrow-space'}>
          <ArrowIcon direction={'left'} />
        </div>
        {OrderStore.ordersInProgressOnView.length === 0 ? (
          <EmptyBox />
          ) : (
            OrderStore.ordersInProgressOnView
            .slice(undefined, topNum)
            .map((order) => (
              <KitchenOrderFrame key={order.orderId} order={order} />
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
