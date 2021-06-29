export default {
  definition: {
    openapi: '3.0.2',
    info: {
      version: 'v0',
      title: 'Website APIs',
      description: 'Website documentation to create a CRUD style API in NodeJs using TypeScript',
    },
    servers: [
      {
        url: 'https://dev.website.com/api',
        description: 'DEV server',
      },
      {
        url: 'https://qa.website.com/api',
        description: 'QA server',
      },
      {
        url: 'https://prod.website.com/api',
        description: 'PROD server',
      },
      {
        url: 'http://localhost:5002',
        description: 'LOCAL 5002',
      },
      {
        url: 'http://localhost:6002',
        description: 'LOCAL 6002',
      },
    ],
    components: {
      schemas: {
        User: {
          type: 'object',
          properties: {
            username: {
              type: 'string',
            },
            password: {
              type: 'string',
            },
            first_name: {
              type: 'string',
            },
            last_name: {
              type: 'string',
            },
            id_role: {
              type: 'number',
            },
            is_active: {
              type: 'boolean',
            },
          },
        },
      },
      securitySchemes: {
        BasicAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./routes/**/*.ts'],
}
