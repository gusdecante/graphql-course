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
  async updateUser(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateUser({
      where: {
        id
      },
      data
    }, info)
  },
  async createPost(parent, args, { prisma }, info) {
     return prisma.mutation.createPost({
      data: {
        title: args.data.title,
        body: args.data.body,
        published: args.data.published, 
        author: {
          connect: {
            id: args.data.author
          }
        }
      }
    }, info)
  },
  async deletePost(parent, args, { prisma }, info) {
    return prisma.mutation.deletePost({ where: {id: args.id}}, info)
  },
  updatePost(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updatePost({
      where: {
        id
      },
      data
    }, info)
  },
  async createComment(parent, args, { prisma }, info) {
    return prisma.mutation.createComment({
      data: {
        text: args.data.text,
        author: {
          connect: {
            id: args.data.author
          }
        },
        post: {
            connect: {
              id: args.data.post
            }
        }
      }
    }, info)
  },
  async deleteComment(parent, { id }, { prisma }, info) {
    return prisma.mutation.deleteComment({
      where: { 
        id
      }
    }, info)
  },
  async updateComment(parent, { id, data }, { prisma }, info) {
    return prisma.mutation.updateComment({
      where: {
        id
      },
      data
    }, info)
  },
};

export default Mutation;
