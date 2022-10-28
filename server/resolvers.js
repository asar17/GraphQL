//import {randomBytes }from 'crypto'
import {users,quotes} from './fakedb.js'
import bcrypt from 'bcryptjs'
//import model
import {User} from './model/Users.js'
import {Quote} from './model/Quotes.js'
//import jwt and jwt secret
import jwt from'jsonwebtoken'
import {JWT_SEC} from './config.js'


const resolvers={
    Query:{
        users:async()=>{
            return await User.find({})
        },
        quotes:async()=>{
            return await Quote.find({}).populate('by',"_id firstName lastName")
        },
        user:async(_,args)=>{
            return User.findOne({_id:args._id})
        },
        iquotes:async(_,{by})=>{
            return await Quote.find({by}) 
        }
    },
    User:{
        quotes:async(user)=>{
            return Quote.find({by:user._id})

        }
    },
    Mutation:{
        //sign up mutation
        signupUser:async(_,{newUser})=>{
            //chech if the user exits or not
            const userEmail=await User.findOne({email:newUser.email})
            if(userEmail){
                throw new Error("User already exits")
            }
            //make hashedPassword
            const hashedPassword=await bcrypt.hash(newUser.password,12)
            //add new user to database
            const addUser= new User({
                ...newUser,
                password:hashedPassword
            })
            //return the new user
            return addUser.save();
        },
        //login mutation
        signinUser:async(_,{userSign})=>{
            //search for email user in database to login
           const userEmailLogin=await User.findOne({email:userSign.email})
           if(!userEmailLogin){
               throw new Error("User doesn't exits with that email")
           }
           //compare password to login
           const matchedPassword=await bcrypt.compare(userSign.password,userEmailLogin.password)
           if(!matchedPassword){
               throw new Error("email or password in invalid")
           }
           //else email and password is true
           const token=jwt.sign({userId:userEmailLogin._id},JWT_SEC)
           return {token}
        },
        createQuote:async(_,{name},context)=>{
           if(!context.userId){
               throw new Error("You must be logged")
           }
           const newQuote=new Quote({
               name,
               by:context.userId
           })
           await newQuote.save()
           return "Quote saved succfully"


        }
    }
}
export default resolvers