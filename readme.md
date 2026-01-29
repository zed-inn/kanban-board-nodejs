# Kanban Board: Backend

Kanban board is a project designed to be a Trello clone, to let user/organisation
track/manage tasks/assignments in a more organized way. Users can create boards
in this application, in which users can define columns and add cards to those
accordingly. It is less noisy and without distractions, with minimal setup, it
allows users to manage thier tasks effectively.
This application does not try to be a replacement for Trello, but offers a minimal
setup for management and tracking for users/organisation.

## Technologies

Kanban board is a project made with technologies listed below:

- Typescript
- Fastify
- Socket.IO
- PostgreSQL

The whole codebase, except for database migration scripts, are written in Typescript.
It was decided over JavaScript due to availablity of types, strictness and for
development ease.

The REST Api engine used in Fastify, for its performance and efficiency over Express.
Fastify is decided for its lifecycle discipline. Hooks instead of middlewares, at
different lifecycle phases helps set them as needed. Most of the code uses only one
hook, though, that is prehandler.

Socket.IO is used here for real-time updates regarding columns and cards.
Sockets are not used for client to take actions, but rather to propagate the change
one user did, via REST, to all connected users.
Updates to the whole board is not provided via sockets.
User is advised to reload the webpage, if on browser, to re-fetch the board details.

PostgreSQL is used as the primary database for this project, for its stricter SQL
schemas and relatively high-write performance, as updates to positions in cards/
columns require high write instead of high read for user experience.
Pg, a nodejs module, is used for querying the primary database. Most SQL queries are
predefined in the file `model.service.ts` of `src/shared/services` for easier query
access and lower chance of bug (with debugging of code made easier).

The technology stack is made to be small by choice. Each component is used after
considering options.

Other technologies are also used, they are:

- Zod
- JsonWebToken
- DotEnv
- BcryptJS

Each of these technologies can be considered supplemantary for the whole project to
be in such a good shape.

Zod is used as the primary validation tool for each input and output over REST Api
and user-defined functions.
DotEnv is used for loading of environment variables. Here also Zod is used to
validate that all the required environment variables are loaded before running the
application.
JsonWebToken is used for authentication of user over REST Api and Socket connections
and tokens are sent to client via cookies.
BcryptJS is used for hashing/comparing user passwords. Hashes of passwords are saved
in the primary database instead of text-based passwords.

## Code Structure

The project structure is `Monolithic Modular` with tree :

```ts
.
├── database.json                       // for db-migrate migrations
├── migrations                          // migrations directory to store migration
│                                       // files
├── package.json
├── package-lock.json
├── src
│   ├── io.ts                           // Io server definitions, socket endpoints
│   ├── app.ts                          // Fastify api definition, plugins
│   │                                   // registration
│   ├── server.ts                       // Server listen, io and database
│   │                                   // establishment
│   ├── config
│   │   ├── constants                   // items per page, auth cookie options
│   │   ├── db.ts                       // Database pool client wrapped in a class
│   │   │                               // for easier access
│   │   └── env.ts                      // environment variables
│   ├── modules
│   │   ├── core
│   │   │   ├── auth
│   │   │   │   ├── auth.service.ts     // Auth service to create tokens
│   │   │   │   ├── dtos                // data transfter objects
│   │   │   │   ├── index.ts            // main file to export via module
│   │   │   │   ├── login
│   │   │   │   ├── register
│   │   │   │   └── plugin              // routes, handler for REST api
│   │   │   │       ├── auth.handler.ts
│   │   │   │       └── auth.route.ts
│   │   │   ├── board                   // Board module with same structure as auth
│   │   │   │   ├── board.model.ts
│   │   │   │   ├── board.service.ts
│   │   │   │   ├── index.ts
│   │   │   │   └── plugin
│   │   │   │       ├── board.handler.ts
│   │   │   │       ├── board.route.ts
│   │   │   │       └── schemas         // Schema for routes
│   │   │   ├── member                  // Member module
│   │   │   └── user                    // User module
│   │   │       ├── index.ts
│   │   │       ├── user.constants.ts
│   │   │       ├── user.model.ts
│   │   │       └── user.service.ts
│   │   └── features
│   │       └── column                  // Column module
│   │           └── card                // Card module
│   └── shared                          // Shared objects in modules/project
│       ├── db
│       │   └── tables.ts               // Tables class to create tables in order
│       ├── hooks
│       │   └── restrict-to.ts          // restriction based access to endpoints
│       ├── io                          // services related to io server
│       │   ├── create-io-server.ts
│       │   ├── io.constants.ts
│       │   └── middlewares
│       │       ├── authenticate.ts
│       │       └── restrict-to.ts
│       ├── plugins
│       │   ├── app.route.ts            // Global api router
│       │   ├── authenticate.ts         // Authentication hook to add user object
│       │   │                           // to incoming request
│       │   └── global-error-handler.ts // Custom error handler for fastify api
│       ├── schema
│       ├── services
│       │   ├── model.service.ts        // Database model service containing basic
│       │   ├                           // operation queries and easier table creation
│       │   ├── shutdown.service.ts     // graceful shutdown of server
│       │   └── token.service.ts        // token service to create jwt tokens
│       ├── types                       // Custom types
│       └── utils                       // utility modules
└── tsconfig.json

```

This sturucture is designed for modularity with decoupling in mind.
Modules are separated on types, as `core` and `features`.

`core` modules are those that the project requires to be the project it is. As such,
`user`, `boards` and `auth` modules are core modules without which the project
would not work at all.
Without `user` and `auth`, user cannot login/register and without `boards`, the
project wouldn't be a kanban _board_.
Core modules are generally highly coupled and if any removed, the whole project
shuts down.

`features` modules are those that can be replaced and are dependedent on core
modules.
`columns` module containing `card` module can be replaced with `card` module if no
columns are required at any point of time.
Feature modules are generally highly decoupled and are only dependent on core modules
instead of sibling feature modules. Feature modules are modules in which any add on
over that module comes under that modules. like `card` module _inside_ `columns`.

This structure separates the highly coupled and highly de-coupled modules separated,
making changes to overall structure accessible and modifiable.

## Application Flow

The application flow, or the flow in which the data moves from request to response,
is described below.

**Surface flow**

Client -> REST -> DB -> Socket Emit(if any) -> Clients

**Deep dive**

1. Client sends the request over REST api.
2. The request first gets authenticated and a user object is attached to the request.
3. The request is passed through established hooks over the endpoint that is
   recieving the request.
4. Request is successfully recieved.
5. Database is modified/requested as per request.
6. If socket emit, emits to all connected clients.
7. Response is sent to client at last.

## Auth Model

Authentication for users is achieved via JsonWebTokens. There are two types of tokens
generated for each user login/registration: `access-token` and `refresh-token`.
These tokens are then sent to user as response in cookies. Each subsequent request
contains both the tokens after being sent.

Access token is used for defining user of the request, Refresh token is used to
generate the access token if the token has been invalidated due to reasons(expiry).
Refresh token can also expire within coded time if not used.
Currently refresh tokens are not rotated, and once refresh tokens die, user has to
login again.

Tokens are sent to user at login time in cookies as response. these tokens are reused
within socket connections to determine if the request has come from the same user.
Only access token is used in socket connections.

## Database Models/Tables

Fields in model/tables are written in snake_case as per standard in postgresql, but
during code and responses in api, are converted to camelCase.

### User

Users table is created to store data of users and to authenticate users on login and
to generate tokens for subsequest contextual requests.

```ts
{
  id: uuidv7;
  email: string;
  password_hash: string;
  created_at: timestamp;
  updated_at: timestamp;
}
```

### Boards

Boards table is used for storing boards and its owner.

```ts
{
  id: uuidv7;
  user_id: uuidv7;
  name: string;
  created_at: timestamp;
  updated_at: timestamp;
}
```

`user_id` is a foreign key for users (id).
On deleting the associated user object, board will also be deleted.

### Members

Members table store which user is member of which board

```ts
{
  user_id: uuidv7;
  board_id: uuidv7;
  created_at: timestamp;
}
```

`user_id` and `board_id` are foreign keys to users (id) and boards (id)
respectively.
On deleting either associated objects, the member object will also be deleted

Any member can add new member to the board. Any member, except, owner can leave
the membership of the board. The owner can only delete the board currently.

### Columns

Column contain the data that what columns are in a board with what position.

```ts
{
  id: uuidv7;
  board_id: uuidv7;
  name: string;
  position: numeric;
  created_at: timestamp;
  updated_at: timestamp;
}
```

Each column is associated with board via `board_id`.
Any changes to column can be made via member of the associated board.

Here, column position is `fractional sparsed` as position can take decimal values
and new columns are generated by giving some amount of gap in position.
Example:
Current order: 1->2->3->4->5->....
User wants 3 to go to position of 4
The position of 4 is not changed, rather the position of 3 becomes (4 + 5)/2, i.e., 4.5
New order: 1->2->4->4.5(3)->5->...
This way the position of only the requested column is changed, and `updated_at` column
is updated for the requested one only.

### Card

```ts
{
  id: uuidv7;
  board_id: uuidv7;
  column_id: uuidv7;
  title: string;
  body: string | null;
  created_at: timestamp;
  updated_at: timestamp;
}
```

The position system is same as in `columns`.
The extra field `board_id` is added for efficiency when emitting events and checking if the
user belongs to board or not.
If no `board_id` is present, then an extra query must be made to the column to get it.

## Realtime

Each update via REST is sent to connected clients through sockets.

Only rooms of `boardId` are created in which users are joined to.
Each update over any object associated to boards then is propagated through sockets.
Each socket can only be assigned to one room/board.

**Overview**

User joins through socket and joins a room/board.
User gets events as they are updated.
User joins another room/board, but during joining, is removed from all other rooms/baords.

## Trade-offs and Limitations

- No CRDT
- No email verification on registration, only validation
- No Rotation of refresh tokens
- Extra memory in db used for `board_id` in `cards` for speed.
- Last write wins when doing stuff, over same board, or objects associated to boards.

## What I learned

In this project, I built the Kanban board backend from end-to-end.
I build this modular structure.
I used fastify and learned its lifecycle and hooks. I built the REST over fastify. For this
project, I read MDN HTTP Docs to learn more about HTTP. Currently no cache control is used
but can be done at later stage, for giving easier access to user.
I used postgresql database, and sql queries are used instead of ORMs. I learned how a SELECT
query is built, what is its order and how to JOIN on SELECT.
I learned how to build Access and Refresh Tokens and Set in Cookies.
I learned how to read cookies over socket connection and reuse the access tokens.
