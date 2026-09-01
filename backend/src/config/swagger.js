import swaggerJsdoc from 'swagger-jsdoc';

const swaggerSpec = swaggerJsdoc({
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '2.0.0',
            description: 'REST API for the Task Manager MERN application',
        },
        servers: [{ url: 'http://localhost:5000', description: 'Local server' }],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                Task: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        priority: { type: 'string', enum: ['low', 'medium', 'high'] },
                        status: { type: 'string', enum: ['pending', 'in-progress', 'completed'] },
                        completed: { type: 'boolean' },
                        dueDate: { type: 'string', format: 'date-time', nullable: true },
                        category: { type: 'string', nullable: true },
                        userEmail: { type: 'string', format: 'email' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' },
                    },
                },
                Category: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        color: { type: 'string' },
                        userEmail: { type: 'string', format: 'email' },
                        createdAt: { type: 'string', format: 'date-time' },
                    },
                },
                UserResponse: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string' },
                        name: { type: 'string' },
                        email: { type: 'string', format: 'email' },
                        token: { type: 'string' },
                    },
                },
                Error: {
                    type: 'object',
                    properties: {
                        error: { type: 'string' },
                        details: { type: 'object' },
                    },
                },
            },
        },
    },
    apis: [],
});

export default swaggerSpec;