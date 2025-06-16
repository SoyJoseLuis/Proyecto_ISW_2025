import { Router } from "express";
import { login } from "../controllers/estudiante.controller.js";
import { authenticateJwt } from "../middlewares/authentication.middleware.js";


const router = Router();

router.post("/login", login);
router.get("/profile", authenticateJwt, (req, res) => {
  res.status(200).json({ message: "Perfil del estudiante", estudiante: req.user });
});

export default router;