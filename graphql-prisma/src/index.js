import { GraphQLServer, PubSub } from "graphql-yoga";
import db from "./db";
import {
  Query,
  Mutation,
  User,
  Post,
  Comment,
  Subscription,
} from "./resolvers";
import prisma from './prisma'

const pubsub = new PubSub();

const server = new GraphQLServer({
  typeDefs: "./src/schema.graphql",
  resolvers: {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
  },
  context: {
    db,
    pubsub,
    prisma
  },
});

server.start(() => {
  console.log("The server is up on the port:4000");
});
