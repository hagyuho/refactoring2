import invoices from "../invoices.js";
import plays from "../plays.js";

function statement(invoice, plays) {
  const statementData={};
  statementData.customer = invoice.customer; 
  statementData.performances = invoice.performances.map(enrichPerformance);

  return renderPlainText(statementData,plays)
}

function enrichPerformance(aPerformance){
  const result = Object.assign({},aPerformance); //<= 얕은복사 수행
  return result;
}

function renderPlainText(data,plays){  
  let result = `청구내역 (고객명: ${data.customer})\n`; 
  
  for (let perf of data.performances) { 
    result += `${playFor(perf).name}: ${usd(amountFor(perf))} (${
      perf.audience
    }석)\n`;
  }
  
  result += `총액: ${usd(totalAmount(data) / 100)}`; 
  result += `적립 포인트: ${totalVolumnCredits(data)}점`;  
  return result;
}




/************************************************************************************************/

function totalAmount(invoice){ 
  let result = 0;
  for (let perf of invoice.performances) {
    result += amountFor(perf); 
  }
  return result; 
}


function totalVolumnCredits(invoice){ 
  let result = 0; 
  for(let perf of invoice.performances){ 
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
