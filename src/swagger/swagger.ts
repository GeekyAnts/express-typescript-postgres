export default {
    swaggerDefinition: {
        openapi: '3.0.2',
        info: {
            version: 'v0',
            title: 'Website APIs',
            description:
                'Website documentation to create a CRUD style API in NodeJs using TypeScript',
        },
        servers: [
            {
                url: 'https://dev.website.com/api',
                description: 'DEV server'
            },
            {
                url: 'https://qa.website.com/api',
                description: 'QA server'
            },
            {
                url: 'https://prod.website.com/api',
                description: 'PROD server'
            },
            {
                url: 'http://localhost:5002',
                description: 'LOCAL 5002'
            },
            {
                url: 'http://localhost:6002',
                description: 'LOCAL 6002'
            },
        ],
        components: {
            securitySchemes: {
                BasicAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                "User": {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                        },
                        first_name: {
                            type: 'string',
                        },
                        last_name: {
                            type: 'string',
                        },
                        email: {
                            type: 'string',
                        },
                        address1: {
                            type: 'string',
                        },
                        address2: {
                            type: 'string',
                        },
                        city: {
                            type: 'string',
                        },
                        zip: {
                            type: 'number',
                        },
                        id_state: {
                            type: 'number',
                        },
                        id_country: {
                            type: 'number',
                        },
                    },
                },
                "Version": {
                    type: 'object',
                    properties: {
                        'name': {
                            'type': 'string'
                        },
                        'version': {
                            'type': 'string'
                        },
                        'commit': {
                            'type': 'string'
                        },
                        'commitshort': {
                            'type': 'string'
                        },
                        'apiVerMajor': {
                            'type': 'number'
                        },
                        'apiVerMinor': {
                            'type': 'number'
                        },
                        'apiVerPatch': {
                            'type': 'number'
                        },
                        'apiVerBuild': {
                            'type': 'number'
                        }
                    }
                },
                "Create or Edit User": {
                    type: 'object',
                    properties: {
                        st_name: {
                            type: 'string',
                        },
                        last_name: {
                            type: 'string',
                        },
                        email: {
                            type: 'string',
                        },
                        address1: {
                            type: 'string',
                        },
                        address2: {
                            type: 'string',
                        },
                        city: {
                            type: 'string',
                        },
                        zip: {
                            type: 'number',
                        },
                        id_state: {
                            type: 'number',
                        },
                        id_country: {
                            type: 'number',
                        }
                    },
                },
            },
        },
    },
    apis: ['./routes/*.ts'],
}
