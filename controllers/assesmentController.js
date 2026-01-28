import Assesment from '../models/Assesment.js';
import AssesmentSolution from '../models/Solution.js';
import { assesmentQueue } from '../queue/mainQueue.js';
import { ASSESMENT_JOB } from '../constants/constants.js';

export const getSolution = async (req, res) => {
    try {
        const { testId, userId } = req.params;
        const solution = await AssesmentSolution.findOne({ assesmentId: testId, userId: userId });
        if (!solution) {
            return res.status(404).json({ message: 'Solution not found' });
        }
        res.json(solution);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const startAssesment = async (req, res) => {
    try {
        // Logic to start an assessment
        res.json({ message: 'Assessment started' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const markUfm = async (req, res) => {
    try {
        // Logic to mark for unfair means
        res.json({ message: 'Marked for UFM' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getUserAssesments = async (req, res) => {
    try {
        const { userId } = req.params;
        const assesments = await Assesment.find({ 'userDetails.userId': userId });
        res.json(assesments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



export const submitAssesment = async (req, res) => {
    try {
        const { assesmentId, userId } = req.body;
        // Logic to submit an assessment
        await assesmentQueue.add(ASSESMENT_JOB, { assesmentId, userId });
        res.json({ message: 'Assessment submitted and job added to queue' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
