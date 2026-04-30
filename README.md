# Neurix 🧠

Um aplicativo móvel em React Native (Expo) para a gestão de pacientes, responsáveis (guardiões) e aplicação de testes de avaliação psicológica e cognitiva para o auxilio terapêutico na detecção precoce do TDAH em crianças.

## 🚀 Tecnologias Utilizadas

Este projeto foi construído utilizando as seguintes tecnologias e bibliotecas principais:

- **[React Native](https://reactnative.dev/)** - Framework principal para construção de aplicativos móveis.
- **[Expo](https://expo.dev/)** - Plataforma/Framework para desenvolvimento rápido e fácil com React Native.
- **[TypeScript](https://www.typescriptlang.org/)** - Adiciona tipagem estática ao JavaScript para maior segurança no código.
- **[Supabase](https://supabase.com/)** - Plataforma de Backend-as-a-Service (BaaS) utilizada para autenticação e banco de dados.
- **[React Navigation](https://reactnavigation.org/)** - Biblioteca padrão para roteamento e navegação fluida entre telas.
- **[React Query (TanStack)](https://tanstack.com/query/latest)** - Biblioteca poderosa para busca, cache e atualização assíncrona de dados.
- **[React Native Chart Kit](https://www.npmjs.com/package/react-native-chart-kit)** - Ferramenta para exibição de gráficos e métricas visuais no painel de controle (dashboard).

## ✨ Funcionalidades Principais

- **Autenticação Segura**: Fluxos de registro, login e gestão de sessão integrados ao Supabase.
- **Gestão de Pacientes**: Cadastro completo, listagem interativa e acompanhamento detalhado dos pacientes.
- **Gestão de Responsáveis (Guardiões)**: Gerenciamento e vinculação de responsáveis aos pacientes.
- **Avaliações e Testes Cognitivos**:
  - Aplicação de testes gerais.
  - Módulos específicos para testes de concentração (preparação e execução).
  - Registro de resultados e visualização das avaliações realizadas.
- **Dashboard Analítico**: Painel de controle para acompanhamento de métricas e visualização de dados via gráficos.

## 🛠️ Como Executar o Projeto Localmente

### Pré-requisitos

Certifique-se de ter instalado em sua máquina:

- [Node.js](https://nodejs.org/) (versão 18+ recomendada)
- Gerenciador de pacotes da sua preferência (`npm`, `yarn` ou `pnpm`)
- Aplicativo **Expo Go** no seu smartphone (Android/iOS) ou um emulador configurado.

### Passo a Passo

1. **Clone o repositório e acesse a pasta:**

   ```bash
   git clone https://github.com/ArturRossiJunior/Neurix.git
   cd Neurix
   ```

2. **Instale as dependências do projeto:**

   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   ```

3. **Inicie o Servidor do Expo:**

   ```bash
   npx expo start
   ```

4. **Teste o aplicativo:**
   - Leia o **QR Code** gerado no terminal usando o app do **Expo Go** no seu celular.
   - Para abrir no emulador Android, pressione `a` no terminal.
   - Para abrir no simulador iOS, pressione `i`.

## 📁 Estrutura Principal do Projeto

A organização central do código fonte se encontra no diretório `src/`:

```text
src/
├── components/   # Componentes visuais reutilizáveis em todo o app (botões, modais, etc.)
├── navigation/   # Configuração das rotas (Stack, Tabs)
├── screens/      # Todas as telas do aplicativo (Login, Dashboard, Listagens e Formulários)
└── utils/        # Funções de formatação, validação e auxiliares gerais
```
