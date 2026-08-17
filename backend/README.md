# Real-Time Work Allocation Backend

Production-ready Node.js, TypeScript, Express, PostgreSQL, Prisma, Socket.IO backend for collaborative work allocation and project/task management.

## Architecture

The backend uses a modular structure under `src/modules`. Controllers are thin route handlers. Services hold business logic, Prisma transactions, authorization checks, activity logging, notifications, and Socket.IO emissions.

## Prerequisites

- Node.js 22+
- PostgreSQL 16+
- Docker and Docker Compose, optional for local infrastructure

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

API docs are available at `http://localhost:4000/api/docs`.

## Docker

```bash
cd backend
cp .env.example .env
docker compose up --build
```

## Environment Variables

`DATABASE_URL`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `ACCESS_TOKEN_EXPIRES_IN`, `REFRESH_TOKEN_EXPIRES_IN`, `PORT`, `CLIENT_URL`, and `NODE_ENV` are required. Secrets must be long random values outside development.

## Database Models

Prisma models include `User`, `RefreshToken`, `Team`, `TeamMember`, `Project`, `ProjectMember`, `Task`, `Comment`, `Notification`, `ActivityLog`, and `Attachment`. Roles, statuses, priorities, and notification types are represented as Prisma enums. Foreign keys, unique membership constraints, cascades, and indexes are defined in `prisma/schema.prisma`.

## API Endpoints

Implemented endpoints:

- Auth: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`, `GET /api/auth/me`
- Users: `GET /api/users/me`, `PATCH /api/users/me`, `GET /api/users/:id`
- Teams: `POST /api/teams`, `GET /api/teams`, `GET /api/teams/:id`, `PATCH /api/teams/:id`, `DELETE /api/teams/:id`, member add/update/remove
- Projects: `POST /api/projects`, `GET /api/projects`, `GET /api/projects/:id`, `PATCH /api/projects/:id`, `DELETE /api/projects/:id`, member add/remove
- Tasks: CRUD, subtasks, position reorder, filtering, sorting, pagination
- Comments: create/list/update/delete
- Notifications: list, mark read, mark all read
- Activity: `GET /api/projects/:projectId/activity`
- Analytics: project and team analytics

## Socket.IO

Clients authenticate using the JWT access token:

```ts
io("http://localhost:4000", { auth: { token: accessToken } });
```

Authorized joins:

- `project.join` with a project id joins `project:{projectId}` only if the user is a project member.
- `team.join` with a team id joins `team:{teamId}` only if the user is a team member.

Emitted events include `task.created`, `task.updated`, `task.deleted`, `task.assigned`, `task.status_changed`, `task.reordered`, `comment.created`, `comment.updated`, `comment.deleted`, `project.updated`, `member.joined`, `member.removed`, `notification.created`, `user.online`, and `user.offline`.

## Authentication

Passwords are hashed with bcrypt. Access tokens are sent as Bearer tokens. Refresh tokens are stored as HTTP-only cookies and persisted as hashed rows so logout and refresh rotation can revoke them.

## Development Credentials

After seeding, use:

- `dev1@example.com` through `dev5@example.com`
- Password: `Password123!`

## Tests

```bash
npm test
```

The Jest/Supertest suite covers auth, protected endpoints, IDOR-style authorization, roles, teams, projects, tasks, subtasks, comments, notifications, analytics, and Socket.IO authentication/room authorization. Tests expect a PostgreSQL test database from `DATABASE_URL`.
