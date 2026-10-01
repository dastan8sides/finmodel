(function(root){
  const defaults={name:'Мой бизнес',currency:'KZT',units:300,price:8500,growth:4,variable:35,fixed:1100000,tax:10,investment:3000000};
  const cases={base:{label:'Базовый',factor:1,note:'Ваши исходные данные без изменений'},low:{label:'Осторожный',factor:.8,note:'Продажи −20% к базе · остальные вводные те же'},high:{label:'Оптимистичный',factor:1.2,note:'Продажи +20% к базе · остальные вводные те же'}};
  function calculate(p,scenario='base'){
    const factor=cases[scenario].factor;let cash=-p.investment;const months=[];
    for(let i=0;i<12;i++){const units=p.units*factor*Math.pow(1+p.growth/100,i),revenue=units*p.price,variable=revenue*p.variable/100,fixed=p.fixed,pretax=revenue-variable-fixed,tax=Math.max(0,pretax)*(p.tax/100),profit=pretax-tax;cash+=profit;months.push({month:i+1,units,revenue,variable,fixed,pretax,tax,profit,costs:variable+fixed+tax,cash});}
    const sum=k=>months.reduce((s,m)=>s+m[k],0),revenue=sum('revenue'),profit=sum('profit');
    return {months,revenue,profit,costs:sum('costs'),cash,margin:revenue?profit/revenue:null,breakEven:p.variable<100?p.fixed/(1-p.variable/100):(p.fixed===0?0:null),payback:p.investment===0?0:(months.find(m=>m.cash>=0)?.month??null)};
  }
  const api={defaults,cases,calculate};root.FinModel=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);

