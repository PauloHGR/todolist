
# ToDo List App - Django + React

Aplicação Web de gerenciamento de tarefas (To-Do List), com autenticação de usuário e filtro de tarefas. O backend é desenvolvido com **Django REST Framework** e o frontend com **React**, ambos containerizados com **Docker**.

## ✅ Funcionalidades

- [x]  Registro e login de usuários
- [x]  CRUD completo de tarefas
- [x]  Marcar tarefas como concluídas ou não
- [x]  Filtro por título e status (concluída/não concluída)
- [x]  Paginação de tarefas (2 por página)
- [x]  Interface React com integração total à API
- [x]  Backend e frontend em containers Docker

---

## 🧰 Tecnologias Utilizadas

### Backend:
- Python 3.12
- Django REST Framework
- SQLite (armazenado via volume Docker)
- Unit tests
- Docker

### Frontend:
- React (via Create React App)
- Axios
- Docker (Node container)
## Como executar com Docker

1. **Build dos containers:**

```bash
docker-compose build
```

2. **Aplicar as migrações:**

```bash
docker-compose run backend python manage.py migrate
```

3. **Subir a aplicação:**

```bash
docker-compose up
```

---

## Acessos

- API Django: [http://localhost:8000/api/](http://localhost:8000/api/)
- App React: [http://localhost:3000](http://localhost:3000)

---
    ## Autenticação

| Método | Endpoint               | Autenticado | Descrição                          |
|--------|------------------------|-------------|------------------------------------|
| POST   | `/api/register/`       | ❌          | Registro de novo usuário           |
| POST   | `/api/token/`          | ❌          | Geração de token JWT (login)       |
| POST   | `/api/token/refresh/`  | ❌          | Atualização de token JWT           |

---

## Tarefas

| Método   | Endpoint             | Autenticado | Descrição                                |
|----------|----------------------|-------------|------------------------------------------|
| GET      | `/api/tasks/`        | ✅           | Lista todas as tarefas (com filtros)     |
| POST     | `/api/tasks/`        | ✅           | Cria nova tarefa                         |
| GET      | `/api/tasks/<id>/`   | ✅           | Recupera tarefa específica               |
| PUT      | `/api/tasks/<id>/`   | ✅           | Atualiza dados de uma tarefa             |
| DELETE   | `/api/tasks/<id>/`   | ✅           | Deleta uma tarefa                        |

### Filtros disponíveis em `GET /api/tasks/`

| Parâmetro    | Tipo    | Exemplo                        | Descrição                                |
|--------------|---------|--------------------------------|------------------------------------------|
| `search`     | string  | `?search=docker`              | Busca por título  |
| `completed`  | boolean | `?completed=true`             | Filtra por concluídas ou não             |
| `page`       | int     | `?page=2`                     | Paginação (2 por página)                 |

**Exemplo completo**:
```
GET /api/tasks/?search=doc&completed=false&page=2
```
## Payload de exemplo

### Criar tarefa
```json
POST /api/tasks/
{
  "title": "Finalizar documentação",
  "completed": false
}
```
---
## Autor
- [@PauloHGR](https://github.com/PauloHGR)
Este projeto é parte de um exercício prático de Full Stack com foco em boas práticas modernas de desenvolvimento web.

Projeto e documentação criados com auxílio do ChatGPT – OpenAI
