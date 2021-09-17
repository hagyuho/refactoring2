import invoices from "../invoices.js";
import plays from "../plays.js";
import createStatementData from "./createStatementData.js"

console.log(htmlStatement(invoices[0], plays));
console.log(renderHtmlStatement(invoices[0], plays));

function htmlStatement(invoice, plays) {
  return renderPlainText(createStatementData(invoice,plays)); 
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



function renderHtmlStatement(invoice, plays) {
  return renderHtml(createStatementData(invoice,plays)); 
}


function renderHtml(data) {
  let result = `<h1>청구내역 (고객명: ${data.customer})</h1>\n`;
  result +="<table>\n";
  result +="<tr><th>연극</th><th>좌석수</th><th>금액</th>"

  for (let perf of data.performances) {
    result += ` <tr><td>${perf.play.name}</td><td>(${perf.audience}석)</td>)`;
    result += `<td>${usd(perf.amount)}<td></tr>\n`;
  }
  result +="</table>\n";
  result += `<p>총액: <em>${usd(data.totalAmount)}</em></p>\n`;
  result += `<p>적립 포인트: <em>${data.totalVolumnCredits}</em>점</p>\n`;
  return result;
}


function usd(aNumber) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(aNumber / 100);
}