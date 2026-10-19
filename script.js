// Aparecer ao rolar
const io = new IntersectionObserver((es) => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .12 });
document.querySelectorAll('.card,.stats div,.steps li,.shot,.plan,.value div').forEach(el => { el.classList.add('reveal'); io.observe(el); });

// Formulário -> e-mail (via FormSubmit.co, sem cadastro e sem servidor)
// Troque pelo e-mail que vai RECEBER os cadastros dos pilotos.
const DESTINO_EMAIL = 'biancakalsing@gmail.com';

document.getElementById('pilotForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const form = e.target, msg = document.getElementById('msg'), btn = form.querySelector('button[type=submit]');
  const email = document.getElementById('email').value.trim();
  const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const show = (text, err) => { msg.className = 'msg mono' + (err ? ' err' : ''); msg.textContent = text; };

  if (!ok) return show('Informe um e-mail válido.', true);
  if (form.website.value) return; // campo-isca: bots preenchem, pessoas não
  if (!DESTINO_EMAIL.includes('@')) return show('Formulário ainda não conectado a um e-mail de destino.', true);

  btn.disabled = true; show('Enviando...', false);
  try {
    const res = await fetch('https://formsubmit.co/ajax/' + encodeURIComponent(DESTINO_EMAIL), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        Empresa: document.getElementById('company').value.trim(),
        Email: email,
        Plano: document.getElementById('plan').value,
        _subject: 'Novo piloto Priorion',
        _template: 'table',
        _captcha: 'false'
      })
    });
    if (!res.ok) throw new Error('falha no envio');
    show('Recebido! Entraremos em contato em breve.', false);
    form.reset();
    document.getElementById('plan').value = document.getElementById('rec').textContent;
  } catch (err) {
    show('Não foi possível enviar. Tente novamente em instantes.', true);
  } finally {
    btn.disabled = false;
  }
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
