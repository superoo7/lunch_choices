const express = require("express");
const rateLimit = require("express-rate-limit");
const path = require("path");
const { schema, resolvers } = require("./graphql");
const {
  addFoodsJson,
  addEatenJson,
  removeEatenJson,
  remindFood
} = require("./file");
const { sayAction, reportLunch } = require("./say");
const { cryptoPrice } = require("./cg");
const { GraphQLServer } = require("graphql-yoga");

const server = new GraphQLServer({
  typeDefs: schema,
  resolvers
});
server.start(
  {
    port: 3000,
    cors: true,
    endpoint: "/graphql",
    playground: "/graphql"
  },
  () => console.log("Server is running on http://localhost:3000")
);

const limiter = rateLimit({
  windowMs: 2 * 60 * 1000, // 1 minutes
  max: 200 // limit each IP to 120 requests per windowMs
});

server.express.use(limiter);
server.express.use(express.static(path.join(__dirname, "../dist")));
server.express.use(express.static(path.join(__dirname, "../files")));
