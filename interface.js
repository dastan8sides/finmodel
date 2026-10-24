/* Presentation only: existing forms, storage and financial calculations stay intact. */
(() => {
  const page = document.getElementById('budget');
  const transaction = document.getElementById('transaction-form');
  const accounts = document.getElementById('account-form').closest('section');
  const operations = transaction.closest('section');
  const plan = document.getElementById('plan-form').closest('section');
  const credit = document.getElementById('loan-calculator');
  let selected = 'expense';
  const tabs = document.createElement('nav');
  tabs.className = 'budget-tabs'; tabs.setAttribute('aria-label', 'Разделы бюджета');
  tabs.innerHTML = [['expense','Расходы'],['income','Доходы'],['accounts','Счета'],['plan','План'],['credit','Кредит']].map(([id,label]) => `<button type="button" data-budget-view="${id}" aria-pressed="false">${label}</button>`).join('');
  page.querySelector('.page-heading').after(tabs);
  const ring = document.createElement('div'); ring.className = 'budget-ring';
  ring.innerHTML = '<span></span><strong></strong><small></small>';
  document.getElementById('budget-summary').after(ring);
  const totals = document.createElement('details'); totals.className = 'budget-file-tools budget-totals';
  totals.innerHTML = '<summary>Итоги месяца <span>＋</span></summary>';
  ring.after(totals); totals.append(document.getElementById('budget-summary'));
  const tools = document.createElement('details'); tools.className = 'budget-file-tools';
  tools.innerHTML = '<summary>Управление бюджетом <span>＋</span></summary>';
  const buttons = page.querySelector('.tool-buttons'); buttons.before(tools); tools.append(buttons);
  const forms = new Map();
  for (const [id, title] of [['account-form','Добавить счёт'],['transaction-form','Добавить расход'],['plan-form','Добавить план']]) {
    const form = document.getElementById(id), box = document.createElement('details');
    box.className = 'entry-drawer'; box.innerHTML = `<summary><span>＋</span> <b>${title}</b></summary>`;
    form.before(box); box.append(form); forms.set(id,box);
    form.addEventListener('submit', () => { setTimeout(() => {
      // A successful existing handler resets the form. Invalid entries stay open.
      const field = form.elements[id==='account-form'?'name':'amount'];
      if (!field.value) box.open = false;
      if (id === 'transaction-form') setTransactionMode();
    },0); });
  }
  function setTransactionMode() {
    transaction.elements.type.value = selected==='accounts'?'transfer':selected==='income'?'income':'expense';
    transaction.elements.type.dispatchEvent(new Event('change',{bubbles:true}));
  }
  const empty = document.createElement('p'); empty.className = 'budget-empty';
  document.getElementById('budget-search').closest('label').after(empty);
  function refresh() {
    const values = [...document.querySelectorAll('#budget-summary .calc-line strong')].map(el=>el.textContent);
    const index = {expense:1,income:0,accounts:5,plan:3}[selected];
    ring.hidden = selected === 'credit';
    ring.querySelector('span').textContent = {expense:'Потрачено',income:'Получено',accounts:'На счетах',plan:'Запланировано'}[selected] || '';
    ring.querySelector('strong').textContent = values[index] || '0';
    ring.querySelector('small').textContent = selected==='accounts'?'Сейчас':document.getElementById('budget-month').value.split('-').reverse().join(' / ');
    let visible = 0;
    for (const row of document.querySelectorAll('#budget-transactions tr')) {
      const value = row.cells[2]?.textContent || '';
      const type = value.startsWith('−')?'expense':value.startsWith('+')?'income':'accounts';
      row.hidden = !row.cells[2] || type !== selected;
      if (!row.hidden) visible++;
    }
    empty.hidden = !!visible;
    empty.textContent = document.getElementById('budget-search').value ? 'Ничего не найдено' : {expense:'Расходов за этот месяц пока нет',income:'Доходов за этот месяц пока нет',accounts:'Переводов за этот месяц пока нет'}[selected] || '';
    operations.querySelector('.table-scroll').hidden = !visible;
  }
  function show(id) {
    selected = id;
    for(const button of tabs.querySelectorAll('button')) button.setAttribute('aria-pressed',String(button.dataset.budgetView===id));
    accounts.hidden = id!=='accounts';
    operations.hidden = !['expense','income','accounts'].includes(id);
    plan.hidden = id!=='plan'; credit.hidden = id!=='credit';
    operations.querySelector('h3').textContent = id==='accounts'?'Переводы':id==='income'?'Доходы':'Расходы';
    forms.get('transaction-form').querySelector('b').textContent = id==='accounts'?'Добавить перевод':id==='income'?'Добавить доход':'Добавить расход';
    for(const box of forms.values()) box.open=false;
    setTransactionMode(); refresh();
  }
  tabs.addEventListener('click', e => {const b=e.target.closest('[data-budget-view]');if(b)show(b.dataset.budgetView);});
  page.addEventListener('click', e => {
    const button=e.target.closest('button'); if(!button)return;
    for(const [kind,id] of [['account','account-form'],['transaction','transaction-form'],['plan','plan-form']]) {
      if(button.hasAttribute(`data-${kind}-edit`)) forms.get(id).open=true;
    }
  },true);
  new MutationObserver(refresh).observe(document.getElementById('budget-summary'),{childList:true});
  new MutationObserver(refresh).observe(document.getElementById('budget-transactions'),{childList:true});
  document.getElementById('budget-undo').addEventListener('click',()=>setTimeout(setTransactionMode,0));
  show('expense');
})();
