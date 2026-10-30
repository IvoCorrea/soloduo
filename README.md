# 🎮 soloduo

Plataforma de matchmaking para encontrar duos no **League of Legends**, com foco em compatibilidade de elo, sinergia de rotas e experiência sem toxicidade.

---

## 🎨 Identidade Visual & Design System

* **Estilo:** Clean, minimalista, moderno no estilo **Airbnb** com componentes **shadcn/ui**.
* **Paleta de Cores:**
  * `#0F1A20` (**Ink Black**) — Fundo e superfícies escuras refinadas.
  * `#FA9F42` (**Sandy Brown**) — Ação principal, match, energia e destaque.
  * `#80A1D4` (**Wisteria Blue**) — Badges de elo, detalhes, contrastes suaves.

---

## 🔒 Privacidade & Mecânica de Match

1. **Riot ID Mascarado:**
   * Nenhum perfil exibe o Riot ID completo para desconhecidos antes do match mútuo.
   * Exibição inicial protegida: ex. `zic----#b--` (para `zicaneto#br1`).
2. **Revelação no Match:**
   * Apenas quando ambos os jogadores clicam em **Bora Duo!**, o Riot ID real é desbloqueado com botão de copiar em 1 clique e atalho para o Discord.
3. **Sem Favoritos:**
   * Sem lista de perfis salvos sem ação. Foco na experiência rápida: **Passar** ou **Bora Duo**.
4. **Splash Art Personalizada:**
   * O jogador pode escolher a splash art de **qualquer campeão ou skin do jogo** (via Data Dragon oficial) para ser o topo do seu card.
5. **Apenas Elo Oficial (Sem Winrate):**
   * Exibição limpa do emblema e tier atual (ex: Platina III), sem poluição de taxas de vitória.

---

## 🚀 Como Executar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000) no seu navegador.
