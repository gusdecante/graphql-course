import { GraphQLServer } from "graphql-yoga";

//Scalar types - String, Boolean, Int, Float, ID

// Demo user data
const users = [
  {
    id: "1",
    name: "Gustavo",
    email: "gustavo@example.com",
    age: 25,
  },
  {
    id: "2",
    name: "Sarah",
    email: "sarah@example.com",
  },
  {
    id: "3",
    name: "Mike",
    email: "mike@example.com",
  },
];

//Demo posts data
const posts = [
  {
    id: "1",
    title: "How to create a query in GraphQL",
    body: "How to create a query in GraphQL",
    published: true,
    author: "1",
  },
  {
    id: "2",
    title: "Flexbox in CSS",
    body: "Flexbox in CSS",
    published: false,
    author: "2",
  },
  {
    id: "3",
    title: "Destructuring in JavaScript",
    body: "How to create a query in GraphQL",
    published: true,
    author: "2",
  },
  {
    id: "4",
    title: "Async Await: Basics",
    body: "Async await the basics",
    published: true,
    author: "3",
  },
];

// Demo comments definition
const comments = [
  {
    id: "1",
    text: "Very good!!!",
    author: "1",
  },
  {
    id: "2",
    text: "Amazing text, you should write more!!!",
    author: "2",
  },
  {
    id: "3",
    text: "Cool, I understand everything!!!",
    author: "3",
  },
  {
    id: "4",
    text: "I'm very satisfied!!!",
    author: "1",
  },
  {
    id: "5",
    text: "I'm very satisfied!!!",
    author: "1",
  },
];

// Type definions (schema)
const typeDefs = `
    type Query {
      users(query: String): [User!]!
      me: User!
      posts(query: String): [Post!]!
      comments: [Comment!]!
    }

    type User {
      id: ID!
      name: String!
      email: String!
      age: Int
      posts: [Post!]!
      comments: [Comment!]!
    }

    type Post {
      id: ID!
      title: String!
      body: String!
      published: Boolean!
      author: User!
    }
    type Comment {
      id: ID!
      text: String!
      author: User!
    }
`;

// Resolvers
const resolvers = {
  Query: {
    users(parent, { query }, ctx, info) {
      if (!query) {
        return users;
      }

      return users.filter((user) => {
        return user.name.toLowerCase().includes(query.toLowerCase());
      });
    },
    me() {
      return {
        id: "123098",
        name: "Mike",
        email: "mike@gmail.com",
        age: null,
      };
    },
    posts(parent, { query }, ctx, info) {
      if (!query) {
        return posts;
      }

      return posts.filter((post) => {
        return (
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.body.toLowerCase().includes(query.toLowerCase())
        );
      });
    },
    comments(parent, args, ctx, info) {
      return comments;
    },
  },
  Post: {
    author({ author }, args, ctx, info) {
      return users.find((user) => {
        return user.id === author;
      });
    },
  },
  User: {
    posts({ id }, args, ctx, info) {
      return posts.filter((post) => {
        return post.author == id;
      });
    },
    comments({ id }, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.author === id;
      });
    },
  },
  Comment: {
    author({ author }, args, ctx, info) {
      return users.find((user) => {
        return user.id === author;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is up!");
});
