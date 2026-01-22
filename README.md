# ShortBeyond API – Test Automation

## 📌 Sobre o Projeto

**ShortBeyond API – Test Automation** é um projeto educacional focado em **automação de testes de API**, desenvolvido para apoiar os alunos do **Projeto TestBeyond**.

O objetivo principal é demonstrar **boas práticas em testes automatizados**, arquitetura limpa, reutilização de código e facilidade de manutenção, utilizando uma API RESTful de encurtamento de URLs desenvolvida em **Go**.

Toda a estratégia de testes foi pensada para simular um ambiente **real de mercado**, com separação clara de responsabilidades e foco em escalabilidade.

> Projeto exclusivo para alunos do **Projeto TestBeyond** ☕💛

---

## ⚙️ Tecnologias Utilizadas

- **Node.js** – Ambiente de execução dos testes  
- **Playwright** – Test runner, assertions e testes E2E de API  
- **TypeScript** – Tipagem estática e organização do código  
- **PostgreSQL** – Banco de dados da aplicação  
- **Podman / Podman Compose** – Containerização da API  
- **Bruno** – Testes manuais e exploração de endpoints  
- **Mermaid** – Diagramação da arquitetura de testes  

---

## 🧩 Sobre a API

A **ShortBeyond API** permite:

- Cadastro e autenticação de usuários
- Criação de links encurtados e personalizados
- Listagem e exclusão de links
- Redirecionamento via código curto

A documentação OpenAPI está disponível em:

```
/docs/api.yaml
```

---

## 📌 Pré-requisitos

- Node.js 18+
- Podman
- Bruno CLI
- Git

---

## 🚀 Configuração do Ambiente

```bash
git clone https://github.com/edsonj82/pwr-shortbeyond-api.git
cd pwr-shortbeyond-api
npm install
podman-compose up -d
npx playwright test
```

---

Feito com ☕ e 💛 para o **Projeto TestBeyond**
