import invoices from "./invoices.js";
import plays from "./plays.js";

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
    volumeCredits += volumeCreditsFor(perf); //<=추출한 함수를 이용해 값을 누적

    result += `${playFor(perf).name}: ${format(amountFor(perf) / 100)} (${
      perf.audience
    }석)\n`;
    totalAmount += amountFor(perf);
  }

  result += `총액: ${format(totalAmount / 100)}`;
  result += `적립 포인트: ${volumeCredits}점`;
  return result;
}

function volumeCreditsFor(perf) {
  // <= 반복문 내 함수 추출
  let result = 0;
  result += Math.max(perf.audience - 30, 0);
  if ("comedy" === playFor(perf).type) result += Math.floor(perf.audience / 5);
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function amountFor(aPerformance) { // <= 필요없어진 매개변수 제거

  let result = 0;
  switch (
    playFor(aPerformance).type //<= play를 playFor() 호출로 변경
  ) {
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
      throw new Error(`알 수 없는 장르 : ${playFor(aPerformance).type}`); //<= play를 playFor() 호출로 변경
  }

  return result;
}

console.log(statement(invoices[0], plays));
