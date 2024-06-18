import { PrismaClient } from "@prisma/client";
import currencyFormatter from "currency-formatter";
import { readFileSync } from "fs";
import { createSchema, createYoga } from "graphql-yoga";
import { join } from "path";

import { Resolvers } from "@/generated/graphql";

import { findOrCreateCart } from "@/lib/cart";
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

const currencyCode = "EUR";

const resolvers: Resolvers = {
  Query: {
    cart: async (_, { id }, { prisma }) => {
      return await findOrCreateCart(prisma, id);
    },
  },
  Mutation: {
    addItem: async (_, { input }, { prisma }) => {
      const cart = await findOrCreateCart(prisma, input.cartId);

      await prisma.cartItem.upsert({
        create: {
          cartId: cart.id,
          id: input.id,
          name: input.name,
          description: input.description,
          image: input.image,
          price: input.price,
          quantity: input.quantity || 1,
        },
        update: {
          quantity: {
            increment: input.quantity || 1,
          },
        },
        where: {
          cartId_id: {
            id: input.id,
            cartId: cart.id,
          },
        },
      });

      return cart;
    },
    removeItem: async (_, { input }, { prisma }) => {
      const {cartId} = await prisma.cartItem.delete({
        where: {
          cartId_id: {
            id: input.id,
            cartId: input.cartId,
          },
        },
        select: {
          cartId: true
        }
      });
      return findOrCreateCart(prisma, cartId);
    },
    increaseCartItem:  async (_, { input }, { prisma }) => {
      const {cartId} = await prisma.cartItem.update({
        data: {
          quantity: {
            increment: 1
          }
        },
        where: {
          cartId_id: {
            id: input.id,
            cartId: input.cartId,
          }
        },
        select: {
          cartId: true
        }
      })
      return findOrCreateCart(prisma, cartId); 
    }
    
  },
  Cart: {
    items: async ({ id }, _, { prisma }) => {
      let items =
        (await prisma.cart
          .findUnique({
            where: { id },
          })
          .items()) ?? [];

      return items;
    },
    totalItems: async ({ id }, _, { prisma }) => {
      let items =
        (await prisma.cart
          .findUnique({
            where: { id },
          })
          .items()) ?? [];

      return items?.reduce((acc, item) => acc + item.quantity || 1, 0);
    },
    subTotal: async ({ id }, _, { prisma }) => {
      let items = await prisma.cart
        .findUnique({
          where: { id },
        })
        .items();

      const amount =
        items?.reduce(
          (acc, item) => acc + item.price * item.quantity || 0,
          0,
        ) ?? 0;

      return {
        formatted: currencyFormatter.format(amount / 100, {
          code: currencyCode,
        }),
        amount,
      };
    },
  },
  CartItem: {
    totalPrice: async ({ price, quantity }) => {
      return {
        formatted: currencyFormatter.format((price * quantity) / 100, {
          code: currencyCode,
        }),
        amount: price * quantity,
      };
    },
    unitPrice: async ({ price }) => {
      return {
        formatted: currencyFormatter.format(price / 100, {
          code: currencyCode,
        }),
        amount: price,
      };
    
    }
  }
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
