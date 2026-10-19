// Aparecer ao rolar
const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.card,.stats div,.steps li,.shot,.plan,.value div').forEach(el => { el.classList.add('reveal'); io.observe(el); });

// Formulário -> e-mail (FormSubmit, envio direto pelo formulário, sem fetch)
const pilotForm = document.getElementById('pilotForm'), msg = document.getElementById('msg');
const show = (text, err) => { msg.className = 'msg mono' + (err ? ' err' : ''); msg.textContent = text; };

// Depois do envio, o FormSubmit devolve a pessoa para esta mesma página
pilotForm.elements['_next'].value = location.href.split(/[?#]/)[0] + '?enviado=1#piloto';
if (new URLSearchParams(location.search).get('enviado')) show('Recebido! Entraremos em contato em breve.', false);

pilotForm.addEventListener('submit', (e) => {
  const email = document.getElementById('email').value.trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { e.preventDefault(); return show('Informe um e-mail válido.', true); }
  show('Enviando...', false);
});

// Botões dos planos pré-selecionam o plano no formulário
document.querySelectorAll('[data-plan]').forEach(a => a.addEventListener('click', () => {
  document.getElementById('plan').value = a.dataset.plan;
}));

// Seletor: indica o plano conforme o volume mensal de demandas
const vol = document.getElementById('vol'), volOut = document.getElementById('volOut'), rec = document.getElementById('rec');
function setPlan() {
  const v = +vol.value, p = v <= 60 ? 'starter' : v <= 200 ? 'pro' : 'business';
  volOut.textContent = v;
  rec.textContent = p[0].toUpperCase() + p.slice(1);
  ['starter', 'pro', 'business'].forEach(x => document.getElementById('p-' + x).classList.toggle('on', x === p));
  document.getElementById('plan').value = rec.textContent;
}
vol.addEventListener('input', setPlan);
setPlan();

// Ampliar print ao clicar
const lb = document.createElement('div'); lb.className = 'lightbox';
lb.innerHTML = '<img alt="">'; document.body.appendChild(lb);
document.querySelectorAll('.shot img').forEach(im => im.addEventListener('click', () => {
  lb.firstChild.src = im.src; lb.firstChild.alt = im.alt; lb.classList.add('on');
}));
lb.addEventListener('click', () => lb.classList.remove('on'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') lb.classList.remove('on'); });