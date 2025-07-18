// File: src/api/diagnosis.routes.js
import express from 'express';
import diagnosisController from '../controllers/diagnosis.controller.js';

const router = express.Router();

router.post('/assess', diagnosisController.handleAssessmentRequest);

export default router;