import { GraphQLResolveInfo } from 'graphql';
import { Cart as CartModel, CartItem as CartItemModel } from '@prisma/client';
import { GraphQLContext } from '../../src/app/api/route';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AddToCartInput = {
  cartId: Scalars['ID']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['String']['input'];
  image?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Int']['input'];
  quantity?: InputMaybe<Scalars['Int']['input']>;
};

export type Cart = {
  __typename?: 'Cart';
  id: Scalars['ID']['output'];
  items: Array<CartItem>;
  subTotal: Money;
  totalItems: Scalars['Int']['output'];
};

export type CartItem = {
  __typename?: 'CartItem';
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  image?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  quantity: Scalars['Int']['output'];
  totalPrice: Money;
  unitPrice: Money;
};

export type CheckoutSession = {
  __typename?: 'CheckoutSession';
  id: Scalars['ID']['output'];
  url?: Maybe<Scalars['String']['output']>;
};

export type CreateCheckoutSessionInput = {
  cartId: Scalars['ID']['input'];
};

export type DecreaseCartItemInput = {
  cartId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};

export type IncreaseCartItemInput = {
  cartId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};

export type Money = {
  __typename?: 'Money';
  amount: Scalars['Int']['output'];
  formatted: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addItem?: Maybe<Cart>;
  createCheckoutSession?: Maybe<CheckoutSession>;
  decreaseCartItem?: Maybe<Cart>;
  increaseCartItem?: Maybe<Cart>;
  removeItem?: Maybe<Cart>;
};


export type MutationAddItemArgs = {
  input: AddToCartInput;
};


export type MutationCreateCheckoutSessionArgs = {
  input: CreateCheckoutSessionInput;
};


export type MutationDecreaseCartItemArgs = {
  input: DecreaseCartItemInput;
};


export type MutationIncreaseCartItemArgs = {
  input: IncreaseCartItemInput;
};


export type MutationRemoveItemArgs = {
  input: RemoveFromCartInput;
};

export type Query = {
  __typename?: 'Query';
  cart?: Maybe<Cart>;
};


export type QueryCartArgs = {
  id: Scalars['ID']['input'];
};

export type RemoveFromCartInput = {
  cartId: Scalars['ID']['input'];
  id: Scalars['ID']['input'];
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AddToCartInput: AddToCartInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Cart: ResolverTypeWrapper<CartModel>;
  CartItem: ResolverTypeWrapper<CartItemModel>;
  CheckoutSession: ResolverTypeWrapper<CheckoutSession>;
  CreateCheckoutSessionInput: CreateCheckoutSessionInput;
  DecreaseCartItemInput: DecreaseCartItemInput;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  IncreaseCartItemInput: IncreaseCartItemInput;
  Int: ResolverTypeWrapper<Scalars['Int']['output']>;
  Money: ResolverTypeWrapper<Money>;
  Mutation: ResolverTypeWrapper<{}>;
  Query: ResolverTypeWrapper<{}>;
  RemoveFromCartInput: RemoveFromCartInput;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AddToCartInput: AddToCartInput;
  Boolean: Scalars['Boolean']['output'];
  Cart: CartModel;
  CartItem: CartItemModel;
  CheckoutSession: CheckoutSession;
  CreateCheckoutSessionInput: CreateCheckoutSessionInput;
  DecreaseCartItemInput: DecreaseCartItemInput;
  ID: Scalars['ID']['output'];
  IncreaseCartItemInput: IncreaseCartItemInput;
  Int: Scalars['Int']['output'];
  Money: Money;
  Mutation: {};
  Query: {};
  RemoveFromCartInput: RemoveFromCartInput;
  String: Scalars['String']['output'];
};

export type CartResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Cart'] = ResolversParentTypes['Cart']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  items?: Resolver<Array<ResolversTypes['CartItem']>, ParentType, ContextType>;
  subTotal?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  totalItems?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CartItemResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CartItem'] = ResolversParentTypes['CartItem']> = {
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  image?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  quantity?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  totalPrice?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  unitPrice?: Resolver<ResolversTypes['Money'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type CheckoutSessionResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['CheckoutSession'] = ResolversParentTypes['CheckoutSession']> = {
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  url?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MoneyResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Money'] = ResolversParentTypes['Money']> = {
  amount?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  formatted?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addItem?: Resolver<Maybe<ResolversTypes['Cart']>, ParentType, ContextType, RequireFields<MutationAddItemArgs, 'input'>>;
  createCheckoutSession?: Resolver<Maybe<ResolversTypes['CheckoutSession']>, ParentType, ContextType, RequireFields<MutationCreateCheckoutSessionArgs, 'input'>>;
  decreaseCartItem?: Resolver<Maybe<ResolversTypes['Cart']>, ParentType, ContextType, RequireFields<MutationDecreaseCartItemArgs, 'input'>>;
  increaseCartItem?: Resolver<Maybe<ResolversTypes['Cart']>, ParentType, ContextType, RequireFields<MutationIncreaseCartItemArgs, 'input'>>;
  removeItem?: Resolver<Maybe<ResolversTypes['Cart']>, ParentType, ContextType, RequireFields<MutationRemoveItemArgs, 'input'>>;
};

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  cart?: Resolver<Maybe<ResolversTypes['Cart']>, ParentType, ContextType, RequireFields<QueryCartArgs, 'id'>>;
};

export type Resolvers<ContextType = GraphQLContext> = {
  Cart?: CartResolvers<ContextType>;
  CartItem?: CartItemResolvers<ContextType>;
  CheckoutSession?: CheckoutSessionResolvers<ContextType>;
  Money?: MoneyResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
};

