const Post = {
  author({ author }, args, { db }, info) {
    return db.users.find((user) => {
      return user.id === author;
    });
  },
  comments({ id }, args, { db }, info) {
    return db.comments.filter((comment) => {
      return comment.post === id;
    });
  },
};

export default Post;
