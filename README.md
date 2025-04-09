# Sistema para gerenciamento de chamados de suporte técnico

Este repositorio contém o código fonte de um sistema para gerenciamento de chamados de suporte técnico. O sistema é dividido em três partes: o frontend, o backend e o mobile.

## Funcionalidades

### Autenticação

- [✅] Deve ser possível criar uma conta (email, senha e nome);
- [✅] Deve ser possível autenticar usando email e senha;
- [✅] Deve ser possível autenticar usando a conta do google;
- [✅] Deve ser possível recuperar a senha por email;
- [✅] Deve ser possível verificar o e-mail;

### Convites

- [✅] Deve ser possível convidar um técnico/adminstrador para o sistema;
- [✅] Deve ser possível aceitar o convite;
- [✅] Deve ser possível listar todos os convites;
- [✅] Deve ser possível revogar um convite;

### Técnicos

- [ ] Deve ser possível listar todos os técnicos;
- [ ] Deve ser possível convidar um técnico;
- [ ] Deve ser possível inativar um técnico;
- [ ] Deve ser possível alterar as informações de um técnico;
- [ ] Deve ser possível alterar o status de um técnico;
- [ ] Deve ser possível listar todos os chamados de um técnico;
- [ ] Deve ser possível listar todos os chamados de um técnico por status;

### Locais

- [✅] Deve ser possível listar todos os locais;
- [✅] Deve ser possível criar novos locais;
- [✅] Deve ser possível editar locais;
- [✅] Deve ser possível inativar locais;

### Categorias

- [✅] Deve ser possível listar todos as categorias;
- [✅] Deve ser possível criar novos categorias;
- [✅] Deve ser possível editar categorias;
- [✅] Deve ser possível inativar categorias;

### Chamados

- [ ] Deve ser possível criar um novo chamado;
- [ ] Deve ser possível listar todos os chamados;
- [ ] Deve ser possível listar todos os chamados de um usuário;
- [ ] Deve ser possível listar todos os chamados de um técnico;
- [ ] Deve ser possível listar todos os chamados de um técnico por status;
- [ ] Deve ser possível listar todos os chamados de um técnico por status e data;
- [ ] Deve ser possível criar um novo chamado;
- [ ] Deve ser possível alterar o status de um chamado;
- [ ] Deve ser possível alterar o técnico de um chamado;
- [ ] Deve ser possível alterar a descrição de um chamado;

### Cargos

- Administrador
- Técnico
- Usuário

### Tabela de Permissões

- ✅ = Pode fazer;
- ❌ = Não pode fazer;
- ⚠️ = Pode fazer com restrições;

| Permissão | Administrador | Técnico | Usuário |
| --------- | ------------- | ------- | ------- |
| Adicionar adminstrador | ✅ | ❌ | ❌ |
| Adicionar técnico | ✅ | ❌ | ❌ |
| Alterar descrição do chamado | ✅ | ✅ | ❌ |
| Alterar informações do técnico | ✅ | ✅ | ❌ |  
| Alterar status do chamado | ✅ | ✅ | ❌ |
| Alterar status do técnico | ✅ | ❌ | ❌ |
| Alterar técnico do chamado | ✅ | ✅ | ❌ |
| Cancelar chamado | ✅ | ✅ | ⚠️ |
| Criar chamado | ✅ | ✅ | ✅ |
| Criar categorias | ✅ | ✅ | ❌ |
| Criar locais | ✅ | ✅ | ❌ |
| Inativar categoria | ✅ | ❌ | ❌ |
| Inativar local | ✅ | ❌ | ❌ |
| Inativar técnico | ✅ | ❌ | ❌ |
| Listar chamados | ✅ | ✅ | ⚠️ |
| Listar chamados de um técnico | ✅ | ✅ | ❌ |
| Listar chamados de um técnico por status | ✅ | ✅ | ❌ |
| Listar chamados de um técnico por status e data | ✅ | ✅ | ❌ |
| Listar administradores | ✅ | ❌ | ❌ |
| Listar categorias | ✅ | ⚠️ | ❌ |
| Listar locais | ✅ | ⚠️ | ❌ |
| Listar técnicos | ✅ | ⚠️ | ❌ |
