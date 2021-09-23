import { Request, Response } from 'express';
import { Controller } from '../controller/Controller';

class Routes {
    private controller: Controller;

    constructor() {
        this.controller = new Controller();
    }

    public routes(app): void {
        app.route('/')
            .get((request: Request, response: Response) => {
                response.status(200)
                    .send({
                        message: "GET request successfully."
                    });
            });

        app.route('/movies').get(this.controller.getAllMovies);
        app.route('/movies/:id/characters').get(this.controller.getMovieCharacters);
        app.route('/movies/:id/comment/add').post(this.controller.addAnonymousComment);
        app.route('/movies/:id/comments').get(this.controller.listMovieComments);
    }
}
export {Routes};