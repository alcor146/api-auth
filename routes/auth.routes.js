import express from "express";
export const router = express.Router();

import {login, register, decodeToken, modifyAccountPassword} from '../controllers/clientsControllers.js';


router.route("/login").post(login);        //get all
router.route("/register").post(register);    //get by id    
router.route("/decodeToken").get(decodeToken);     //get all
router.route("/changePassword").put(modifyAccountPassword);     //get all



