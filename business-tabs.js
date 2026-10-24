(() => {
  let selected = 'project';
  const navigation = document.createElement('nav');
  navigation.className = 'budget-tabs business-tabs';
  navigation.setAttribute('aria-label', 'Разделы данных бизнеса');
  document.querySelector('#inputs .page-heading').after(navigation);
  const groups = [['project','Проект'],['sales','Продажи'],['staff','Команда'],['marketing','Маркетинг'],['expenses','Расходы'],['assets','Инвестиции'],['tax','Налоги'],['working','Деньги'],['financial','Показатели']];
  navigation.innerHTML = groups.map(([key,label])=>`<button type="button" data-business-tab="${key}" aria-pressed="false">${label}</button>`).join('');
  const tools=document.querySelector('#inputs .model-tools');
  if(tools){const drawer=document.createElement('details');drawer.className='budget-file-tools';drawer.innerHTML='<summary>Управление моделью и поиск <span>＋</span></summary>';tools.before(drawer);drawer.append(tools);}
  function show(key){
    selected=key;
    form.querySelectorAll('[data-business-section]').forEach(section=>section.hidden=section.dataset.businessSection!==key);
    navigation.querySelectorAll('button').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.businessTab===key)));
  }
  function decorate(){
    const original=[...form.querySelectorAll(':scope > .input-section')];
    original.forEach((section,index)=>{const key=groups[index]?.[0];section.dataset.businessSection=section.id==='financial-inputs'?'financial':key;section.querySelector('h3').textContent=groups.find(([id])=>id===section.dataset.businessSection)?.[1]||'Показатели';});
    const working=document.createElement('section');working.className='input-section';working.dataset.businessSection='working';
    working.innerHTML='<h3>Оборотные средства</h3><div class="field-grid">'+['openingCash','funding','collectionDelay','paymentDelay'].map(key=>field(key)).join('')+'</div><p class="method-note">Остаток и взнос — до М1. Отсрочки сдвигают оплату и автоматически формируют задолженность клиентов и поставщиков.</p><h3>Кредит бизнеса</h3><div class="field-grid">'+['loan','loanRate','loanTerm'].map(key=>field(key)).join('')+'</div><p class="method-note">Кредит поступает до М1. Платежи, проценты и остаток долга рассчитываются автоматически. Отдельный калькулятор — в «Бюджет → Кредит».</p>';
    form.querySelector('#form-error').before(working);
    const expenses=form.querySelector('[data-business-section="expenses"]');
    const shortcuts=document.createElement('div');shortcuts.className='expense-shortcuts';shortcuts.innerHTML='<p class="method-note">Быстро добавить статью — затем укажите сумму или процент.</p>'+['Аренда','Эквайринг','Комиссия маркетплейса','Доставка','Сервисы и подписки','Связь и интернет','Бухгалтерия','Ремонт и обслуживание','Страхование'].map(name=>`<button type="button" class="add-item" data-expense-template="${name}">＋ ${name}</button>`).join('');
    expenses.querySelector('h3').after(shortcuts);
    const reset=form.querySelector('#reset');form.querySelector('[data-business-section="project"]').append(reset);
    show(selected);
  }
  const previousBuild=buildForm;
  buildForm=function(){previousBuild();decorate();};
  navigation.addEventListener('click',event=>{const button=event.target.closest('[data-business-tab]');if(button)show(button.dataset.businessTab);});
  form.addEventListener('click',event=>{
    const button=event.target.closest('[data-expense-template]');if(!button)return;
    if(!readForm())return;
    if(state.expenses.length>=50)return toast('Можно добавить до 50 статей в раздел');
    const name=button.dataset.expenseTemplate;
    state.expenses.push({...clone(templates.expenses),name,amount:0,type:['Эквайринг','Комиссия маркетплейса'].includes(name)?'percent':'fixed'});
    selected='expenses';buildForm();render();save();
    form.querySelector(`[data-path="expenses.${state.expenses.length-1}.amount"]`).focus();
  });
  // Keep validation errors reachable when fields live on separate tabs.
  const previousRead=readForm;
  readForm=function(...args){const ok=previousRead(...args);if(!ok){const error=form.querySelector('[aria-invalid="true"]');const section=error?.closest('[data-business-section]');if(section)show(section.dataset.businessSection);}return ok;};
  const search=document.getElementById('item-search');
  search?.addEventListener('input',()=>{if(!search.value.trim())return;const match=[...form.querySelectorAll('.editable-item')].find(card=>!card.hidden&&!(card.closest('#item-revenue')?.hidden));const section=match?.closest('[data-business-section]');if(section)show(section.dataset.businessSection);});
  decorate();
})();
