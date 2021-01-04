const User = {
  posts({ id }, args, { db }, info) {
    return db.posts.filter((post) => {
      return post.author == id;
    });
  },
  comments({ id }, args, { db }, info) {
    return db.comments.filter((comment) => {
      return comment.author === id;
    });
  },
};

export default User;
