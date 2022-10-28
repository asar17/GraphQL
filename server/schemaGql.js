import {gql} from 'apollo-server'
const typeDef=gql`
type Query{
    users:[User]
    quotes:[QuoteWithName]
    user(_id:ID):User
    iquotes(by:ID):[Quote]
}
type User{
    _id:ID
    firstName:String!
    lastName:String!
    password:String!
    email:String!
    quotes:[Quote]
}
type QuoteWithName{
    name:String!
    by:IdName
}
type IdName{
    _id:String!
    firstName:String!
    lastName:String!
}
type Quote{
    name:String!
    by:ID!
}
type Token{
    token:String!
}
type Mutation{
    signupUser(newUser:UserInput):User
    signinUser(userSign:UserSigninInput):Token
    createQuote(name:String!):String
}
input UserInput{
    firstName:String!
    lastName:String!
    password:String!
    email:String!
}
input UserSigninInput{
    email:String!
    password:String!
}
`
export default typeDef