

class PerformanceCalculator {
  constructor(aPerformance, aplay) {
    this.performance = aPerformance;
    this.play = aplay;
  }

  get amount() { 
    let result = 0;
    switch (this.play.type) { 
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) { 
          result += 1000 * (this.performance.audience - 30); 
        }
        break;

      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) {
          result += 10000 + 500 * (this.performance.audience - 20); 
        }
        result += 300 * this.performance.audience;
        break;

      default:
        throw new Error(`알 수 없는 장르 : ${this.performance.play.type}`);
    }
    return result;
  }
  
  get volumeCredits(){ 
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0); 
    if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5); 
    return result;
  }

}

function createPerformanceCalculator(aPerformance, aplay){
  switch(aplay.type){
    case "tragedy": return new TragedyCalculaotr(aPerformance,aplay);
    case "comedy": return new ComedyCalculaotr(aPerformance,aplay);
    default :
      throw new Error('알 수 없는 장르: ${aPlay.type}')
  }
}

class TragedyCalculaotr extends PerformanceCalculator{

}

class ComedyCalculaotr extends PerformanceCalculator{

}
//////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

export default function createStatementData(invoice, plays) {
  const result = {};
  result.customer = invoice.customer;
  result.performances = invoice.performances.map(enrichPerformance);
  result.totalAmount = totalAmount(result);
  result.totalVolumnCredits = totalVolumnCredits(result);
  return result;

  function enrichPerformance(aPerformance) {
    const calculator = new createPerformanceCalculator(aPerformance, playFor(aPerformance)); //<= 생성자 대신 팩터리 함수 이용
    const result = Object.assign({}, aPerformance);
    result.play = calculator.play;
    result.amount = calculator.amount;
    result.volumnCredits = calculator.volumeCredits;
    return result;
  }

  function totalAmount(data) {
    return data.performances.reduce((total, p) => total + p.amount, 0);
  }

  function totalVolumnCredits(data) {
    return data.performances.reduce((total, p) => total + p.volumnCredits, 0);
  }

  function playFor(aPerformance) {
    return plays[aPerformance.playID];
  }

}


