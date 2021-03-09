import getUserId from "../utils/getUserId"

const Query = {
  users(parent, args , { prisma }, info) {
    const opArgs = {} //operation arguments

    if(args.query) {
      opArgs.where = {
        OR: [{
          name_contains: args.query
        }]
      }
    }

    return prisma.query.users(opArgs, info)
  },
  myPost(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)
    const opArgs = { 
      where: {
        author: {
          id: userId
        }
      }
    }

    if(args.query) {
      opArgs.where.OR =[{
        title_contains: args.query
      },
      {
        body_contains: args.query
      }]
    }

    if(!userId) {
      throw new Error('Unable to authenticate')
    }

    return prisma.query.posts(opArgs, info)
  },
  posts(parent, args , { prisma }, info) {
    const opArgs = {
      where: {
        published: true
      }
    } 

    if(args.query) {
      opArgs.where.OR = [{
          title_contains: args.query
        },{
          body_contains: args.query
      }]
    }

    return prisma.query.posts(opArgs, info)
  },
  comments(parent, args, { prisma }, info) {
    return prisma.query.comments(null, info);
  },
  async me(parent, args, { prisma, request }, info) {
    const userId = getUserId(request)

    if(!userId) {
      throw new Error('Authentication required')
    }

    const user = await prisma.query.user({ 
      where: {
        id: userId
      }
     }, info)
     
    return user
  },
  async post(parent, args, { prisma, request }, info) {
    const userId = getUserId(request, false)

    const posts = await prisma.query.posts({
      where: {
        id: args.id,
        OR: [{
          published: true
        }, {
          author: {
            id: userId
          }
        }]
      }
    }, info)

    if(posts.lenght === 0) {
      throw new Error('Post not found')
    }

    return posts[0]
  }
};

export default Query