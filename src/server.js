import express from "express";
import session from "express-session";
import MongoStore from "connect-mongo";
import passport from "passport";
import { logger } from "./logs/logger.js";
import { options } from "./config/config.js";
import { apiRouter } from "./routes/index.routes.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: options.mongo.url,
      ttl: 600, // 10 minutes in seconds
    }),
    secret: options.server.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 600000, // 10 minutes
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use("/api", apiRouter);

const PORT = options.server.PORT;

const server = app.listen(PORT, () => {
  logger.info(
    `Server running on http://localhost:${PORT}, instance ${process.pid}. Ready to accept requests.`
  );
});
server.on("error", (error) =>
  logger.error(`There was an error on the server at port ${PORT}: ${error}.`)
);

export { app };
