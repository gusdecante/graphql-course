import { GraphQLServer } from "graphql-yoga";
import db from "./db";
import { Query, Mutation, User, Post, Comment } from "./resolvers";

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    User,
    Post,
    Comment,
  },
  context: {
    db,
  },
});

server.start(() => {
  console.log("The server is up on the port:4000");
});
