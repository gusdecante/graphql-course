import { GraphQLServer } from "graphql-yoga";
import { v4 } from "uuid";

//Scalar types - String, Boolean, Int, Float, ID

// Demo user data
let users = [
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
let posts = [
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
let comments = [
  {
    id: "1",
    text: "Very good!!!",
    author: "1",
    post: "1",
  },
  {
    id: "2",
    text: "Amazing text, you should write more!!!",
    author: "2",
    post: "2",
  },
  {
    id: "3",
    text: "Cool, I understand everything!!!",
    author: "3",
    post: "3",
  },
  {
    id: "4",
    text: "I'm very satisfied!!!",
    author: "1",
    post: "4",
  },
  {
    id: "5",
    text: "I'm very satisfied!!!",
    author: "1",
    post: "4",
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


    type Mutation {
      createUser(data: CreateUserInput!): User!
      deleteUser(id: ID!): User!
      createPost(post: createPostInput!): Post!
      deletePost(id: ID!): Post!
      createComment(comment: createCommentInput!): Comment!
      deleteComment(id: ID!): Comment!
    }

    input CreateUserInput {
      name: String!
      email: String!
      age: Int
    }

    input createPostInput {
      title: String!
      body: String!
      published: Boolean!
      author: ID!
    }

    input createCommentInput {
      text: String!
      author: ID!,
      post: ID!
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
      comments: [Comment!]!
    }
    type Comment {
      id: ID!
      text: String!
      author: User!
      post: Post!
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
  Mutation: {
    createUser(parent, args, ctx, info) {
      const emailTaken = users.some((user) => user.email === args.data.email);

      if (emailTaken) {
        throw new Error("Email taken");
      }

      const user = {
        id: v4(),
        ...args.data,
      };

      users.push(user);

      return user;
    },
    deleteUser(parent, args, ctx, info) {
      const userIndex = users.findIndex((user) => user.id === args.id);

      if (userIndex === -1) {
        throw new Error("User not found");
      }

      const deletedUsers = users.splice(userIndex, 1);

      posts = posts.filter((post) => {
        const match = post.author === args.id;

        if (match) {
          comments = comments.filter((comment) => comment.author !== post.id);
        }

        return !match;
      });

      comments = comments.filter((comment) => comment.author !== args.id);

      return deletedUsers[0];
    },
    createPost(parent, args, ctx, info) {
      const userExists = users.some((user) => user.id === args.post.author);

      if (!userExists) {
        throw new Error("User not found");
      }

      const post = {
        id: v4(),
        ...args.post,
      };

      posts.push(post);

      return post;
    },
    deletePost(parent, args, ctx, info) {
      const postIndex = posts.findIndex((post) => post.id === args.id);

      if (postIndex === -1) {
        throw new Error("Post does not exist");
      }

      const deletedPosts = posts.splice(postIndex, 1);

      comments = comments.filter((comment) => comment.post !== args.id);

      return deletedPosts[0];
    },
    createComment(parent, args, ctx, info) {
      const userExist = users.some((user) => user.id === args.comment.author);
      const postExist = posts.some(
        (post) => post.id === args.comment.post && post.published
      );

      if (!userExist || !postExist) {
        throw new Error("User or post does not exist");
      }

      const comment = {
        id: v4(),
        ...args.comment,
      };

      comments.push(comment);

      return comment;
    },
    deleteComment(parent, args, ctx, info) {
      const commentIndex = comments.findIndex(
        (comment) => comment.id === args.id
      );

      if (commentIndex === -1) {
        throw new Error("Comment does not exist");
      }

      const deletedComment = comments.splice(commentIndex, 1);

      return deletedComment[0];
    },
  },
  Post: {
    author({ author }, args, ctx, info) {
      return users.find((user) => {
        return user.id === author;
      });
    },
    comments({ id }, args, ctx, info) {
      return comments.filter((comment) => {
        return comment.post === id;
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
    post(parent, args, ctx, info) {
      return posts.find((post) => {
        return post.id === parent.post;
      });
    },
  },
};

const server = new GraphQLServer({
  typeDefs,
  resolvers,
});

server.start(() => {
  console.log("The server is up on the port:4000");
});
