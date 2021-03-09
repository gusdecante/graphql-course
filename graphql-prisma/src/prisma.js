import { Prisma } from 'prisma-binding'
import { fragmentReplacements } from "./resolvers/index"

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466',
    secret: "thisismysupersecrettext",
    fragmentReplacements
})



export { prisma as default }

// prisma.exists.Comment({
//     id: "ckku2b7dt00yd0825aozipq8f"
// }).then((exists) => {
//     console.log(exists)
// })


// const createPostForUser = async (authorId, data) => {
//     const userExists = await prisma.exists.User({
//         id: authorId
//     })

//     if(!userExists) {
//         throw new Error("User not found")
//     }

//     const post = await prisma.mutation.createPost({
//         data: {
//             ...data,
//             author: {
//                 connect: {
//                     id: authorId
//                 }
//             }
//         }
//     }, '{ author { id name email posts { id title published } } }');
//     return post
// }


// const updatePostForUser = async (postId, data) => {
//     const postExists = await prisma.exists.Post({ id: postId })

//     if(!postExists) {
//         throw new Error("Post does not exist")
//     }

//     const post = await prisma.mutation.updatePost({
//         data: {
//             ...data
//         }, 
//         where: {
//             id: postId
//         }
//     }, "{  author { id name email posts { id title published } } }") 
//     return post.author
// }

// updatePostForUser("ckku0wp0c00di0825p5rthoek", {
//     published: true, 
//     title: "Typescript in 3 steps"
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })


// createPostForUser("ckku2b7n200ye0825jb138jku", {
//     title: "Great books to read",
//     body: "The war of art",
//     published: true
// }).then((user) => {
//     console.log(JSON.stringify(user, undefined, 2))
// }).catch((error) => {
//     console.log(error.message)
// })

