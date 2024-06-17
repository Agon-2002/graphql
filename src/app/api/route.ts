import { PrismaClient } from "@prisma/client";
import { readFileSync } from "fs";
import { createSchema, createYoga } from "graphql-yoga";
import { join } from "path";

import { Resolvers } from "@/generated/graphql";

import { prisma } from "@/lib/prisma";

export type GraphQLContext = {
  prisma: PrismaClient;
};

export async function createContext(): Promise<GraphQLContext> {
  return {
    prisma,
  };
}

const typeDefs = readFileSync(join(process.cwd(), "schema.graphql"), {
  encoding: "utf-8",
});

const resolvers: Resolvers = {
  Query: {
    cart: (_, { id }) => ({ id, totalItems: 0 }),
  },
};

const { handleRequest } = createYoga({
  schema: createSchema({
    typeDefs,
    resolvers,
  }),

  graphqlEndpoint: "/api",
  context: createContext(),
  fetchAPI: { Response },
});

export {
  handleRequest as GET,
  handleRequest as POST,
  handleRequest as OPTIONS,
};
