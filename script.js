const dialog = document.getElementById('contact-dialog');
const contact = window.YUGAN_CONTACT || {};
const safeUrl = value => { try { const u = new URL(value, location.href); return ['https:', 'http:'].includes(u.protocol) && Boolean(value) ? u.href : ''; } catch { return ''; } };
const addUrl = safeUrl(contact.url);
const qrUrl = safeUrl(contact.qrImage);
if (addUrl || qrUrl) {
  document.getElementById('contact-unavailable').hidden = true;
  document.getElementById('contact-ready').hidden = false;
  const link = document.getElementById('contact-link');
  link.hidden = !addUrl; if (addUrl) link.href = addUrl;
  const qr = document.getElementById('contact-qr');
  qr.hidden = !qrUrl; if (qrUrl) qr.src = qrUrl;
}
const planNames = { '求职全套服务 · 299元': '全套服务 · 299元', '4份简历服务 · 128元': '4份简历 · 128元', '单份简历服务 · 49元': '单份简历 · 49元' };
let selectedPlan = '';
try { const cached = sessionStorage.getItem('yugan-selected-plan'); if (planNames[cached]) selectedPlan = cached; } catch {}
function updatePlan() {
 const selected = document.getElementById('selected-plan');
 selected.hidden = !selectedPlan;
 selected.textContent = selectedPlan ? `你选择的是：${selectedPlan}` : '';
 document.getElementById('copy-consultation').hidden = !selectedPlan;
 document.getElementById('sticky-plan').textContent = selectedPlan ? planNames[selectedPlan] : '想了解哪一档服务？';
 document.getElementById('sticky-detail').textContent = selectedPlan ? '继续咨询这档服务' : '全套299元 · 简历128元 · 单份49元';
 document.getElementById('copy-feedback').textContent = '';
}
updatePlan();
document.querySelectorAll('[data-contact]').forEach(button => button.addEventListener('click', () => {
 if (button.dataset.plan) {
  selectedPlan = button.dataset.plan;
  try { sessionStorage.setItem('yugan-selected-plan', selectedPlan); } catch {}
 }
 updatePlan(); dialog.showModal();
}));
document.getElementById('copy-consultation').addEventListener('click', async () => {
 const text = `我想了解${selectedPlan}。\n我的专业或工作背景：\n意向城市与岗位方向：\n目前想解决的问题：`;
 const feedback = document.getElementById('copy-feedback');
 try {
  if (!navigator.clipboard || !window.isSecureContext) throw new Error('clipboard unavailable');
  await navigator.clipboard.writeText(text);
  feedback.textContent = '已复制，添加企业微信后可粘贴补充。';
 } catch {
  feedback.textContent = '可长按下方文字复制：';
  const content = document.createElement('span'); content.className = 'copy-fallback'; content.textContent = text;
  feedback.appendChild(content);
 }
});
document.querySelector('.close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target !== dialog) return; const r = dialog.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close(); });
const tabs = [...document.querySelectorAll('[data-tab]')];
function selectTab(tab, focus = false) {
  tabs.forEach(item => { const selected = item === tab; item.setAttribute('aria-selected', String(selected)); item.tabIndex = selected ? 0 : -1; document.getElementById(`panel-${item.dataset.tab}`).hidden = !selected; });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => selectTab(tab));
  tab.addEventListener('keydown', event => { let next; if (event.key === 'ArrowRight') next = (index + 1) % tabs.length; if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length; if (event.key === 'Home') next = 0; if (event.key === 'End') next = tabs.length - 1; if (next !== undefined) { event.preventDefault(); selectTab(tabs[next], true); } });
});


const sampleData = {"resume-1": {"title": "工程造价 · 简历", "pages": ["resume-1-1.webp"], "pdf": "resume-1.pdf", "start": 0}, "resume-2": {"title": "测试工程师 · 简历", "pages": ["resume-2-1.webp"], "pdf": "resume-2.pdf", "start": 0}, "resume-3": {"title": "电气工程师 · 简历", "pages": ["resume-3-1.webp"], "pdf": "resume-3.pdf", "start": 0}, "jobs-1": {"title": "测试工程师 · 岗位筛选报告", "pages": ["jobs-1-1.webp", "jobs-1-2.webp", "jobs-1-3.webp", "jobs-1-4.webp", "jobs-1-5.webp", "jobs-1-6.webp", "jobs-1-7.webp", "jobs-1-8.webp"], "pdf": "jobs-1.pdf", "start": 1}, "jobs-2": {"title": "工程造价 · 岗位筛选报告", "pages": ["jobs-2-1.webp", "jobs-2-2.webp", "jobs-2-3.webp", "jobs-2-4.webp", "jobs-2-5.webp", "jobs-2-6.webp", "jobs-2-7.webp", "jobs-2-8.webp"], "pdf": "jobs-2.pdf", "start": 1}, "jobs-3": {"title": "文职类 · 岗位筛选报告", "pages": ["jobs-3-1.webp", "jobs-3-2.webp", "jobs-3-3.webp", "jobs-3-4.webp", "jobs-3-5.webp", "jobs-3-6.webp", "jobs-3-7.webp", "jobs-3-8.webp"], "pdf": "jobs-3.pdf", "start": 1}};
const sampleDialog = document.getElementById('sample-dialog');
let activeSample, samplePage = 0;
function renderSample() {
 const src = activeSample.pages[samplePage];
 document.getElementById('sample-title').textContent = activeSample.title;
 const img = document.getElementById('sample-image'); img.src = src; img.alt = `${activeSample.title} 第${samplePage + 1}页`;
 document.getElementById('sample-page').textContent = `${samplePage + 1} / ${activeSample.pages.length}`;
 document.getElementById('sample-prev').disabled = samplePage === 0;
 document.getElementById('sample-next').disabled = samplePage === activeSample.pages.length - 1;
 document.getElementById('sample-original').href = src;
 document.getElementById('sample-pdf').href = activeSample.pdf;
 document.querySelector('.sample-viewer-scroll').scrollTop = 0;
}
document.querySelectorAll('[data-sample]').forEach(button => button.addEventListener('click', () => {
 activeSample = sampleData[button.dataset.sample]; samplePage = activeSample.start; renderSample(); sampleDialog.showModal();
}));
document.getElementById('sample-prev').addEventListener('click', () => { if (samplePage > 0) { samplePage--; renderSample(); } });
document.getElementById('sample-next').addEventListener('click', () => { if (samplePage < activeSample.pages.length - 1) { samplePage++; renderSample(); } });
document.getElementById('sample-close').addEventListener('click', () => sampleDialog.close());
sampleDialog.addEventListener('click', event => { if(event.target !== sampleDialog) return; const r = sampleDialog.getBoundingClientRect(); if(event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) sampleDialog.close(); });
sampleDialog.addEventListener('keydown', event => { if(event.key === 'ArrowLeft' && samplePage > 0) { samplePage--; renderSample(); } if(event.key === 'ArrowRight' && samplePage < activeSample.pages.length - 1) { samplePage++; renderSample(); } });
