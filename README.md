API Chat - Documentação
=======================

Esta é a documentação da API do sistema de chat. Ela fornece endpoints para gerenciar usuários, autenticação, mensagens e chats.

**Rodar o projeto localmente**

 `git clone https://github.com/devfauze/backend-chat.git`
 
 `cd backend-chat`
 
 `npm run setup`

O "npm run setup já vai rodar tudo que é necessário para inicar o backend, atente-se de estar com o Docker ativo.
 
**Endpoints**
-------------

### **1\. Autenticação**

#### **POST /login**

Autentica um usuário no sistema.

 ``` 
{ 
"email": "usuario@exemplo.com",
"password": "senha\_secreta"
 }
```
    
```
{ 
"token": "jwt\_token\_aqui"
}
```
    
*   **Description**: Retorna um JWT token que pode ser usado para autenticação em outros endpoints.
    

### **2\. Usuários**

#### **GET /users**

Retorna todos os usuários registrados.

```
{ 
"id": 1, 
"name": "John Doe", 
"email": "john.doe@example.com" 
}, 
{ 
"id": 2, 
"name": "Jane Smith", 
"email": "jane.smith@example.com" 
}
```
*   **Description**: Recupera uma lista de todos os usuários registrados no sistema.
    

#### **GET /users/{id}**

Retorna detalhes de um usuário específico.

*   **URL Params**:
    
    *   id: ID do usuário (ex: 1)
        
```
{ 
"id": 1, 
"name": "John Doe", 
"email": "john.doe@example.com" 
}
```
    
*   **Description**: Recupera os dados de um único usuário.
    

### **3\. Mensagens**

#### **POST /messages**

Envia uma nova mensagem para o chat.

```
{
"sender\_id": 1, 
"receiver\_id": 2, 
"content": "Olá, tudo bem?"
}
```    
```
{ 
"id": 1,
"sender\_id": 1,
"receiver\_id": 2,
"content": "Olá, tudo bem?",
"created\_at": "2025-02-27T12:00:00Z"
}
``` 
*   **Description**: Envia uma mensagem de um usuário para outro no chat.
    

#### **GET /messages**

Recupera todas as mensagens.

```
{ 
"id": 1,
"sender\_id": 1,
"receiver\_id": 2,
"content": "Olá, tudo bem?",
"created\_at": "2025-02-27T12:00:00Z"
}, 
{ 
"id": 2,
"sender\_id": 2,
"receiver\_id": 1,
"content": "Sim, e você?",
"created\_at": "2025-02-27T12:01:00Z"
}
```    
*   **Description**: Recupera todas as mensagens enviadas no chat.
    

#### **GET /messages/{id}**

Recupera uma mensagem específica.

*   **URL Params**:
    
    *   id: ID da mensagem (ex: 1)
        
```
{
"id": 1,
"sender\_id": 1,
"receiver\_id": 2,
"content": "Olá, tudo bem?",
"created\_at": "2025-02-27T12:00:00Z"
}
```    
*   **Description**: Recupera detalhes de uma mensagem específica.
    

### **4\. Chats**

#### **GET /chats**

Recupera todos os chats.

```
{
"id": 1,
"user1\_id": 1,
"user2\_id": 2,
"created\_at": "2025-02-27T11:30:00Z"
}, 
{
"id": 2,
"user1\_id": 1,
"user2\_id": 3,
"created\_at": "2025-02-27T11:45:00Z"
}
```
    
*   **Description**: Recupera a lista de todos os chats entre usuários.
    

#### **GET /chats/{id}**

Recupera um chat específico.

*   **URL Params**:
    
    *   id: ID do chat (ex: 1)
        
```
{
"id": 1,
"user1\_id": 1,
"user2\_id": 2,
"messages": {
    "id": 1,
    "sender\_id": 1,
    "receiver\_id": 2,
    "content": "Olá, tudo bem?",
    "created\_at": "2025-02-27T12:00:00Z" 
    },
   { 
    "id": 2,
    "sender\_id": 2,
    "receiver\_id": 1,
    "content": "Sim, e você?",
    "created\_at": "2025-02-27T12:01:00Z"
   },
"created\_at": "2025-02-27T11:30:00Z"
}
```    
*   **Description**: Recupera detalhes de um chat específico, incluindo as mensagens trocadas entre os usuários.
    

**Autenticação e Cabeçalhos**
-----------------------------

Para acessar os endpoints que requerem autenticação, é necessário passar o token JWT no cabeçalho Authorization.
