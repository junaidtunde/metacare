import { Request, Response } from 'express';
import axios from 'axios';
import moment from 'moment';

import { connection } from '../connection/Connection';
import Comments from '../entity/Comments';

import { convertCmToFt, sortList } from './../utils';

class Controller {
    constructor() {}

    public async getAllMovies(req: Request, res: Response) {
        try {
            let movieList = [];
            const { status, data } = await axios.get('https://swapi.dev/api/films');
            
            if (status !== 200) {
                res.status(status).json({ status: false, message: 'Error occurred while fetching movie list ' })
            }

            const db = await connection;
            const repository = await db.getRepository(Comments);

            for await (const movie of data.results) {
                const numberOfComments = await repository.count({ movieId: movie.episode_id });
                const movieData = {
                    id: movie.episode_id,
                    title: movie.title,
                    opening_crawl: movie.opening_crawl,
                    release_date: movie.release_date,
                    number_of_comments: numberOfComments
                }

                movieList.push(movieData);
            };

            movieList.sort((a, b) => moment(a.release_date, 'YYYY-MM-DD').isAfter(moment(b.release_date, 'YYYY-MM-DD')) ? 1 : -1);

            return res.status(200).json({ status: true, message: 'Successfully retrieved all movies', data: movieList });
        } catch (error) {
            res.status(500).json({ status: false, error });
        }
    }

    public async getMovieCharacters(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const { name, gender, height, filterByGender } = req.query;

            const { status, data } = await axios.get(`https://swapi.dev/api/films/${id}`);
            
            if (status !== 200) {
                res.status(status).json({ status: false, message: 'Error occurred while fetching movie list ' })
            }

            let movie = data;
            const getCharacters = movie.characters.map(character => axios.get(character));

            const charactersData = await Promise.all(getCharacters);
            let totalHeight = 0

            let characters = charactersData.map((item: any) => item.data);

            if (name) { 
                characters = sortList(characters, 'name', name.toString().toLowerCase());
            } else if (gender) {
                characters = sortList(characters, 'gender', gender.toString().toLowerCase());
            } else if (height) {
                characters = sortList(characters, 'height', height.toString().toLowerCase());
            }

            if (filterByGender) {
                characters = characters.filter((item: any) => item.gender === filterByGender);
            }

            characters.forEach((item: any) => totalHeight += Number(item.height));
            
            const { feet: totalHeightFeet, inches: totalHeightInches } = convertCmToFt(totalHeight);
            
            movie = {
                id: movie.episode_id,
                title: movie.title,
                opening_crawl: movie.opening_crawl,
                release_date: movie.release_date,
                characters,
                totalNumberOfCharacters: characters.length,
                totalCharacterHeight: `Total character height ${totalHeight}cm which makes ${totalHeightFeet}ft and ${totalHeightInches}inches.`
            }

            return res.status(200).json({ status: true, message: 'Successfully retrieved all movie characters', data: movie });
        } catch (error) {
            res.status(500).json({ status: false, error });
        }
    }

    public async addAnonymousComment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const ip_address = req.headers['x-forwarded-for'] as string;
            const { message } = req.body;

            if (message.length > 500) {
                res.status(400).json({ status: false, message: 'comment length is greater than 500 characters'})
            }

            const db = await connection;
            const repository = await db.getRepository(Comments);

            const newComment = new Comments();
            newComment.ipAddress = ip_address
            newComment.movieId = Number(id);
            newComment.message = message;

            await repository.save(newComment);

            return res.status(201).json({ 
                status: true, 
                message: 'Successfully added new anonymous comment', 
                data: {
                    ip_address,
                    movieId: id,
                    message
                } 
            });
        } catch (error) {
            res.status(500).json({ status: false, error });
        }
    }

    public async listMovieComments(req: Request, res: Response) {
        try {
            const { id } = req.params;
            
            const db = await connection;
            const repository = await db.getRepository(Comments);

            const comments = await repository.find({ movieId: Number(id) });

            return res.status(200).json({ status: true, message: 'Gotten the list of movie comments', data: comments });
        } catch (error) {
            res.status(500).json({ status: false, error });
        }
    }

}

export { Controller }