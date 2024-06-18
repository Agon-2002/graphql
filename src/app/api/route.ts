import { PrismaClient } from "@prisma/client";
import currencyFormatter from "currency-formatter";
import { readFileSync } from "fs";
import { createSchema, createYoga } from "graphql-yoga";

import { join } from "path";

import { Resolvers } from "@/generated/graphql";

import { findOrCreateCart } from "@/lib/cart";
import { prisma } from "@/lib/prisma";
import { GraphQLError } from "graphql";
import { stripe } from "@/lib/stripe";

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
    },
    decreaseCartItem:  async (_, { input }, { prisma }) => {
      const {cartId, quantity} = await prisma.cartItem.update({
        data: {
          quantity: {
            decrement: 1
          }
        },
        where: {
          cartId_id: {
            id: input.id,
            cartId: input.cartId,
          }
        },
        select: {
          cartId: true,
          quantity: true
        }
      })
      if (quantity <= 0) {
        await prisma.cartItem.delete({
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
      }

      return findOrCreateCart(prisma, cartId); 
    },
    createCheckoutSession: async (_, { input }, { prisma }) => {
      const {cartId} = input;
      const cart = await prisma.cart.findUnique({
        where: {
          id: cartId
        }
      })
      
      if(!cart) {
        throw new GraphQLError('Cart not found');
      }
      
      const cartItems = await prisma.cart.findUnique({
        where: {
          id: cartId
        },
      }).items()
      
      if(!cartItems || cartItems.length === 0) {
        throw new GraphQLError('Cart is empty');
      }

      const total_items = cartItems.map(item => ({
        quantity: item.quantity,
        price_data: {
          currency: currencyCode,
          unit_amount: item.price,
          product_data: {
            name: item.name,
            description: item.description || undefined, 
            images: item.image ? [item.image] : undefined
          }
        }})
      )
      
      const session = await stripe.checkout.sessions.create({
        line_items: total_items,
        mode: 'payment',
        metadata: {
          cartId: cart.id
        },
        success_url: "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "http://localhost:3000/cart?cancelled=true",
      })
      return {
        id: session.id,
        url: session.url
      }
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
