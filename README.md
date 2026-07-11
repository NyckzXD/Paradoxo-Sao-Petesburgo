# 🎲 Paradoxo de São Petersburgo — Caderno de Probabilidade

> Um simulador interativo do famoso paradoxo da teoria da probabilidade, onde o **valor esperado matemático é infinito**, mas ninguém pagaria uma fortuna para jogar.
> https://nyckzxd.github.io/Problema-Sao-Petesburgo/
---

## 📖 O que é o Paradoxo de São Petersburgo?

O **Paradoxo de São Petersburgo** é um problema clássico da teoria da probabilidade e da economia comportamental, formulado originalmente por **Nicolaus Bernoulli** em 1713 e popularizado por seu primo **Daniel Bernoulli**.

### As regras do jogo

1. A banca cobra **R$ 50,00** por rodada.
2. O prêmio começa em **R$ 1,00**.
3. Uma moeda justa (50/50) é lançada repetidamente.
4. A cada **cara**, o prêmio na banca **dobra**.
5. Na primeira **coroa**, a rodada termina e o jogador recebe o prêmio acumulado.

### Por que é um paradoxo?

O **valor esperado** do prêmio é matematicamente **infinito**:

```
E = sum(k=1 to inf) [ (1/2^k) * 2^k ] = sum(k=1 to inf) [ 1/2 ] = infinity
```

Pela teoria clássica, valeria a pena pagar **qualquer preço** para jogar. Porém, na prática, o prêmio médio observado cresce apenas como **~½·log₂(N)**, e a chance de lucrar a R$ 50 é de apenas **~1,56%**.

---

## 🚀 Funcionalidades

### 🎮 Modo Jogar (Interativo)
- Inicia com um saldo de **R$ 1.000,00**
- Pague R$ 50,00 por rodada e gire a moeda com animação 3D flip
- Acompanhe o **saldo**, **rodadas jogadas**, **total apostado** e **lucro/prejuízo** em tempo real
- Histórico completo de todas as rodadas com resultado líquido
- Botão de reiniciar para começar do zero

### 📊 Modo Simular (Monte Carlo)
- Simule de **100 a 50 milhões** de rodadas instantaneamente
- Atalhos rápidos: 100, 10 mil, 1 milhão e 10 milhões de jogadas
- Resultados detalhados:
  - Custo total · Prêmio total ganho · Resultado líquido
  - Prêmio médio por jogada · Maior prêmio obtido · % de rodadas lucrativas
- **Gráfico de média acumulada × nº de jogadas** (escala logarítmica, via Canvas API)
- **Tabela de distribuição** com frequência observada vs. probabilidade teórica

---

## 🛠️ Tecnologias

| Tecnologia | Uso |
|---|---|
| **HTML5** | Estrutura semântica e Canvas API para o gráfico |
| **CSS3** | Design system com variáveis CSS, animações, glassmorphism |
| **JavaScript (ES6+)** | Lógica do jogo, simulação Monte Carlo e renderização do gráfico |

Projeto **100% front-end** — sem dependências externas, sem build step, sem framework.

---

## 📁 Estrutura do Projeto

```
MINIGAME/
├── index.html        # Estrutura da aplicação (tabs, jogo, simulador, painel explicativo)
├── script.js         # Lógica do jogo, simulação Monte Carlo e gráfico Canvas
├── style.css         # Design system completo (tokens, componentes, animações)
├── coin_cara.jpg     # Imagem da face Cara da moeda
├── coin_coroa.jpg    # Imagem da face Coroa da moeda
└── _converter.html   # Utilitário auxiliar de conversão
```

---

## ▶️ Como executar

Por ser um projeto puramente front-end, basta abrir o arquivo no navegador:

```bash
# Opção 1: abrir diretamente
# Clique duplo em index.html

# Opção 2: servidor local (recomendado para evitar CORS com imagens)
npx serve .
# ou
python -m http.server 8080
```

Nenhuma instalação de dependências necessária.

---

## 🎨 Design System

O projeto utiliza uma paleta **dark mode** com tons de verde musgo e ciano inspirados em cadernos de probabilidade clássicos:

| Token CSS | Cor | Uso |
|---|---|---|
| `--ink` | `#001A23` | Fundo principal |
| `--celadon` | `#B3EFB2` | Destaque / lucro |
| `--teal` | `#7A9E7E` | Elementos secundários |
| `--rust` | `#c97a6d` | Perda / alerta |
| `--alice` | `#E8F1F2` | Texto principal |

**Tipografia:**
- **Fraunces** (serif) — títulos e valores de destaque
- **Inter** (sans-serif) — corpo de texto
- **IBM Plex Mono** (monospace) — dados numéricos e labels técnicas

---

## 🧮 Detalhes Matemáticos

| Situação | Valor |
|---|---|
| Chance de lucrar a R$ 50 (≥ 6 caras seguidas) | **1,56%** |
| Jogadas necessárias para a média chegar a R$ 50 | **≈ 2¹⁰⁰** (mais que átomos no universo) |
| Crescimento da média observada | **~½·log₂(N)** |
| Valor esperado teórico | **∞ (infinito)** |

---

## 📜 Referências

- Bernoulli, D. (1738). *Specimen Theoriae Novae de Mensura Sortis*. Commentarii Academiae Scientiarum Imperialis Petropolitanae.
- [Wikipedia — St. Petersburg Paradox](https://en.wikipedia.org/wiki/St._Petersburg_paradox)

---

*Simulador do Paradoxo de São Petersburgo · moeda justa, 50/50*
