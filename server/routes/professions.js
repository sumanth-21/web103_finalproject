import express from "express";

import ProfessionsController from "../controllers/professions.js";

const router = express.Router();

router.get("/", ProfessionsController.getProfessions);

export default router;
