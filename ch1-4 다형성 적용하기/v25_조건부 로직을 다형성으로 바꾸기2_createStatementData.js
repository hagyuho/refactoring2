
class PerformanceCalculator {
  constructor(aPerformance, aplay) {
    this.performance = aPerformance;
    this.play = aplay;
  }

  get amount() {
    throw new Error('서브클래스에서 처리하도록 설계되었습니다.')
  }

  get volumeCredits() { //<= 일반적인 경우 기본으로 슈퍼클래스에 남겨두기
    return Math.max(this.performance.audience - 30, 0);
  }

}

class TragedyCalculaotr extends PerformanceCalculator { //<= 비극 계산기 클래스 로직 뽑기
  get amount() {
    let result = 40000;
    if (this.performance.audience > 30) {
      result += 1000 * (this.performance.audience - 30);
    }
    return result;
  }
}

class ComedyCalculaotr extends PerformanceCalculator { //<= 희극 계산기 클래스 로직 뽑기
  get amount() {
    let result = 30000;
    if (this.performance.audience > 20) {
      result += 10000 + 500 * (this.performance.audience - 20);
    }
    result += 300 * this.performance.audience;
    return result;
  }
  get volumeCredits(){ //<= 희극 처리 로직 서브클래스로 내리기
    return super.volumeCredits + Math.floor(this.performance.audience / 5); 
  }
}

function createPerformanceCalculator(aPerformance, aplay) {
  switch (aplay.type) {
    case "tragedy": return new TragedyCalculaotr(aPerformance, aplay);
    case "comedy": return new ComedyCalculaotr(aPerformance, aplay);
    default:
      throw new Error(`알 수 없는 장르: ${aPlay.type}`)
  }
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
    const calculator = createPerformanceCalculator(aPerformance, playFor(aPerformance)); 
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


