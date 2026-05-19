require("dotenv").config();
const express = require("express");
const { ApolloServer } = require("@apollo/server");
const { expressMiddleware } = require("@as-integrations/express5");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

const authRoutes = require("./src/rest/routes/auth.routes");
const { typeDefs, resolvers } = require("./src/graphql/schema");

app.use(cors());
app.use(express.json());

app.use("/auth", authRoutes);

async function start() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  await server.start();

  app.use(
    "/graphql",
    cors(),
    bodyParser.json(),
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    })
  );

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`🚀 Gateway running on http://localhost:${PORT}`)
  );
}

start().catch((err) => {
  console.error("Failed to start gateway:", err);
  process.exit(1);
});