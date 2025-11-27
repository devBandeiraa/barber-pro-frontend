# 💈 Barber Pro - Frontend

Frontend do sistema de agendamento para barbearia desenvolvido com **Angular**.

## 🚀 Tecnologias

- Angular 17
- TypeScript
- RxJS
- HTML5/CSS3

## 📋 Pré-requisitos

- Node.js 18+ e npm
- Angular CLI 17+

## 🔧 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Execute o projeto:
```bash
ng serve
```

A aplicação estará disponível em: `http://localhost:4200`

## 🏗️ Build para Produção

```bash
ng build --configuration production
```

Os arquivos compilados estarão na pasta `dist/barber-pro`.

## 📁 Estrutura do Projeto

```
frontend/
├── src/
│   └── app/
│       ├── components/          # Componentes Angular
│       │   ├── cadastro-cliente/
│       │   ├── selecao-servico/
│       │   ├── selecao-barbeiro/
│       │   └── agendamento/
│       ├── services/            # Serviços HTTP
│       ├── models/              # Interfaces TypeScript
│       └── app.component.ts
└── package.json
```

## 🎯 Funcionalidades

- ✅ Cadastro de clientes
- ✅ Seleção de serviços
- ✅ Seleção de barbeiros
- ✅ Agendamento de horários
- ✅ Interface responsiva e moderna

## 🔗 Integração com Backend

O frontend consome a API REST do backend em `http://localhost:8080/api`.

Certifique-se de que o backend está rodando antes de iniciar o frontend.

## 📝 Licença

Este projeto é um exemplo educacional.

