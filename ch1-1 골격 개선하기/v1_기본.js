import invoices from "../invoices.js";
import plays from "../plays.js";

function statement(invoice, plays) {
  // [변수] 지역변수 선언
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;
  
  // [함수] 달러 포메팅 함수 선언
  const format = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format;

  // [로직] for 반복문으로 총액 계산 로직
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = 0;

    switch (play.type) {
      case "tragedy": //비극
        thisAmount = 40000;
        if (perf.audience > 30) {
          thisAmount += 1000 * (perf.audience - 30);
        }
        break;

      case "comedy": // 희극
        thisAmount = 30000;
        if (perf.audience > 20) {
          thisAmount += 10000 + 500 * (perf.audience - 20);
        }
        thisAmount += 300 * perf.audience;
        break;

      default:
        throw new Error(`알 수 없는 장르 : ${play.type}`);
    }

    // [로직] 포인트를 적립 계산
    volumeCredits += Math.max(perf.audience - 30, 0);
    //희극 관객 5명마다 추가 포인트를 제공한다.
    if ("comedy" === play.type) volumeCredits += Math.floor(perf.audience / 5);

    // [출력] 청구내역 출력.
    result += `${play.name}: ${format(thisAmount / 100)} (${perf.audience
      }석)\n`;
    totalAmount += thisAmount;
  }

  result += `총액: ${format(totalAmount / 100)}`;
  result += `적립 포인트: ${volumeCredits}점`;
  return result;
}


console.log(statement(invoices[0], plays));