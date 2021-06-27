An API Boilerplate for Node.js, Express.js & PostgresSQL

Here's few of the challenges we faced while working on an enterprise applications;

1. Scaling the relational database with the upgrading application becomes difficult,
2. Adding an extra layer of ORM costs your application in performance,
3. Documenting the evolution of your application & the APIs has always been difficult,
4. Reading a table's or a relation's structure of the database without going into the pgAdmin or actually writing "DESCRIBE table" SQL query was impossible.

We came up with express-typescript-postgress, this repository solves all the above mentioned problems as well as the things beyond that! Here's the list of few things we've accomplished;

1. Express JWT for API Authentication,
2. Events & Listeners for sending emails & other background works,
3. Swagger / OpenAPI for API documentation,
4. ES Lint with Prettier for finding & fixing common code problems,
5. Migration logic base to maintain the database changes,
6. Snapshots logic base to maintain all the table structure available for documentation,
7. Middleware to manage RBAC (role based access control),

and many more...

# What are the Pre-requisites?

Binaries      | Version
------------- | -------------
NodeJS        | >= LTS
NPM           | >= 6.14.6
PostgreSQL    | >= 12.1
ts-node-dev   | >= 1.0.0

# What is the Structure?

```bash
├── config
│   └── index.sample.ts
├── database
│   ├── migrations
│   ├── seeders
│   └── snapshots
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

# Map new-migration command
sudo npm link;
```

# How to SetUp Database?

1. You should have **"postgres"** user available in your postgres eco-system.
2. **Create a database** with a name of your choice & assign **"postgres"** user to the database.
3. Now, you should **run the initial seed file** into your DB's Query Tool or we run it for you when you run this application for the first time.
4. Define your migrations inside /database/migrations with format **yyyymmdd-001_(schemas/data/functions)_description.sql**

# Maintaining Database

To ensure consitency of database across every system that uses this boilerplate code we use in house logic and auto update functions to maintain our migrations and snapshots.

 ### How Migration works

- Create a new file inside `database/migrations` folder with .sql extension defining any SQL operation (UPDATE/CREATE/DROP/INSERT).
- New file name should follow convention like **yyyymmdd-001_(schemas/data/functions)_description.sql**. *schemas* - any changes in database tables or design, *data* - new data added to tables and *functions* - operations on sql functions.
- Every time application runs it checks for any newly added sql scripts inside migrations folder and add them to the database with respective statuses pending, successful and failed.
- **Pending** - Script execution has not occurred yet, **Successful** - Script execution completed without error and **Failed** - Script execution was unsuccessful.

 ### How to create new Migration File

```sh
new-migration
```
### How Snapshot works

- Inside `database/snapshots` folder you fill find all the tables with defined structure and views that are there in your connected database.
- Every time application runs the snapshots are updated with any new changes to the database design.
- If you are working in a large dev-team having knowledge of any new changes can help reduce errors.

# Explanation for custom postgres functions

Go to file [PostgresFunctions.md](/docs/PostgresFunctions.md) for detailed explanation of various functions we have used.

# Use of inheritance

Go to file [Inheritance.md](/docs/Inheritance.md) for the explanation on use of inheritance.

# Pre-defined routes

| Auth                      | User             | App           |
| ------------------------- | -----------------| ------------- |
|`/auth/login`              |`/user`           | `/app/version`|
|`/auth/forgot-password`    |`/user/add`       |               |
|`/auth/change-password`    |`/user/roles`     |               |
|`/auth/whoami`             |`/user/{id_user}` |               |
|`auth/refresh-token`       |`/user/{id_user}` |               |

# How to Run?

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
