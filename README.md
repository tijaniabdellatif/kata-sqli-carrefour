<a name="readme-top"></a>

[![Issues][issues-shield]][issues-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<br />
<div align="center">
  <a href="#">
    <img src="chat.png" alt="Logo" width="80" height="80">
  </a>

  <h3 align="center">Mini-Chat Support Bot</h3>

  <p align="center">
    A keyword-based support chatbot built with React, Node.js/Express, MongoDB (Prisma), and TypeScript in an Nx monorepo structure.
    <br />
    <strong>Full-Stack TypeScript · Nx Monorepo ·</strong>
    <br />
    <br />
    ·
    <a href="https://gitlab.com/fr_kata_sf/c4-sf-2025-10-24-mini-chat-tija/-/issues">Report Bug</a>
    ·
    <a href="https://gitlab.com/fr_kata_sf/c4-sf-2025-10-24-mini-chat-tija/-/issues">Request Feature</a>
  </p>
</div>

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#features">Features</a></li>
        <li><a href="#built-with">Built With</a></li>
        <li><a href="#architecture">Architecture</a></li>
        <li><a href="#project-structure">Project Structure</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
        <li><a href="#environment-setup">Environment Setup</a></li>
        <li><a href="#database-setup">Database Setup</a></li>
      </ul>
    </li>
    <li>
      <a href="#usage">Usage</a>
      <ul>
        <li><a href="#running-the-application">Running the Application</a></li>
        <li><a href="#nx-commands">Nx Commands</a></li>
        <li><a href="#api-documentation">API Documentation</a></li>
      </ul>
    </li>
    <li><a href="#testing">Testing</a></li>
    <li><a href="#deployment">Deployment</a></li>
    <li><a href="#project-visualization">Project Visualization</a></li>
    <li><a href="#roadmap">Roadmap</a></li>
    <li><a href="#contact">Contact</a></li>
  </ol>
</details>

<!-- ABOUT THE PROJECT -->
## About The Project

![Product Screenshot][product-screenshot]

**Mini-Chat**, full-stack support chatbot application built with a focus on **clean architecture**, **type safety**, and **scalability**. The application demonstrates  software engineering practices including:

- **Nx Monorepo Structure** for efficient code organization and sharing
- **Clean Architecture** with separation of concerns
- **Type-Safe** development with shared TypeScript types
- **RESTful API** design with proper error handling
- **Modern React** with hooks and component composition
- **Comprehensive Testing** with Jest
- **Production-Ready** build  configuration

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Features

✅ **Real-Time Chat Interface**
- Chat UI with message bubbles
- Conversation history and management
- Message timestamps and sender identification

✅ **Intelligent Keyword Detection**
- Priority-based keyword matching
- Case-insensitive keyword detection
- Multiple keywords per response
- Customizable bot responses

✅ **Message Persistence**
- MongoDB database with Prisma ORM
- Conversation and message models
- Chat history retrieval
- Data integrity and validation

✅ **Type-Safe Development**
- Shared TypeScript types between frontend and backend
- Compile-time type checking
- IntelliSense support
- Reduced runtime errors

✅ **Clean Architecture**
- Base controller and service classes
- Centralized error handling
- DTO validation with class-validator
- Modular route organization

✅ **Testing & Quality**
- Unit tests for controllers and services
- Jest testing framework
- Mock-based testing

✅ **Monorepo Benefits**
- Shared libraries across projects
- Consistent tooling and configuration
- Efficient dependency management
- Code generation and scaffolding

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Built With

#### Frontend
* [![React][React.js]][React-url] - UI Library
* [![TypeScript][TypeScript]][TypeScript-url] - Type Safety
* [![TailwindCSS][TailwindCSS]][Tailwind-url] - Styling
* [![Vite][Vite]][Vite-url] - Build Tool
* [![ShadcnUI][ShadcnUI]][Shadcn-url] - UI Components

#### Backend
* [![Node.js][Node.js]][Node-url] - Runtime Environment
* [![Express][Express.js]][Express-url] - Web Framework
* [![TypeScript][TypeScript]][TypeScript-url] - Type Safety
* [![Prisma][Prisma]][Prisma-url] - ORM
* [![MongoDB][MongoDB]][MongoDB-url] - Database

#### DevOps & Tools
* [![Nx][Nx]][Nx-url] - Monorepo Tool
* [![Jest][Jest]][Jest-url] - Testing Framework
* [![ESLint][ESLint]][ESLint-url] - Linting
* [![Docker][Docker]][Docker-url] - Containerization (Not implemented)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Architecture

#### Monorepo Structure

```
mini-chat/
├── apps/
│   ├── client-chat/              # React Frontend Application
│   │   ├── src/
│   │   │    
│   │   │   ├── hooks/            # Custom hooks (useChat, useConversation)
│   │   │   ├── app/              # Utilities
│   │   │   └── index.tsx         # Main app component
│   │   └── vite.config.ts
│   │
│   └── mini-chat-server/         # Node.js Backend Application
│       ├── src/
│       │   ├── controllers/      # Route controllers
│       │   ├── services/         # Business logic
│       │   ├── routes/           # API routes
│       │   ├── middleware/ 
├            ── dto/              # DTOs (Data Transfer Objects)
│       │   └── main.ts           # Server entry point
│       └── prisma/
│           └── schema.prisma     # Database schema
│
├── libs/
│   ├── backend/
│   │   └── common-layer/         # Shared Backend Code
│   │       ├── base-controller.ts
│   │       ├── base-service.ts
│   │       ├── error-handler.ts
│   │       └── validators.ts
│   │
│   ├── frontend/
│   │   └── ui/                   # Shared UI Components
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── textarea.tsx
│   │       └── ...
│   │
│   └── shared/
│       └── types/                # Shared TypeScript Types
│           ├── message.types.ts
│           ├── conversation.types.ts
│           └── api.types.ts
│
├── nx.json                       # Nx configuration
├── package.json                  # Root dependencies
└── tsconfig.base.json           # TypeScript base config
```

#### Project Graph

![Project Graph][project-graph]

**Layer Description:**

1. **Apps Layer** (2 applications)
   - `client-chat`: React frontend with TypeScript and Tailwind
   - `mini-chat-server`: Node.js backend with Express and Prisma

2. **Libs Layer** (3 libraries)
   - `backend/common-layer`: Reusable backend classes and utilities
   - `frontend/ui`: Shared UI components with Shadcn
   - `shared/types`: TypeScript types shared across frontend and backend

**Dependencies:**
- Both apps depend on `shared/types` for type safety
- Frontend uses `frontend/ui` for consistent UI components
- Backend uses `backend/common-layer` for base classes and utilities

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Project Structure

<details>
<summary>📁 Detailed File Structure</summary>

```
mini-chat/
│
├── apps/
│   ├── client-chat/
│   │   ├── src/
│   │   │   ├── components/
│   │   │   │   ├── app/
│   │   │   │   │   ├──app.tsx    
│   │   │   │
│   │   │   ├── hooks/
│   │   │   │   ├── use-api.ts
│   │   │   │   ├── use-chat.tsx
│   │   │   │   ├── use-conversation.tsx
│   │   │   │   └── use-message.ts
│   │   │   ├── lib/
│   │   │   │   └── utils.ts
│   │   │   ├
│   │   │   └── main.tsx
│   │   ├── index.html
│   │   ├── vite.config.ts
│   │   ├── tailwind.config.js
│   │   └── project.json
│   │
│   └── mini-chat-server/
│       ├── src/
│       │   ├── controllers/
│       │   │   ├── chatbot.controller.ts
│       │   │   ├── chatbot.controller.spec.ts
│       │   │   ├── conversation.controller.ts
│       │   │   └── conversation.controller.spec.ts
│       │   ├── services/
│       │   │   ├── chatbot.service.ts
│       │   │   ├── chatbot.service.spec.ts
│       │   │   ├── conversation.service.ts
│       │   │   └── conversation.service.spec.ts
│       │   ├── routes/
│       │   │   ├── chatbot.routes.ts
│       │   │   └── conversation.routes.ts
│       │   └── main.ts
│       ├── prisma/
│       │   ├── schema.prisma
│       ├── project.json
│       └── jest.config.ts
│
├── libs/
│   ├── backend/
│   │   └── common-layer/
│   │       ├── src/
│   │       │   ├── lib/
│   │       │   │   ├── base-controller.ts
│   │       │   │   ├── base-service.ts
│   │       │   │   ├── base-routes.ts
│   │       │   │   ├── base-validator.ts
│   │       │   │   ├── errors/
│   │       │   │   │   ├── bad-request.error.ts
│   │       │   │   │   ├── not-found.error.ts
│   │       │   │   │   └── internal-server.error.ts
│   │       │   │   └── index.ts
│   │       │   └── index.ts
│   │       └── project.json
│   │
│   ├── frontend/
│   │   └── ui/
│   │       ├── src/
│   │       │   ├── components/
│   │       │   │   └── ui/
│   │       │   │       ├── button.tsx
│   │       │   │       ├── card.tsx
│   │       │   │       ├── textarea.tsx
│   │       │   │       └── ...
│   │       │   ├── lib/
│   │       │   │   └── utils.ts
│   │       │   └── index.ts
│   │       └── project.json
│   │
│   └── shared/
│       └── types/
│           ├── src/
│           │   ├── lib/
│           │   │   ├
│           │   │   └── types.ts
│           │   └── index.ts
│           └── project.json
│
├── docs/
│   └── images/                   # Documentation images
│
├── .env.example                  # Environment variables template
├── nx.json                       # Nx workspace configuration
├── package.json                  # Root dependencies
├── tsconfig.base.json           # TypeScript base configuration
├── .gitignore
└── README.md
```
</details>

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- GETTING STARTED -->
## Getting Started

Follow these steps to set up the project locally for development or evaluation.

### Prerequisites

Ensure you have the following installed on your system:

* **Node.js** (v18.x or higher)
  ```sh
  node --version  # Should be v18.x or higher
  ```

* **npm** (v9.x or higher)
  ```sh
  npm --version  # Should be v9.x or higher
  ```

* **MongoDB** (v6.x or higher) or use a cloud provider like **MongoDB Atlas**
  ```sh
  # Option 1: Local MongoDB
  mongod --version
  
  # Option 2: MongoDB Atlas (Cloud)
  # Create a free cluster at https://www.mongodb.com/cloud/atlas
  ```

* **Git**
  ```sh
  git --version
  ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Installation

1. **Clone the repository**
   ```sh
   git clone https://gitlab.com/fr_kata_sf/c4-sf-2025-10-24-mini-chat-tija.git
   cd mini-chat
   ```

2. **Install dependencies**
   ```sh
   npm install
   ```
   
   This will install all dependencies for the entire monorepo, including:
   - Root workspace dependencies
   - Frontend dependencies (React, Vite, Tailwind)
   - Backend dependencies (Express, Prisma, TypeScript)
   - Shared library dependencies

3. **Verify Nx installation**
   ```sh
   npx nx --version
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Environment Setup

1. **Create environment file for backend**
   
   Create `.env` file in `apps/mini-chat-server/`:
   ```sh
   cd apps/mini-chat-server
   cp .env.example .env
   ```

2. **Configure environment variables**
   
   Edit `apps/mini-chat-server/.env`:
   ```env
   # Server Configuration
   PORT=3000
   NODE_ENV=development
   
   # Database Configuration
   DATABASE_URL="mongodb://localhost:27017/mini-chat"
   # For MongoDB Atlas:
   # DATABASE_URL="mongodb+srv://<username>:<password>@cluster.mongodb.net/mini-chat?retryWrites=true&w=majority"
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:4200
   
   # API Configuration
   API_PREFIX=/api
   ```

3. **Environment variables for frontend** (Optional)
   
   Create `.env` file in `apps/client-chat/`:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Database Setup

1. **Start MongoDB** (if using local installation)
   ```sh
   # Linux/Mac
   sudo systemctl start mongod
   
   # Windows
   net start MongoDB
   
   # Or using Docker
   docker run -d -p 27017:27017 --name mongodb mongo:latest
   ```

2. **Generate Prisma Client**
   ```sh
   cd apps/mini-chat-server
   npx prisma generate
   ```

3. **Run database migrations**
   ```sh
   npx prisma db push
   ```


   
   This creates default keyword responses:
   - Greetings (hello, hi, hey)
   - Pricing inquiries
   - Help requests
   - Features information
   - Farewells
   - Thank you responses

4. **Verify database connection**
   ```sh
   npx prisma studio
   ```
   Opens Prisma Studio at http://localhost:5555 to view your database.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- USAGE -->
## Usage

### Running the Application

#### Development Mode (Recommended for Interview)

**Option 1: Run all services concurrently**
```sh
# From root directory
npm run dev
```

This starts:
- Frontend at `http://localhost:4200`
- Backend at `http://localhost:3000`

**Option 2: Run services separately**

Terminal 1 - Backend:
```sh
npm run dev:server
# Or using Nx directly:
nx serve mini-chat-server
```

Terminal 2 - Frontend:
```sh
npm run dev:client
# Or using Nx directly:
nx serve client-chat
```

#### Production Mode

1. **Build all applications**
   ```sh
   npm run build
   ```

2. **Build specific applications**
   ```sh
   # Build frontend
   nx run client-chat:build
   
   # Build backend for production
   nx run mini-chat-server:build:production
   
   # Build UI library
   nx run frontend-ui:build
   ```

3. **Run production builds**
   ```sh
   # Backend
   cd apps/mini-chat-server
   node dist/apps/mini-chat-server/main.js
   
   # Frontend (serve static files)
   npx serve apps/client-chat/dist
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### Nx Commands

#### Essential Commands

**Reset Nx cache** (useful for troubleshooting):
```sh
nx reset
```

**View project graph** (highly recommended for interview!):
```sh
nx graph
```
Opens interactive dependency graph at `http://127.0.0.1:4212/projects`

**Run specific application**:
```sh
# Serve frontend in development
nx serve client-chat

# Serve backend in development
nx serve mini-chat-server

# Build frontend
nx build client-chat

# Build backend
nx build mini-chat-server
```

**List all projects**:
```sh
nx show projects
```

**Show project details**:
```sh
nx show project client-chat
nx show project mini-chat-server
```

#### Advanced Commands

**Run affected projects** (only rebuild/test what changed):
```sh
# Test affected
nx affected:test

# Build affected
nx affected:build

# Lint affected
nx affected:lint
```

**Dependency graph for specific project**:
```sh
nx graph --focus=client-chat
nx graph --focus=mini-chat-server
```

**Parallel execution**:
```sh
# Run tests in parallel
nx run-many --target=test --all --parallel=3

# Build all projects in parallel
nx run-many --target=build --all --parallel=3
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

### API Documentation

#### Base URL
```
http://localhost:3000/api
```

#### Endpoints

<details>
<summary><strong>1. Send Message</strong></summary>

**Endpoint:** `POST /api/chat/message`

**Description:** Send a user message and receive bot response

**Request Body:**
```json
{
  "content": "Hello",
  "conversationId": null
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Message processed successfully",
  "data": {
    "message": {
      "id": "68fe7de81c1bdaa47d6197ed",
      "content": "Hello",
      "sender": "user",
      "timestamp": "2025-10-26T20:00:40.128Z",
      "conversationId": "68fe7de71c1bdaa47d6197ec"
    },
    "botResponse": {
      "id": "68fe7de81c1bdaa47d6197ee",
      "content": "Hello! How can I assist you today?",
      "sender": "bot",
      "timestamp": "2025-10-26T20:00:40.469Z",
      "conversationId": "68fe7de71c1bdaa47d6197ec"
    }
  }
}
```

**cURL Example:**
```sh
curl -X POST http://localhost:3000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{"content":"What are your prices?","conversationId":null}'
```
</details>

<details>
<summary><strong>2. Get All Conversations</strong></summary>

**Endpoint:** `GET /api/chat/conversations`

**Description:** Retrieve all conversations with summary

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Conversations retrieved successfully",
  "data": [
    {
      "id": "68fe7de71c1bdaa47d6197ec",
      "createdAt": "2025-10-26T19:45:12.000Z",
      "updatedAt": "2025-10-26T20:00:40.469Z",
      "messageCount": 4,
      "lastMessage": {
        "id": "68fe7de81c1bdaa47d6197ee",
        "content": "Hello! How can I assist you today?",
        "sender": "bot",
        "timestamp": "2025-10-26T20:00:40.469Z",
        "conversationId": "68fe7de71c1bdaa47d6197ec"
      }
    }
  ]
}
```

**cURL Example:**
```sh
curl http://localhost:3000/api/chat/conversations
```
</details>

<details>
<summary><strong>3. Get Conversation Messages</strong></summary>

**Endpoint:** `GET /api/chat/conversations/:id/messages`

**Description:** Get all messages for a specific conversation

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Messages retrieved successfully",
  "data": [
    {
      "id": "msg-1",
      "content": "Hello",
      "sender": "user",
      "timestamp": "2025-10-26T20:00:40.128Z",
      "conversationId": "68fe7de71c1bdaa47d6197ec"
    },
    {
      "id": "msg-2",
      "content": "Hello! How can I assist you today?",
      "sender": "bot",
      "timestamp": "2025-10-26T20:00:40.469Z",
      "conversationId": "68fe7de71c1bdaa47d6197ec"
    }
  ]
}
```

**cURL Example:**
```sh
curl http://localhost:3000/api/chat/conversations/68fe7de71c1bdaa47d6197ec/messages
```
</details>

<details>
<summary><strong>4. Create New Conversation</strong></summary>

**Endpoint:** `POST /api/chat/conversations`

**Description:** Create a new conversation

**Response (201 Created):**
```json
{
  "status": "success",
  "message": "Conversation created successfully",
  "data": {
    "id": "new-conv-id",
    "createdAt": "2025-10-26T20:15:00.000Z",
    "updatedAt": "2025-10-26T20:15:00.000Z",
    "messageCount": 0
  }
}
```

**cURL Example:**
```sh
curl -X POST http://localhost:3000/api/chat/conversations \
  -H "Content-Type: application/json"
```
</details>

<details>
<summary><strong>5. Delete Conversation</strong></summary>

**Endpoint:** `DELETE /api/chat/conversations/:id`

**Description:** Delete a conversation and all its messages

**Response (200 OK):**
```json
{
  "status": "success",
  "message": "Conversation deleted successfully",
  "data": null
}
```

**cURL Example:**
```sh
curl -X DELETE http://localhost:3000/api/chat/conversations/68fe7de71c1bdaa47d6197ec
```
</details>

#### Error Responses

**400 Bad Request:**
```json
{
  "success": false,
  "error": "Validation failed",
  "details": [
    "content must be a string",
    "content should not be empty"
  ]
}
```

**404 Not Found:**
```json
{
  "success": false,
  "error": "Conversation not found"
}
```

**500 Internal Server Error:**
```json
{
  "success": false,
  "error": "Internal server error"
}
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- TESTING -->
## Testing

### Running Tests

#### Run all tests
```sh
npm test
```

#### Run tests for specific projects

**Backend tests:**
```sh
# All backend tests
nx test mini-chat-server

# With coverage
nx test mini-chat-server --coverage

# Watch mode
nx test mini-chat-server --watch

# Specific test file
nx test mini-chat-server --testFile=chatbot.controller.spec.ts
```

**Frontend tests:**
```sh
nx test client-chat
```

#### Run tests for affected projects only
```sh
nx affected:test
```

### Test Coverage

**Generate coverage report:**
```sh
# Backend coverage
nx test mini-chat-server --coverage

# View coverage report
open apps/mini-chat-server/coverage/lcov-report/index.html
```

### Test Structure

```
apps/mini-chat-server/src/
├── controllers/
│   ├── chatbot.controller.ts
│   ├── chatbot.controller.spec.ts      ✅ 10 tests
│   ├── conversation.controller.ts
│   └── conversation.controller.spec.ts ✅ 14 tests
└── services/
    ├── chatbot.service.ts
    ├── chatbot.service.spec.ts         ✅ 20 tests
    ├── conversation.service.ts
    └── conversation.service.spec.ts    ✅ 20 tests

Total: 60+ tests
```

### Example Test Execution

```sh
$ nx test mini-chat-server

 PASS  src/controllers/chatbot.controller.spec.ts
  ChatBotController
    sendMessage
      ✓ should process message and return success response (24 ms)
      ✓ should process message with conversationId (8 ms)
      ✓ should handle validation errors (5 ms)
    getConversationMessages
      ✓ should return messages for valid conversation ID (6 ms)
      ✓ should return error when conversation ID is missing (4 ms)

 PASS  src/services/chatbot.service.spec.ts
  ChatBotService
    processMessage
      ✓ should create new conversation (15 ms)
      ✓ should match greeting keywords (8 ms)
    getConversationMessages
      ✓ should return messages in ascending order (5 ms)

Test Suites: 4 passed, 4 total
Tests:       60 passed, 60 total
Snapshots:   0 total
Time:        3.456 s
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- DEPLOYMENT -->
## Deployment

### Build for Production

1. **Build all projects**
   ```sh
   npm run build
   ```

2. **Build outputs**
   ```
   dist/
   ├── apps/
   │   ├── client-chat/          # Frontend static files
   │   └── mini-chat-server/     # Backend compiled JS
   └── libs/
       └── ...                    # Compiled libraries
   ```

### Docker Deployment (Planned)

```dockerfile
# Backend Dockerfile
FROM node:18-alpine
WORKDIR /app
COPY dist/apps/mini-chat-server .
COPY package*.json .
RUN npm ci --only=production
CMD ["node", "main.js"]
```

### Environment Variables (Production)

```env
NODE_ENV=production
PORT=3000
DATABASE_URL=mongodb+srv://...
CORS_ORIGIN=https://your-domain.com
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- PROJECT VISUALIZATION -->
## Project Visualization

### Nx Project Graph

To visualize the project structure and dependencies:

```sh
nx graph
```

This opens an interactive dependency graph at `http://127.0.0.1:4212/projects`

![Project Graph][project-graph]

**Key insights from the graph:**
- Clear separation between apps and libs
- Dependency relationships between projects
- Shared libraries usage across frontend and backend
- Clean architecture with no circular dependencies

### Affected Projects

See what projects are affected by your changes:

```sh
nx affected:graph
```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ROADMAP -->
## Roadmap

### Completed ✅
- [x] Basic chat functionality
- [x] Keyword-based responses
- [x] Conversation management
- [x] Message persistence
- [x] Comprehensive testing
- [x] Clean architecture implementation
- [x] Type-safe development
- [x] Monorepo structure with Nx

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- CONTACT -->
## Contact

**Abdellatif TIJANI**

[![LinkedIn][linkedin-shield]][linkedin-url]

- LinkedIn: [Abdellatif TIJANI](https://www.linkedin.com/in/abdellatif-tijani/)
- Email: tijani.abdellatif@gmail.com
- GitLab: [Project Repository](https://gitlab.com/fr_kata_sf/c4-sf-2025-10-24-mini-chat-tija)

**Project Links:**
- Issues: [Report Bug / Request Feature](https://gitlab.com/fr_kata_sf/c4-sf-2025-10-24-mini-chat-tija/-/issues)
- Documentation: This README

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

**Technologies & Tools:**
* [Nx Monorepo](https://nx.dev)
* [React](https://reactjs.org/)
* [Node.js](https://nodejs.org/)
* [Express](https://expressjs.com/)
* [Prisma](https://www.prisma.io/)
* [MongoDB](https://www.mongodb.com/)
* [TypeScript](https://www.typescriptlang.org/)
* [Tailwind CSS](https://tailwindcss.com/)
* [Shadcn/ui](https://ui.shadcn.com/)
* [Vite](https://vitejs.dev/)

**Resources:**
* [Nx Documentation](https://nx.dev/getting-started/intro)
* [Prisma Documentation](https://www.prisma.io/docs)
* [React Hooks](https://react.dev/reference/react)
* [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
* [Best README Template](https://github.com/othneildrew/Best-README-Template)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

---

<div align="center">
  <p>Built with energy</p>
  <p>
    <strong>Full-Stack TypeScript  ·  Support app</strong>
  </p>
</div>

<!-- MARKDOWN LINKS & IMAGES -->
[issues-shield]: https://img.shields.io/badge/issues-0%20open-brightgreen.svg?style=for-the-badge
[issues-url]: https://gitlab.com/fr_kata_sf/c4-sf-2025-10-24-mini-chat-tija/-/issues?sort=created_date&state=closed&first_page_size=20
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/abdellatif-tijani/
[product-screenshot]: docs/images/chat-app.png
[project-graph]: docs/images/project-tree.png

<!-- Technology Badges -->
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[Node.js]: https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white
[Node-url]: https://nodejs.org/
[Express.js]: https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white
[Express-url]: https://expressjs.com/
[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[Prisma]: https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white
[Prisma-url]: https://www.prisma.io/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Vite]: https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white
[Vite-url]: https://vitejs.dev/
[Nx]: https://img.shields.io/badge/Nx-143055?style=for-the-badge&logo=nx&logoColor=white
[Nx-url]: https://nx.dev/
[Jest]: https://img.shields.io/badge/Jest-323330?style=for-the-badge&logo=Jest&logoColor=white
[Jest-url]: https://jestjs.io/
[ESLint]: https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white
[ESLint-url]: https://eslint.org/
[Docker]: https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white
[Docker-url]: https://www.docker.com/
[ShadcnUI]: https://img.shields.io/badge/shadcn/ui-000000?style=for-the-badge&logo=shadcnui&logoColor=white
[Shadcn-url]: https://ui.shadcn.com/