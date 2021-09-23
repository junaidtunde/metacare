import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from './swagger/swagger.json';
import { Routes } from './routes/Routes';

import bodyParser = require("body-parser");

class App {
    public app: express.Application;
    public routePrv: Routes;

    constructor() {
        // initializing express in this application
        this.app = express();

        // allow and enable all cors requests
        this.app.use(cors());

        // support application/json type post data
        this.app.use(bodyParser.json());

        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({ extended: false }));

        // for routing the http request to controller
        this.routePrv = new Routes();
        this.routePrv.routes(this.app);

        // 404 Handler
        this.app.use((req, res, next) => {
            res.status(404).send({
                error: 'Help! Something went wrong!',
                help: 'Please check the docs.'
            });
        });

        // handle all uncaught promise rejections
        process.on('unhandledRejection', error => {
            console.error('Uncaught Error', error);
        });
    }
}

export default new App().app;