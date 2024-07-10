import express from "express";
import {registerController , loginController ,testController} from "../controllers/authController.js"
import { isAdmin, requireSignIn } from "../middlewares/authMiddleware.js";

//router object           if separate file me routing karte hai toh ek router object lagta hai 
const router = express.Router()

/// Extra knowledge - we had followed MVC pattern (Model-View-Controller) pattern in backend separates data (Model), presentation (View), and logic (Controller) to enhance maintainability, scalability, and code organization in web applications. It promotes modular development by isolating concerns, making it easier to manage and extend applications over time.
// yeh function me req res nhi hai matlab yeh callBack function nhi hua samjo isme apan ne mvc pattern follow kiya hai 
//routing
//REGISTER || Method POST
router.post('/register', registerController)
router.post('/login',loginController)

//test
router.get('/test',requireSignIn ,isAdmin ,testController) //  /test or testController ke bichme apan kitne bhi middleware pass kar sakte hai  -- ider apan ne requiresign or isAdmin yeh 2 middleware passs kiya hai 

export default router;