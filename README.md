# 💳 Cliente Bancário

Aplicação web desenvolvida para um desafio técnico, com o objetivo de criar um sistema de gerenciamento de clientes bancários.

## 🚀 Tecnologias Utilizadas

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [CSS Modules](https://github.com/css-modules/css-modules) (ou o método de estilização que estiver usando)
- [Google Sheets API via CSV](https://docs.google.com/spreadsheets/)

---

## 📋 Funcionalidades

✅ Visualização de todos os clientes cadastrados  
✅ Filtro por nome e CPF/CNPJ  
✅ Paginação (10 clientes por página)  
✅ Visualização detalhada de um cliente  
✅ Informações completas das contas bancárias do cliente  
✅ Exibição da agência vinculada ao cliente  
✅ Interface responsiva e acessível  
✅ Carregamento rápido mesmo em dispositivos com recursos limitados  
✅ Código limpo, organizado e 100% tipado com TypeScript

---

## 🔗 Fonte de Dados

Os dados são carregados dinamicamente de uma planilha do Google Sheets, nos seguintes endpoints:

- **Clientes:**  
  [clientes.csv](https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=clientes)

- **Contas Bancárias:**  
  [contas.csv](https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=contas)

- **Agências:**  
  [agencias.csv](https://docs.google.com/spreadsheets/d/1PBN_HQOi5ZpKDd63mouxttFvvCwtmY97Tb5if5_cdBA/gviz/tq?tqx=out:csv&sheet=agencias)

---

## 🧑‍💻 Como Rodar o Projeto

```bash
# Clone o repositório
git clone https://github.com/jordhanF/Cliente-Bancario.git

# Acesse a pasta
cd Cliente-Bancario

# Instale as dependências
npm install

# Rode o projeto
npm run dev
```
