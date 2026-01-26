import { Router } from "express";
import { 
    markUfm,
    getUserAssesments,
    submitSection,
    submitAssesment
} from "../controllers/assesmentController.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isAllowed } from "../middlewares/isAllowed.js";
import { getUserAssessmentSolution } from "../controllers/assesmentCreateSolution.js";
import { getServerSync } from "../controllers/helpers.js";
import startAssessment from "../controllers/assessmentStart.js";

const assesmentRouter = Router();

assesmentRouter.post('/solution', isAuthenticated, isAllowed, getUserAssessmentSolution);
assesmentRouter.post('/start-assesment', isAuthenticated, startAssessment);
assesmentRouter.post('/mark-ufm', isAuthenticated, markUfm); // Consider who can mark UFM
assesmentRouter.get('/users/assesments/:userId', isAuthenticated, isAllowed, getUserAssesments);
assesmentRouter.post('/submit-section', isAuthenticated, submitSection);
assesmentRouter.post('/submit-assesment', isAuthenticated, submitAssesment);
assesmentRouter.get('/server-sync', isAuthenticated, isAllowed, getServerSync);

export default assesmentRouter;
