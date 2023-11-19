import { Router } from "express";

const router = Router();

router.get("/tokenCheck", (req, res) => {

})

router.get("/profile", (req, res) => {
    const user = req.user
    const token = req.headers.token
})

export default router;