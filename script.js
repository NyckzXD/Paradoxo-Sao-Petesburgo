"use strict";

/* ============ util ============ */
const BRL = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
const $ = id => document.getElementById(id);

/* ============ tabs ============ */
document.querySelectorAll('.tab').forEach(t => {
  t.addEventListener('click', () => {
    document.querySelectorAll('.tab').forEach(x => x.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    t.classList.add('active');
    $(t.dataset.view).classList.add('active');
  });
});

/* =====================================================================
   MODO JOGAR (rodada a rodada)
   ===================================================================== */
const PRICE_GAME = 50;
const START_BALANCE = 1000;
let state;

function newState() {
  return { saldo: START_BALANCE, rodadas: 0, totApostado: 0, totGanho: 0, banca: 0, inRound: false, spinning: false, rot: 0 };
}

function renderGameStats() {
  $('saldo').textContent = BRL(state.saldo);
  $('rodadas').textContent = state.rodadas;
  $('totApostado').textContent = BRL(state.totApostado);
  const lucro = state.totGanho - state.totApostado;
  const el = $('lucro');
  el.textContent = (lucro >= 0 ? '+' : '') + BRL(lucro);
  el.className = 'value ' + (lucro > 0 ? 'green' : lucro < 0 ? 'red' : '');
  $('banca').textContent = state.inRound ? BRL(state.banca) : '—';
}

function setStatus(msg, kind) { const s = $('status'); s.textContent = msg; s.className = 'status-msg ' + (kind || 'info'); }

function spinCoin(isCara) {
  // rotação acumulada: sempre múltiplos de 360 -> mostra CARA (frente). +180 -> COROA (verso)
  state.rot += 360 * 4;
  const target = state.rot + (isCara ? 0 : 180);
  $('coin').style.transform = `rotateY(${target}deg)`;
}

function startRound() {
  if (state.inRound || state.spinning) return;
  if (state.saldo < PRICE_GAME) { setStatus('Saldo insuficiente. Reinicie para jogar de novo.', 'lose'); return; }
  state.saldo -= PRICE_GAME;
  state.totApostado += PRICE_GAME;
  state.rodadas += 1;
  state.banca = 1;             // prêmio começa em R$ 1
  state.inRound = true;
  $('btnBet').disabled = true;
  $('btnFlip').disabled = false;
  setStatus('Rodada iniciada. Banca em R$ 1,00 — gire a moeda.', 'info');
  renderGameStats();
}

function flip() {
  if (!state.inRound || state.spinning) return;
  state.spinning = true;
  $('btnFlip').disabled = true;

  const isCara = Math.random() < 0.5;
  spinCoin(isCara);

  setTimeout(() => {
    state.spinning = false;
    if (isCara) {
      state.banca *= 2;         // dobra a cada cara
      setStatus(`Cara. Prêmio dobrou para ${BRL(state.banca)} — gire de novo.`, 'win');
      $('btnFlip').disabled = false;
    } else {
      // COROA: rodada acaba, jogador leva a banca
      const ganho = state.banca;
      state.saldo += ganho;
      state.totGanho += ganho;
      const net = ganho - PRICE_GAME;
      setStatus(`Coroa. Rodada encerrada — você levou ${BRL(ganho)} (líquido ${net >= 0 ? '+' : ''}${BRL(net)}).`, net >= 0 ? 'win' : 'lose');
      addLog(state.rodadas, ganho, net);
      state.inRound = false;
      state.banca = 0;
      $('btnBet').disabled = state.saldo < PRICE_GAME;
      if (state.saldo < PRICE_GAME) setStatus('Saldo esgotado. Clique em Reiniciar.', 'lose');
    }
    renderGameStats();
  }, 1050);

  renderGameStats();
}

function addLog(n, ganho, net) {
  const div = document.createElement('div');
  div.className = 'log-item';
  div.innerHTML = `<span>Rodada ${n} — prêmio ${BRL(ganho)}</span>
                   <span class="net ${net >= 0 ? 'pos' : 'neg'}">${net >= 0 ? '+' : ''}${BRL(net)}</span>`;
  const list = $('logList');
  list.insertBefore(div, list.firstChild);
}

function resetGame() {
  state = newState();
  $('logList').innerHTML = '';
  $('btnBet').disabled = false;
  $('btnFlip').disabled = true;
  $('coin').style.transform = 'rotateY(0deg)';
  setStatus('Pague R$ 50,00 para começar uma rodada.', 'info');
  renderGameStats();
}

$('btnBet').addEventListener('click', startRound);
$('btnFlip').addEventListener('click', flip);
$('btnReset').addEventListener('click', resetGame);
resetGame();

/* =====================================================================
   MODO SIMULAR
   ===================================================================== */

// joga UMA rodada: retorna o nº de caras (prêmio = 2^caras)
function playOne() {
  let heads = 0;
  while (Math.random() < 0.5) heads++;
  return heads;
}

function runSimulation() {
  const N = Math.max(1, Math.floor(+$('numGames').value || 0));
  const price = Math.max(0, +$('price').value || 0);

  let totalPrize = 0;
  let maxHeads = 0;
  let profitable = 0;                 // rodadas com prêmio > preço
  const headCount = {};               // histograma por nº de caras

  // pontos para o gráfico de média acumulada (amostrados em escala log)
  const samples = [];
  let nextSample = 1;

  for (let i = 1; i <= N; i++) {
    const h = playOne();
    const prize = Math.pow(2, h);
    totalPrize += prize;
    if (h > maxHeads) maxHeads = h;
    if (prize > price) profitable++;
    headCount[h] = (headCount[h] || 0) + 1;

    if (i === nextSample || i === N) {
      samples.push({ n: i, avg: totalPrize / i });
      nextSample = Math.ceil(nextSample * 1.35) + 1;
    }
  }

  const cost = N * price;
  const net = totalPrize - cost;
  const avg = totalPrize / N;

  // ---- cards ----
  $('rCost').textContent = BRL(cost);
  $('rWon').textContent = BRL(totalPrize);
  const netEl = $('rNet');
  netEl.textContent = (net >= 0 ? '+' : '') + BRL(net);
  netEl.style.color = net >= 0 ? 'var(--celadon)' : 'var(--rust)';
  $('rAvg').textContent = BRL(avg);
  $('rMax').textContent = BRL(Math.pow(2, maxHeads)) + ` (${maxHeads} caras)`;
  $('rProfit').textContent = (100 * profitable / N).toFixed(2) + '%';

  // ---- veredito ----
  const v = $('verdict');
  if (net >= 0) {
    v.className = 'verdict good';
    v.innerHTML = `Em ${N.toLocaleString('pt-BR')} jogadas você teve <b>lucro</b> de ${BRL(net)} — o prêmio médio (${BRL(avg)}) superou o preço (${BRL(price)}). Rode de novo: dificilmente se repete.`;
  } else {
    v.className = 'verdict bad';
    v.innerHTML = `Em ${N.toLocaleString('pt-BR')} jogadas você <b>perdeu</b> ${BRL(-net)}. O prêmio médio foi ${BRL(avg)}, abaixo do preço de ${BRL(price)}.`;
  }

  // ---- tabela de distribuição ----
  buildDistTable(headCount, N);

  // ---- gráfico ----
  drawChart(samples, price);

  $('results').classList.add('show');
}

function buildDistTable(headCount, N) {
  const keys = Object.keys(headCount).map(Number).sort((a, b) => a - b);
  const maxCount = Math.max(...keys.map(k => headCount[k]));
  let html = `<tr><th>Resultado</th><th>Prêmio</th><th>Frequência</th><th>%</th><th>Teórico %</th></tr>`;
  for (const k of keys) {
    const c = headCount[k];
    const pct = 100 * c / N;
    const theo = 100 * Math.pow(0.5, k + 1);
    const w = (100 * c / maxCount).toFixed(1);
    html += `<tr>
      <td>${k} cara${k === 1 ? '' : 's'}</td>
      <td>${BRL(Math.pow(2, k))}</td>
      <td class="bar-cell"><div class="bar" style="width:${w}%"></div><span>${c.toLocaleString('pt-BR')}</span></td>
      <td>${pct.toFixed(3)}%</td>
      <td style="color:var(--muted)">${theo.toFixed(3)}%</td>
    </tr>`;
  }
  $('distTable').innerHTML = html;
}

function drawChart(samples, price) {
  const cv = $('chart'), ctx = cv.getContext('2d');
  const W = cv.width, H = cv.height;
  ctx.clearRect(0, 0, W, H);
  const padL = 62, padR = 20, padT = 20, padB = 40;
  const plotW = W - padL - padR, plotH = H - padT - padB;

  const xs = samples.map(s => Math.log10(s.n));
  const xMin = 0, xMax = Math.max(...xs, 1);
  const yMax = Math.max(price * 1.2, ...samples.map(s => s.avg), 4);
  const yMin = 0;

  const px = x => padL + (x - xMin) / (xMax - xMin || 1) * plotW;
  const py = y => padT + plotH - (y - yMin) / (yMax - yMin || 1) * plotH;

  // grid + eixo Y
  ctx.strokeStyle = '#24382e'; ctx.fillStyle = '#7f958d'; ctx.font = '11px "IBM Plex Mono", monospace'; ctx.lineWidth = 1;
  const ySteps = 5;
  for (let i = 0; i <= ySteps; i++) {
    const yv = yMin + (yMax - yMin) * i / ySteps;
    const y = py(yv);
    ctx.beginPath(); ctx.moveTo(padL, y); ctx.lineTo(W - padR, y); ctx.stroke();
    ctx.fillText('R$' + yv.toFixed(0), 6, y + 3);
  }
  // eixo X (potências de 10)
  ctx.textAlign = 'center';
  for (let e = 0; e <= xMax; e++) {
    const x = px(e);
    ctx.strokeStyle = '#17251e';
    ctx.beginPath(); ctx.moveTo(x, padT); ctx.lineTo(x, padT + plotH); ctx.stroke();
    ctx.fillStyle = '#7f958d';
    ctx.fillText('10^' + e, x, H - 14);
  }
  ctx.textAlign = 'left';

  // linha do preço
  ctx.strokeStyle = '#B3EFB2'; ctx.setLineDash([6, 5]); ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(padL, py(price)); ctx.lineTo(W - padR, py(price)); ctx.stroke();
  ctx.setLineDash([]);
  ctx.fillStyle = '#B3EFB2'; ctx.font = '11px "IBM Plex Mono", monospace'; ctx.fillText('preço ' + BRL(price), padL + 6, py(price) - 8);

  // curva da média acumulada
  ctx.strokeStyle = '#7A9E7E'; ctx.lineWidth = 2.5; ctx.beginPath();
  samples.forEach((s, i) => {
    const x = px(Math.log10(s.n)), y = py(s.avg);
    i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
  });
  ctx.stroke();
}

$('btnSim').addEventListener('click', runSimulation);
document.querySelectorAll('.quick button').forEach(b => {
  b.addEventListener('click', () => { $('numGames').value = b.dataset.n; runSimulation(); });
});
$('numGames').addEventListener('keydown', e => { if (e.key === 'Enter') runSimulation(); });

// roda uma simulação inicial de exemplo
runSimulation();
