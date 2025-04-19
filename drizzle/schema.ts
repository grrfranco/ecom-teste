import { pgTable, foreignKey, pgEnum, text, uuid, varchar, integer, timestamp, numeric, unique, boolean, json, primaryKey } from "drizzle-orm/pg-core"
  import { sql } from "drizzle-orm"

export const factorType = pgEnum("factor_type", ['phone', 'webauthn', 'totp'])
export const factorStatus = pgEnum("factor_status", ['verified', 'unverified'])
export const aalLevel = pgEnum("aal_level", ['aal3', 'aal2', 'aal1'])
export const codeChallengeMethod = pgEnum("code_challenge_method", ['plain', 's256'])
export const oneTimeTokenType = pgEnum("one_time_token_type", ['phone_change_token', 'email_change_token_current', 'email_change_token_new', 'recovery_token', 'reauthentication_token', 'confirmation_token'])
export const equalityOp = pgEnum("equality_op", ['in', 'gte', 'gt', 'lte', 'lt', 'neq', 'eq'])
export const action = pgEnum("action", ['ERROR', 'TRUNCATE', 'DELETE', 'UPDATE', 'INSERT'])


export const address = pgTable("address", {
	id: text("id").primaryKey().notNull(),
	city: text("city"),
	country: text("country"),
	line1: text("line1"),
	line2: text("line2"),
	postalCode: text("postal_code"),
	state: text("state"),
	userProfileId: uuid("userProfileId").references(() => profiles.id, { onDelete: "cascade" } ),
});

export const collections = pgTable("collections", {
	id: text("id").primaryKey().notNull(),
	label: varchar("label", { length: 255 }).notNull(),
	slug: varchar("slug", { length: 255 }).notNull(),
	title: varchar("title", { length: 255 }).notNull(),
	description: varchar("description").notNull(),
	order: integer("order"),
	featuredImageId: text("featured_image_id").notNull().references(() => medias.id, { onDelete: "restrict" } ).references(() => medias.id),
});

export const comments = pgTable("comments", {
	id: text("id").primaryKey().notNull(),
	productId: text("productId").notNull(),
	profileId: uuid("profileId").notNull().references(() => profiles.id, { onDelete: "cascade", onUpdate: "cascade" } ).references(() => profiles.id),
	comment: text("comment").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const medias = pgTable("medias", {
	id: text("id").primaryKey().notNull(),
	key: varchar("key", { length: 255 }).notNull(),
	alt: varchar("alt", { length: 255 }).notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { mode: 'string' }).defaultNow(),
});

export const orders = pgTable("orders", {
	id: text("id").primaryKey().notNull(),
	amount: numeric("amount", { precision: 8, scale:  2 }).notNull(),
	currency: text("currency").notNull(),
	email: text("email"),
	name: text("name"),
	userId: uuid("user_id").references(() => profiles.id).references(() => profiles.id),
	orderStatus: text("order_status"),
	addressId: text("addressId"),
	stripePaymentIntentId: text("stripe_payment_intent_id"),
	paymentStatus: text("payment_status").notNull(),
	paymentMethod: text("payment_method"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const productMedias = pgTable("product_medias", {
	id: text("id").primaryKey().notNull(),
	productId: text("productId").notNull(),
	mediaId: text("mediaId").notNull().references(() => medias.id, { onDelete: "cascade", onUpdate: "cascade" } ).references(() => medias.id, { onDelete: "cascade" } ),
	priority: integer("priority"),
});

export const products = pgTable("products", {
	id: uuid("id").defaultRandom().primaryKey().notNull(),
	name: varchar("name", { length: 191 }).notNull(),
	slug: varchar("slug", { length: 191 }).notNull(),
	description: text("description"),
	featured: boolean("featured").default(false).notNull(),
	badge: text("badge"),
	rating: numeric("rating", { precision: 2, scale:  1 }).default('4').notNull(),
	tags: json("tags").default([]).notNull(),
	images: json("images").default([]).notNull(),
	price: numeric("price", { precision: 8, scale:  2 }).default('0.00').notNull(),
	totalComments: integer("totalComments").default(0).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	stock: integer("stock").default(8),
	collectionId: text("collection_id"),
	featuredImageId: text("featured_image_id"),
},
(table) => {
	return {
		productsIdKey: unique("products_id_key").on(table.id),
		productsSlugUnique: unique("products_slug_unique").on(table.slug),
	}
});

export const profiles = pgTable("profiles", {
	id: uuid("id").primaryKey().notNull(),
	name: text("name"),
	isAdmin: boolean("is_admin"),
	email: text("email"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		profilesEmailUnique: unique("profiles_email_unique").on(table.email),
	}
});

export const orderLines = pgTable("order_lines", {
	id: text("id").primaryKey().notNull(),
	productId: text("product_id").notNull(),
	orderId: text("orderId").notNull().references(() => orders.id, { onDelete: "restrict" } ).references(() => orders.id, { onDelete: "restrict", onUpdate: "cascade" } ),
	quantity: integer("quantity").notNull(),
	price: numeric("price", { precision: 8, scale:  2 }).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
});

export const wishlist = pgTable("wishlist", {
	productId: text("product_id").notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		userWishlistPk: primaryKey({ columns: [table.productId, table.userId], name: "user_wishlist_pk"})
	}
});

export const carts = pgTable("carts", {
	quantity: integer("quantity").notNull(),
	productId: text("product_id").notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
},
(table) => {
	return {
		userPoductCartId: primaryKey({ columns: [table.productId, table.userId], name: "user_poduct_cart_id"})
	}
});