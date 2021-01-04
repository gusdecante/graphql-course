const Query = {
  users(parent, { query }, { db }, info) {
    if (!query) {
      return db.users;
    }

    return db.users.filter((user) => {
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
  posts(parent, { query }, { db }, info) {
    if (!query) {
      return db.posts;
    }

    return db.posts.filter((post) => {
      return (
        post.title.toLowerCase().includes(query.toLowerCase()) ||
        post.body.toLowerCase().includes(query.toLowerCase())
      );
    });
  },
  comments(parent, args, { db }, info) {
    return db.comments;
  },
};

export default Query