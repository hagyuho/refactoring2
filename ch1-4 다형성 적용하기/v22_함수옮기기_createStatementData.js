
class PerformanceCalculator {
  constructor(aPerformance, aplay) {
    this.performance = aPerformance;
    this.play = aplay;
  }

  get amount() { //<= amountFor() 함수의 코드를 계산기 클래스로 복사
    let result = 0;
    switch (this.play.type) { //<= amountFor함수가 매개변수로 받던 정보를 계산기 필드에서 바로 얻음
      case "tragedy":
        result = 40000;
        if (this.performance.audience > 30) { //<=  계산기 필드에서 바로 얻음
          result += 1000 * (this.performance.audience - 30); //<=  계산기 필드에서 바로 얻음
        }
        break;

      case "comedy":
        result = 30000;
        if (this.performance.audience > 20) { //<=  계산기 필드에서 바로 얻음
          result += 10000 + 500 * (this.performance.audience - 20); //<=  계산기 필드에서 바로 얻음
        }
        result += 300 * this.performance.audience; //<=  계산기 필드에서 바로 얻음
        break;

      default:
        throw new Error(`알 수 없는 장르 : ${this.performance.play.type}`); //<=  계산기 필드에서 바로 얻음
    }
    return result;
  }

  get volumeCredits(){  //<= volumeCreditsFor() 함수의 코드를 계산기 클래스로 복사
    let result = 0;
    result += Math.max(this.performance.audience - 30, 0); //<= 계산기 필드에서 바로 얻음
    if ("comedy" === this.play.type) result += Math.floor(this.performance.audience / 5); //<= 계산기 필드에서 바로 얻음
    return result;
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

  // function amountFor(aPerformance) {
  // }

  // function volumeCreditsFor(perf) {
  // }

  function enrichPerformance(aPerformance) {
    const calculator = new PerformanceCalculator(aPerformance, playFor(aPerformance)); //<=공연정보를 계산기로 전달
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


