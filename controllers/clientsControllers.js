import {Client} from "../models/Client.js";
import jwt from 'jsonwebtoken';

import dotenv from 'dotenv'
import bcrypt from "bcryptjs"


dotenv.config({ path: '.env'});


import nodemailer from "nodemailer"

var transporter = nodemailer.createTransport({
  service: 'gmail',
  port: 587,
  secure: false, // use SSL
  ignoreTLS: true, // add this 
  auth: {
    user: 'aurelrist@gmail.com',
    pass: 'kyxhqgtejegteqbn'
  }
});


export const register = function (req, res) {
  console.log("THIS IS REGISTER")
  const { name, phoneNumber, email, password, passwordConfirmation } = req.body
  if (!email || !password) {
    return res.json({ status: "422", error: 'Please provide email or password' })
  }

  console.log(password, passwordConfirmation)

  if (password != passwordConfirmation) {
    return res.json({ status: "422", error: 'Password does not match' })
  }
  Client.findOne({ email }, function (err, existingUser) {
    if (err) {
      return res.json({ status: "422", error: 'Oops! Something went Wrong' })
    }
    if (existingUser) {
      return res.json({ status: "421", error: 'User already exists' })
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
  console.log("THIS IS LOGIN")
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
    console.log(user)
    if (!user) {
      return res.json({ status: "421", error: 'Invalid user' })
    }
    

    // var passwordIsValid = bcrypt.compareSync(
    //   password,
    //   user.password
    // );
    let passwordIsValid = (password == user.password) ? true : false
 
    if (passwordIsValid) {
      let json_token = jwt.sign(
        {
          userId: user.email,
          role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: '1h' })

      return res.status(200).json({status: "200", token: json_token, role: user.role})
    }
    else {
      return res.json({ status: "421", error: 'Wrong email or password' })
    }
  })
}


export const decodeToken = function (req, res) { 
  console.log("GET TOKEN")
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.send({status: "403", message: "No token provided!" });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.send({ status: "401", message: "Unauthorized!" });
    }
    console.log(Date.now()-decoded.exp*1000)
    if (Date.now() >= decoded.exp * 1000) {
      res.send({status: "201", message: "token expired"})
    }else{
      res.send({status: "200",token: decoded})
    }
  });
}

export const modifyAccountPassword = async (req, res, next) => {
  console.log('PUT /Orders is commented!');
 
      const customerEmail = req.body.email
      console.log(customerEmail)

      const checkExistingClient = await Client.find({email: customerEmail});
    console.log(checkExistingClient)
      if (!checkExistingClient || checkExistingClient.length == 0) {
        res.json({status: "401", message: `client with email ${customerEmail} does not exist!`});
      } else {
          let randomPassword = Math.random().toString(36).slice(-8);
          const updatedClient = await Client.findOneAndUpdate(
            { email: customerEmail },
            { password: randomPassword},
            { new: true }
          );


          var mailOptions = {
            from: 'aurelrist@gmail.com',
            to: customerEmail,
            subject: 'Account password   updated',
            text: `The new password for the account is ${randomPassword}`
          };

          await transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
          });

          if (updatedClient) {
            res.json({status: "200", message: 'update1', data: updatedClient});
          } else {
            res.json({status: "400", message: 'update2', data: updatedClient});
          }
  }
}



