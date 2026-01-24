import { Router } from "express";
import { 
    getSolution,
    startAssesment,
    markUfm,
    getUserAssesments,
    submitSection,
    submitAssesment
} from "../controllers/assesmentController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAllowed } from "../middlewares/isAllowed.js";

const assesmentRouter = Router();

assesmentRouter.get('/solution/:testId/:userId', isAuthenticated, isAllowed, getSolution);
assesmentRouter.post('/start-assesment', isAuthenticated, startAssesment);
assesmentRouter.post('/mark-ufm', isAuthenticated, markUfm); // Consider who can mark UFM
assesmentRouter.get('/users/assesments/:userId', isAuthenticated, isAllowed, getUserAssesments);
assesmentRouter.post('/submit-section', isAuthenticated, submitSection);
assesmentRouter.post('/submit-assesment', isAuthenticated, submitAssesment);

export default assesmentRouter;
