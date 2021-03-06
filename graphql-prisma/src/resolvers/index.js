import { extractFragmentReplacements } from "prisma-binding"
import Query from "./Query";
import Mutation from "./Mutation";
import User from "./User";
import Comment from "./Comment";
import Post from "./Post";
import Subscription from "./Subscription";


const resolvers = {
    Query,
    Mutation,
    Subscription,
    User,
    Post,
    Comment,
}

const fragmentReplacements = extractFragmentReplacements(resolvers)

export { resolvers, fragmentReplacements }