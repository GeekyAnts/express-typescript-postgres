# Website API - Repository

---

This repository is for kick-starting the backend APIs development from PostgreSQL DB while applying Typescript with ExpressJS, basic authentication using JSON Web Token, role based access control & basic database designs.

# Prerequisites

---

Binaries      | Version
------------- | -------------
NodeJS  			| >= LTS
NPM 					| >= 6.14.6
PostgreSQL		| >= 12.1
Nodemon				| >= 1.14.11

# Structure
```bash
├── config
│   |── index.sample.ts
├── database
│   |── migrations
│   |── seeders
│   |── snapshots
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
3. Now, you should **run the initial seed file** into your DB's Query Tool.
4. Seed file location: "**database/seeders/init.sql**".

# How to Run?

---

### Development Environment

```sh
npm run dev;
```

### Production Environment

```sh
npm run prod;
```

# How to access the API Documentation?

- Try accessing the http://`<HOST>:<PORT>`/swagger
- Note: Remember to replace the "HOST" & "IP" with your HOST & PORT number.
