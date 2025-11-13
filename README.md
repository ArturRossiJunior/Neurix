# Neurix (MindPlay) — Plataforma de Jogos Terapêuticos

Este aplicativo é uma plataforma inovadora de jogos terapêuticos e análise de dados para apoiar o desenvolvimento cognitivo de crianças com TDAH. Utiliza Expo (React Native) para rodar em dispositivos móveis e web, com interface moderna baseada em componentes reutilizáveis e utilitários de estilo tipo Tailwind.

## Estrutura das Pastas

- **App.tsx** — Ponto de entrada do aplicativo, define a tela principal.
- **index.ts** — Registra o componente principal no Expo (compatível com web e mobile).
- **package.json** — Scripts e dependências do projeto.
- **tsconfig.json** — Configuração do TypeScript (tipagem estrita).
- **assets/** — Imagens e recursos estáticos.
- **scr/** — Código-fonte principal (atenção: é `scr`, não `src`).
  - **components/** — Componentes reutilizáveis, como botões (`button.tsx`) com variantes e estilos dinâmicos.
  - **screens/** — Telas do aplicativo. Exemplo: `Index.tsx` mostra a tela inicial e usa navegação web (`react-router-dom`).
  - **utils/** — Funções utilitárias, como o helper `cn` para combinar classes Tailwind.

## Tutorial Rápido de Uso

1. **Instale as dependências**
   ```powershell
   npm install
   ```

2. **Rode o aplicativo no Expo (mobile ou web)**
   - Para abrir o Expo DevTools:
     ```powershell
     npm run start
     ```
   - Para rodar no navegador:
     ```powershell
     npm run web
     ```
   - Para rodar em Android:
     ```powershell
     npm run android
     ```
   - Para rodar em iOS:
     ```powershell
     npm run ios
     ```

3. **Estrutura de componentes**
   - Para criar um novo botão, siga o padrão de `scr/components/button.tsx` usando variantes (`cva`) e o helper `cn`.
   - Para adicionar uma nova tela, crie um arquivo em `scr/screens/` e use componentes existentes para manter o visual consistente.

4. **Validação de código**
   - Antes de commitar, rode:
     ```powershell
     npx tsc --noEmit
     ```
   - Isso garante que o TypeScript está correto e evita erros em produção.

## Observações Importantes

- O projeto usa alias `@/` para importar arquivos de `scr/`. Se não estiver configurado no seu ambiente, prefira imports relativos.
- As classes de estilo são baseadas em Tailwind; use o helper `cn` para combinar múltiplas classes.
- Sempre siga o padrão de componentes com `forwardRef` e variantes para garantir reusabilidade.

---
Se quiser exemplos de configuração de alias ou integração com CI (GitHub Actions), posso adicionar! Basta pedir.
