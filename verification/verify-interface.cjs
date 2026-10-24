const assert=require('node:assert/strict');
const {chromium}=require('C:/Users/Brocomp Gaming/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8765/');
 const baseline=await page.evaluate(()=>JSON.stringify(result));
 await page.locator('[data-panel=budget]').click();
 for(const width of [320,390,1360]){await page.setViewportSize({width,height:844});for(const tab of ['expense','income','accounts','plan','credit']){await page.locator(`[data-budget-view=${tab}]`).click();assert.equal(await page.evaluate(()=>document.body.scrollWidth),width);}}
 await page.setViewportSize({width:390,height:844});
 async function tx(type,amount,category){await page.locator(`[data-budget-view=${type}]`).click();await page.locator('.entry-drawer:has(#transaction-form)>summary').click();await page.locator('#transaction-form [name=amount]').fill(amount);await page.locator('#transaction-form [name=category]').fill(category);await page.locator('#transaction-submit').click();await page.waitForFunction(()=>!document.querySelector('#transaction-form').closest('details').open);}
 await tx('expense','3000','Продукты');await tx('income','10000','Зарплата');
 assert.match(await page.locator('.budget-ring strong').textContent(),/10\s000/);
 assert.equal(await page.locator('#budget-transactions tr:visible').count(),1);
 await page.locator('[data-budget-view=expense]').click();assert.match(await page.locator('.budget-ring strong').textContent(),/3\s000/);
 await page.locator('[data-transaction-edit]:visible').click();assert(await page.locator('#transaction-form').isVisible());
 await page.locator('#transaction-form [name=amount]').fill('3500');await page.locator('#transaction-submit').click();
 await page.waitForFunction(()=>document.querySelector('.budget-ring strong').textContent.includes('500'));
 await page.locator('[data-budget-view=credit]').click();assert(await page.locator('#loan-calculator').isVisible());assert(!(await page.locator('#account-form').isVisible()));
 await page.locator('#loan-rate').fill('18');await page.locator('#loan-rate').dispatchEvent('input');assert(Number(await page.locator('#loan-payment').inputValue())>0);
 assert.equal(await page.evaluate(()=>JSON.stringify(result)),baseline);
 await page.reload();await page.locator('[data-panel=budget]').click();assert.match(await page.locator('.budget-ring strong').textContent(),/3\s500/);
 await page.screenshot({path:'verification/interface-budget.png'});
 for(const tab of ['overview','inputs','calculations','budget']){await page.locator(`[data-panel=${tab}]`).click();assert(await page.locator(`#${tab}`).isVisible());assert.equal(await page.locator('.panel-dock .active').getAttribute('data-panel'),tab);}
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS: tabs, mobile widths, transaction create/edit/filter/persistence, calculator, unchanged business results');
})().catch(e=>{console.error(e);process.exit(1)});
