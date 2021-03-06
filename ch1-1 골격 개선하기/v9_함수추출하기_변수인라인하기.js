import invoices from "../invoices.js";
import plays from "../plays.js";

function statement(invoice, plays) {
  let totalAmount = 0;
  let result = `청구내역 (고객명: ${invoice.customer})\n`;

  for (let perf of invoice.performances) {
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    }석)\n`;
    totalAmount += amountFor(perf);
  }
  result += `총액: ${usd(totalAmount / 100)}`; 
  result += `적립 포인트: ${totalVolumnCredits(invoice)}점`; // <= 변수 인라인하기
  return result;
}

function totalVolumnCredits(invoice){ // <= 임시 변수를 질의 함수로 바꾸기
  let result = 0; //<= 변수명 변경하기
  for(let perf of invoice.performances){ 
    result += volumeCreditsFor(perf); //<= 변수명 변경하기
  }
  return result; //<= 변수명 변경하기
}

function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100); 
}

function volumeCreditsFor(perf) {
  let result = 0;
  result += Math.max(perf.audience - 30, 0);
  if ("comedy" === playFor(perf).type) result += Math.floor(perf.audience / 5);
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function amountFor(aPerformance) {
  let result = 0;
  switch (playFor(aPerformance).type) {
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
      throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`); 
  }

  return result;
}

console.log(statement(invoices[0], plays));
