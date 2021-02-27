import { v4 } from "uuid";

const Mutation = {
  async createUser(parent, args, { prisma }, info) {
    const emailTaken = await prisma.exists.User({ email: args.data.email })

    if (emailTaken) {
      throw new Error("Email taken");
    }

    return prisma.mutation.createUser({ data: args.data }, info)
  },
  async deleteUser(parent, args, { prisma }, info) {
    const userExists = await prisma.exists.User({id: args.id})

    if(!userExists) {
      throw new Error("User not found")
    }

    return prisma.mutation.deleteUser({ where: { id: args.id } }, info)
  },
  updateUser(parent, { id, data }, { db }, info) {
    const user = db.users.find((user) => user.id === id);

    if (!user) {
      throw new Error("User not found");
    }

    if (typeof data.email === "string") {
      const emailTaken = db.users.some((user) => user.email === data.email);

      if (emailTaken) {
        throw new Error("Email taken");
      }

      user.email = data.email;

      if (typeof data.name === "string") {
        user.name = data.name;
      }

      if (typeof data.age !== undefined) {
        user.age = data.age;
      }
    }

    return user;
  },
  createPost(parent, args, { db, pubsub }, info) {
    const userExists = db.users.some((user) => user.id === args.post.author);

    if (!userExists) {
      throw new Error("User not found");
    }

    const post = {
      id: v4(),
      ...args.post,
    };

    db.posts.push(post);
    if (args.post.published) {
      pubsub.publish(`post`, {
        post: {
          mutation: "CREATED",
          data: post,
        },
      });
    }

    return post;
  },
  deletePost(parent, args, { db, pubsub }, info) {
    const postIndex = db.posts.findIndex((post) => post.id === args.id);

    if (postIndex === -1) {
      throw new Error("Post does not exist");
    }

    const [post] = db.posts.splice(postIndex, 1);

    db.comments = db.comments.filter((comment) => comment.post !== args.id);

    if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "DELETED",
          data: post,
        },
      });
    }

    return post;
  },
  updatePost(parent, { id, data }, { db, pubsub }, info) {
    const post = db.posts.find((post) => post.id === id);
    const originalPost = { ...post };

    if (!post) {
      throw new Error("Post not found");
    }

    if (typeof data.title === "string") {
      post.title = data.title;
    }

    if (typeof data.body === "string") {
      post.body = data.body;
    }

    if (typeof data.published === "boolean") {
      post.published = data.published;

      if (originalPost.published && !post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "DELETED",
            data: originalPost,
          },
        });
      } else if (!originalPost.published && post.published) {
        pubsub.publish("post", {
          post: {
            mutation: "CREATED",
            data: post,
          },
        });
      }
    } else if (post.published) {
      pubsub.publish("post", {
        post: {
          mutation: "UPDATED",
          data: post,
        },
      });
    }

    return post;
  },
  createComment(parent, args, { db, pubsub }, info) {
    const userExist = db.users.some((user) => user.id === args.data.author);
    const postExist = db.posts.some(
      (post) => post.id === args.data.post && post.published
    );

    if (!userExist || !postExist) {
      throw new Error("User or post does not exist");
    }

    const comment = {
      id: v4(),
      ...args.data,
    };

    db.comments.push(comment);

    pubsub.publish(`comment ${args.data.post}`, {
      comment: {
        mutation: "CREATED",
        data: comment,
      },
    });

    return comment;
  },
  deleteComment(parent, args, { db, pubsub }, info) {
    const commentIndex = db.comments.findIndex(
      (comment) => comment.id === args.id
    );

    if (commentIndex === -1) {
      throw new Error("Comment does not exist");
    }

    const [comment] = db.comments.splice(commentIndex, 1);

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "DELETED",
        data: comment,
      },
    });

    console.log(comment.post);
    return comment;
  },
  updateComment(parent, { id, data }, { db, pubsub }, info) {
    const comment = db.comments.find((comment) => comment.id === id);

    if (!comment) {
      throw new Error("Comment not found");
    }

    if (typeof data.text === "string") {
      comment.text = data.text;
    }

    pubsub.publish(`comment ${comment.post}`, {
      comment: {
        mutation: "UPDATED",
        data: comment,
      },
    });

    return comment;
  },
};

export default Mutation;
