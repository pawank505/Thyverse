import express from 'express';
const router = express.Router();

import {addMedication,getMediForGraph,addVitals
    ,getVitals,addBodyMeasurements,getBodyMeasurements
} from '../Controller/DashBoardUser.js';

router.post('/add-medi/:id',addMedication)
router.get('/get-medi-graph/:userId',getMediForGraph)

router.post('/add-vitals/:userId',addVitals);
router.get('/get-vitals/:userId',getVitals);

router.post('/add-body-measures/:userId',addBodyMeasurements)
router.get('/get-body-measures/:userId',getBodyMeasurements);

export default router;