import express from "express";
export const router = express.Router();

import {login, register, decodeToken} from '../controllers/clientsControllers.js';


router.route("/login").post(login);        //get all
router.route("/register").post(register);    //get by id    
router.route("/decodeToken").post(decodeToken);     //get all



