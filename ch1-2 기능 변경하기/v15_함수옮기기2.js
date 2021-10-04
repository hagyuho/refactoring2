import invoices from "../invoices.js";
import plays from "../plays.js";

function statement(invoice, plays) {
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);

  return renderPlainText(statementData, plays)
}

function enrichPerformance(aPerformance) {
  const result = Object.assign({}, aPerformance);
  result.play = playFor(result);  
  result.amount = amountFor(result); //<= 중간데이터에 가격정보를 저장
  return result;
}

function renderPlainText(data, plays) {
  let result = `청구내역 (고객명: ${data.customer})\n`;
  
  for (let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} (${ //<= amountFor 사용하던 부분을 중간데이터를 사용하도록 바꿈
      perf.audience
    }석)\n`;
  }
  
  result += `총액: ${usd(totalAmount(data) / 100)}`;
  result += `적립 포인트: ${totalVolumnCredits(data)}점`;
  return result;
}

function amountFor(aPerformance) {
  let result = 0;
  switch (aPerformance.play.type) { //<= playFor 사용하던 부분을 중간데이터를 사용하도록 바꿈
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
      throw new Error(`알 수 없는 장르 : ${aPerformance.play.type}`); 
  }

  return result;
}






/************************************************************************************************/

function totalAmount(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    result += perf.amount; //<= amountFor 사용하던 부분을 중간데이터를 사용하도록 바꿈
  }
  return result;
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}

function totalVolumnCredits(invoice) {
  let result = 0;
  for (let perf of invoice.performances) {
    result += volumeCreditsFor(perf);
  }
  return result;
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
  if ("comedy" === perf.play.type) result += Math.floor(perf.audience / 5); 
  return result;
}


console.log(statement(invoices[0], plays));
