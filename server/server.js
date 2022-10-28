import {ApolloServer} from 'apollo-server'
import typeDefs from './schemaGql.js'
import mongoose from 'mongoose'
import {MONGO_URL} from './config.js'
import jwt from 'jsonwebtoken'
import {JWT_SEC} from './config.js'

//connect to database
mongoose.connect(MONGO_URL,{
    useNewUrlParser:true,
    useUnifiedTopology:true
})
mongoose.connection.on("connected",()=>{
    console.log("connected to mongodb")
})
mongoose.connection.on("error",(err)=>{
    console.log(`error connection ${err}`)
})
//import models here
// import './model/Quotes.js'
// import './model/Users.js'
import resolvers from './resolvers.js'

//this is middleware::to return userId for the logged user from authorizarion=>[token]
const context=({req})=>{
    const {authorization} =req.headers
     if(authorization){
        const {userId}=jwt.verify(authorization,JWT_SEC)
        return {userId}
    }
}
//create ApolloServer
const server=new ApolloServer({
    typeDefs,
    resolvers,
    context,
})
server.listen().then(({url})=>{
    console.log(`server is ready at port ${url}`)

})