import { Router } from "express";

const assesmentRouter = Router();

assesmentRouter.get('/solution/:testId/:userId');
assesmentRouter.post('/start-assesment');
assesmentRouter.post('/mark-ufm');
assesmentRouter.get('/users/assesments/:userId');
assesmentRouter.post('/submit-section');
assesmentRouter.post('/submit-assesment');

export default assesmentRouter;