import invoices from "../invoices.js";
import plays from "../plays.js";


function statement(invoice, plays) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;

  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  for (let perf of invoice.performances) {
    //const play = playFor(perf); // <= 우변을 함수로 추출 // 인라인된 변수 제거

    let thisAmount = amountFor(perf,playFor(perf));  //<= 변수 인라인하기

    volumeCredits += Math.max(perf.audience - 30, 0);
    if ("comedy" === playFor(perf).type) volumeCredits += Math.floor(perf.audience / 5); //<= 변수 인라인하기

    result += `${playFor(perf).name}: ${format(thisAmount / 100)} (${ //<= 변수 인라인하기
      perf.audience
    }석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount / 100)}`;
  result += `적립 포인트: ${volumeCredits}점`;
  return result;
}

function amountFor(aPerformance, play) {

  let result = 0; 
  switch (play.type) {
    case "tragedy": 
    result = 40000;
      if (aPerformance.audience > 30) {
        result += 1000 * (aPerformance.audience - 30);
      }
      break;

    case "comedy": 
    result = 30000;
      if (aPerformance.audience > 20) {
        result += 10000 + 500 * (aPerformance.audience - 20);
      }
      result += 300 * aPerformance.audience;
      break;

    default:
      throw new Error(`알 수 없는 장르 : ${play.type}`); 
  }

  return result; 
}

//임시 변수를 질의 함수로 바꾸기
function playFor(aPerformance){
  return  plays[aPerformance.playID];
}


console.log(statement(invoices[0], plays));
