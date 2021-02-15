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

const db = {
  users,
  posts,
  comments,
};

export { db as default };
