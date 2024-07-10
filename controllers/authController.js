import userModel from "../models/userModel.js";
import { comparePassword, hashPassword } from "../helpers/authHelper.js";
import JWT from 'jsonwebtoken';

export const registerController = async (req,res) =>{             //req res jo likha hota hai uska matlab woh callBack function hai
    try {
        const {name,email,password,phone,address} = req.body  //destructuring kiya
        //validations
        if(!name){
            return res.send({message:'Name is Requuired'})
        }
        if(!email){
            return res.send({message:'Email is Requuired'})
        }
        if(!password){
            return res.send({message:'Password is Requuired'})
        }
        if(!phone){
            return res.send({message:'Phone is Requuired'})
        }
        if(!address){
            return res.send({message:'Address is Requuired'})
        }
        //check user
        const existingUser = await userModel.findOne({email})
        //existing user
        if(existingUser){
            return res.status(200).send({
                success:false,
                message:'Already Register please login',
            })
        }
        //register user 
        const hashedPassword = await hashPassword(password);
        //save
        const user = await new userModel({name,email,phone,address,password:hashedPassword}).save();  //password- yeh key hai  AND  hashedPassword - yeh value hai Samjo 

        res.status(201).send({
            success:true,
            message:'User Register Successfully',
            user
        })
         
        
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success:false,
            message:'Error in Registration',
            error
        })
    }
};
//POST LOGIN

export const loginController = async (req, res) => {
    try {
      const { email, password } = req.body;
      //validation
      if (!email || !password) {
        return res.status(404).send({
          success: false,
          message: "Invalid email or password",
        });
      }
      //check user
      const user = await userModel.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: "Email is not registerd",
        });
      }
      const match = await comparePassword(password, user.password);
      if (!match) {
        return res.status(200).send({
          success: false,
          message: "Invalid Password",
        });
      }
      //token
      const token = await JWT.sign({ _id: user._id }, process.env.JWT_SECRET, {  //jsonwebtoken ese likhte hai 
        expiresIn: "7d",
      });
      res.status(200).send({
        success: true,
        message: "login successfully",
        user: {                                    //yeh upper wale jesa hi ha user call kiya but isme yeh difference hai ke user ke ander kya dikhna choye woh specify kar diya apan because apan ko passwrd nhi dikhana hai 
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          address: user.address,
        },
        token,
      });
    } catch (error) {
      console.log(error);
      res.status(500).send({
        success: false,
        message: "Error in login",
        error,
      });
    }
  };
//test controller
export const testController=(req,res)=>{
    res.send('Protected Route')
}