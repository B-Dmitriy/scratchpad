import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const options = {
    failOnErrors: true,
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Hello World',
            version: '1.0.0',
        },
    },
    apis: [path.resolve(__dirname, '*')],
};

const openapiSpecification = swaggerJsdoc(options);

const swagger = {
    serve: swaggerUi.serve,
    setup: swaggerUi.setup(openapiSpecification)
};

export { swagger };