import mongoose from 'mongoose'
import {User} from './Users.js'

const quoteSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User
    }
})

export const Quote=mongoose.model("Quote",quoteSchema)