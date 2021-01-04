const Comment = {
  author({ author }, args, { db }, info) {
    return db.users.find((user) => {
      return user.id === author;
    });
  },
  post(parent, args, { db }, info) {
    return db.posts.find((post) => {
      return post.id === parent.post;
    });
  },
};

export default Comment;
