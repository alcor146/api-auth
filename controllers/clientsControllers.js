import {Client} from "../models/Client.js";
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv'
import bcrypt from "bcryptjs"


dotenv.config({ path: '.env'});


export const register = function (req, res) {
  const { name, phoneNumber, email, password, passwordConfirmation } = req.body
  if (!email || !password) {
    return res.json({ status: "422", error: 'Please provide email or password' })
  }

  if (password != passwordConfirmation) {
    return res.json({ status: "422", error: 'Password does not match' })
  }
  Client.findOne({ email }, function (err, existingUser) {
    if (err) {
      return res.json({ status: "422", error: 'Oops! Something went Wrong' })
    }
    if (existingUser) {
      return res.json({ status: "422", error: 'User already exists' })
    }
    else {
      const user = new Client({
        name: name, 
        phoneNumber: phoneNumber, 
        email: email, 
        password: password
      })

      user.save(function (err) {
        if (err) {
          return res.json({
            status: "422", 
            error: 'Oops! Something went wrong'
          })
        }
        return res.status(200).json({status: "200",  'registered': true })
      })
    }
  })
 }


export const login = function (req, res) { 
  const { email, password } = req.body

  if (!email || !password) {
    console.log()
    return res.json({ status: "422",  error: 'Please provide email or password' })
  }
  Client.findOne({ email }, function (err, user) {
    if (err) {
      return res.json({status: "422", 
        error: 'Oops! Something went wrong'
      })
    }

    if (!user) {
      return res.json({ status: "422", error: 'Invalid user' })
    }
    console.log(password, user.password)

    // var passwordIsValid = bcrypt.compareSync(
    //   password,
    //   user.password
    // );
    let passwordIsValid = (password == user.password) ? true : false
    console.log( process.env.JWT_SECRET)



    if (passwordIsValid) {
      let json_token = jwt.sign(
        {
          userId: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' })

      return res.json({token: json_token})
    }
    else {
      return res.json({ status: "422", error: 'Wrong email or password' })
    }
  })
}


export const decodeToken = function (req, res) { 
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(401).send({ status: "401", message: "Unauthorized!" });
    }
    console.log(decoded)
    res.status(200).send({status: "200",token: decoded})
  });
}



