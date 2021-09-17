import invoices from "../invoices.js";
import plays from "../plays.js";

function statement(invoice, plays) {
  return renderPlainText(createStatementData(invoice,plays)); //<= 추출한 함수 인라인으로 전달
}

function createStatementData(invoice,plays){ //<=중간데이터 생성을 전담
  const statementData = {};
  statementData.customer = invoice.customer;
  statementData.performances = invoice.performances.map(enrichPerformance);
  statementData.totalAmount = totalAmount(statementData);
  statementData.totalVolumnCredits = totalVolumnCredits(statementData);
  return statementData;
}


function renderPlainText(data) {
  let result = `청구내역 (고객명: ${data.customer})\n`;
  
  for (let perf of data.performances) {
    result += `${perf.play.name}: ${usd(perf.amount)} (${perf.audience}석)\n`;
  }
  
  result += `총액: ${usd(data.totalAmount)}`;
  result += `적립 포인트: ${data.totalVolumnCredits}점`;
  return result;
}

function enrichPerformance(aPerformance) {
  const result = Object.assign({}, aPerformance);
  result.play = playFor(result);
  result.amount = amountFor(result);
  result.volumnCredits = volumeCreditsFor(result);
  return result;
}

/************************************************************************************************/

function totalAmount(data) {
  return data.performances.reduce((total, p) => total + p.amount,0); //<= for 반복문을 파이프라인으로 바꿈
}

function totalVolumnCredits(data) {
  return data.performances.reduce((total,p)=> total + p.volumnCredits, 0); //<= for 반복문을 파이프라인으로 바꿈
}

function playFor(aPerformance) {
  return plays[aPerformance.playID];
}


function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}

function amountFor(aPerformance) {
  let result = 0;
  switch (aPerformance.play.type) {
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

function volumeCreditsFor(perf) {
  let result = 0;
  result += Math.max(perf.audience - 30, 0);
  if ("comedy" === perf.play.type) result += Math.floor(perf.audience / 5);
  return result;
}
console.log(statement(invoices[0], plays));
