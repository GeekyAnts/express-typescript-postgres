# Website API - Repository

---

Some times as the application scales working with relational databases becomes difficult, also if you feel adding an extra layer of ORM to relational databases costs your application performance compared to the advantages ORM provides then you are at the right place as this repo solves all that problems. It uses the same PostgreSQL you know and love while applying Typescript with ExpressJS, basic authentication using JSON Web Token, role based access control & basic database designs.

# Prerequisites

---

Binaries      | Version
------------- | -------------
NodeJS        | >= LTS
NPM           | >= 6.14.6
PostgreSQL    | >= 12.1
ts-node-dev   | >= 1.0.0

# Structure

```bash
├── config
│   ├── index.sample.ts
├── database
│   ├── migrations
│   ├── seeders
│   ├── snapshots
├── src
│   ├── controllers
│   │   ├── app.ts
│   │   ├── auth.ts
│   │   ├── index.ts
│   │   └── user.ts
│   ├── db_pool
│   │   ├── auto_schema.ts
│   │   ├── helper.ts
│   │   ├── pg_pool.ts
│   │   └── schema.ts
│   ├── events
│   │   ├── listeners
│   │   │   └── auth_listener.ts
│   │   └── index.ts
│   ├── helpers
│   │   ├── exception_wrapper.ts
│   │   ├── file.ts
│   │   ├── index.ts
│   │   ├── notfound_handler.ts
│   │   ├── random_string.ts
│   │   └── upload.ts
│   ├── middlewares
│   │   ├── check_auth.ts
│   │   └── schema.ts
│   ├── models
│   │   ├── auth.ts
│   │   ├── common.ts
│   │   ├── index.ts
│   │   ├── log.ts
│   │   ├── user_login.ts
│   │   └── user.ts
│   ├── providers
│   │   ├── cors.ts
│   │   ├── logger.ts
│   │   └── version.ts
│   ├── routes
│   │   ├── app
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   ├── auth
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   ├── user
│   │   │   ├── index.ts
│   │   │   └── schema.ts
│   │   └── index.ts
│   ├── services
│   │   ├── common_service.ts
│   │   ├── email_service.ts
│   │   ├── index.ts
│   │   ├── log_service.ts
│   │   └── user_service.ts
│   ├── swagger
│   │   ├── backend_api.yaml
│   │   └── index.ts
│   ├── typings
│   │   ├── interface.ts
│   │   └── types.ts
│   ├── validators
│   │   ├── auth.ts
│   │   └── user.ts
│   ├── extractOpenAPI.ts
│   ├── index.ts
│   ├── package.json
│   ├── prettier.config.js
│   └── tsconfig.json
├── .gitignore
└── README.md
```

# How to SetUp & Install?

---

```sh
# Clone the repository
git clone 

# Create the config file from the sample-config file
cp config/index.sample.ts config/index.ts;

# Add your database details
 user: 'db_username',
 password: 'db_password',
 database: 'db_dbname',
 host: 'db_host',
  
# Goto the source code
cd src;

# Install NPM dependencies
npm install;
```

# How to SetUp Database?

---

1. You should have **"postgres"** user available in your postgres eco-system.
2. **Create a database** with a name of your choice & assign **"postgres"** user to the database.
3. Now, you should **run the initial seed file** into your DB's Query Tool or we run it for you when you run this application for the first time.
4. Define your migrations inside /database/migrations with format **yyyymmdd-001_(schemas/data/functions)_description.sql**

# Maintaining Database

---

To ensure consitency of database across every system that uses this boilerplate code we use in house logic and auto update functions to maintain our migrations and snapshots.

 ### How Migration works

- Create a new file inside `database/migrations` folder with .sql extension defining any SQL operation (UPDATE/CREATE/DROP/INSERT).
- New file name should follow convention like **yyyymmdd-001_(schemas/data/functions)_description.sql**. *schemas* - any changes in database tables or design, *data* - new data added to tables and *functions* - operations on sql functions.
- Every time application runs it checks for any newly added sql scripts inside migrations folder and add them to the database with respective statuses pending, successful and failed.
- **Pending** - Script execution has not occurred yet, **Successful** - Script execution completed without error and **Failed** - Script execution was unsuccessful.

### How Snapshot works

- Inside `database/snapshots` folder you fill find all the tables with defined structure and views that are there in your connected database.
- Every time application runs the snapshots are updated with any new changes to the database design.
- If you are working in a large dev-team having knowledge of any new changes can help reduce errors.

# Pre-defined routes

---

| Auth                      | User             | App           |
| ------------------------- | -----------------| ------------- |
|`/auth/login`              |`/user`           | `/app/version`|
|`/auth/forgot-password`    |`/user/add`       |               |
|`/auth/change-password`    |`/user/roles`     |               |
|`/auth/whoami`             |`/user/{id_user}` |               |
|`auth/refresh-token`       |`/user/{id_user}` |               |

# How to Run?

---

### Development Environment

```sh
cd src/
npm run dev;
```

### Production Environment

```sh
cd src/ 
npm run prod;
```

# How to access the API Documentation?

- Try accessing the http://`<HOST>:<PORT>`/swagger
- Note: Remember to replace the "HOST" & "IP" with your HOST & PORT number.
