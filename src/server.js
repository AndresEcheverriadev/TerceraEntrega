import express from "express";
import { Server as IOServer } from "socket.io";
import { Server as HttpServer } from "http";
import session from "express-session";
import MongoStore from "connect-mongo";
import { config } from "./config/process.js";
import handlebars from "express-handlebars";
import passport from "passport";
import initializePassport from "./config/passport.js";
import { fork } from "child_process";
import { fileURLToPath } from "url";
import path, { dirname } from "path";
import cluster from "cluster";
import { cpus } from "os";
import { logger, ErrorLogger } from "./config/logger.js";
import { MongoDBService } from "./db/mongoDBService.js";
import { HandlerDBProductos } from "./db/mongoHandlerProducts.js";
import { HandlerDBCarts } from "./db/mongoHandlerCarts.js";
import { transporter, mailOptions } from "./config/mailer.js";
import multer from "multer";

MongoDBService.initMongoDB();
initializePassport();

// const modoCluster = process.argv[3] == "cluster";

// if (modoCluster && cluster.isPrimary) {
//   const numCPUs = cpus().length;

//   console.log(`Número de procesadores: ${numCPUs}`);
//   console.log(`PID MASTER ${process.pid}`);

//   for (let i = 0; i < numCPUs; i++) {
//     cluster.fork();
//   }

//   cluster.on("exit", (worker) => {
//     console.log(
//       "Worker",
//       worker.process.pid,
//       "died",
//       new Date().toLocaleString()
//     );
//     cluster.fork();
//   });
// } else {}

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);
const PORT = config.Port;
const advancedOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const Product = new HandlerDBProductos();
const Cart = new HandlerDBCarts();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

const upload = multer({ storage: storage });

let varUser = "";

function getVarUser(user) {
  return (varUser = user);
}

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../public")));

app.use(logger());

app.use(
  session({
    secret: process.env.SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.MONGOURL,
      mongoOptions: advancedOptions,
    }),
    ttl: 3600,
    resave: false,
    rolling: true,
    saveUninitialized: false,
    cookie: {
      httpOnly: false,
      secure: false,
      maxAge: 600000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.engine("handlebars", handlebars.engine());
app.set("views", path.join(__dirname, "../public/views"));
app.set("view engine", "handlebars");

app.post("/uploadfile", upload.single("archivo"), (req, res, next) => {
  const file = req.file;
  if (!file) {
    const error = new Error("Debes subir un archivo");
    error.httpStatusCode = 400;
    return next(error);
  }
  res.send(file);
});

app.get("/", (req, res) => {
  req.logger.info("peticion recibida al servidor");
  if (!req.session.user) return res.redirect("/login");
  res.redirect("/home");
});

app.get("/home", (req, res) => {
  req.logger.info("peticion recibida al servidor desde /home");
  req.session.contador++;
  getVarUser(req.user._id);
  res.render("vistaContenedor", { name: req.user.name });
});

app.get("/login", (req, res) => {
  req.logger.info("peticion recibida al servidor desde /login");
  if (req.session.user) {
    res.redirect("/home");
  } else {
    res.sendFile(path.join(__dirname, "../public/login.html"));
  }
});

app.post(
  "/login",
  passport.authenticate("login", { failureRedirect: "/loginfail" }),
  async (req, res) => {
    res.redirect("/home");
  }
);

app.get("/loginfail", (req, res) => {
  res.render("vistaError", { error: "Login failed" });
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});

app.post(
  "/register",
  passport.authenticate("register", { failureRedirect: "/registerfail" }),
  async (req, res) => {
    try {
      const info = await transporter.sendMail(mailOptions);
      WarnLogger.info("mail de registro enviado");
    } catch (error) {
      ErrorLogger.error("error en mail de registro");
    }
    res.redirect("/home");
  }
);

app.get("/registerfail", async (req, res) => {
  res.render("vistaError", { error: "Register failed" });
});

app.get("/logout", (req, res) => {
  req.logger.info("peticion recibida al servidor desde /logout");
  const email = req.session?.email;
  if (email) {
    req.session.destroy((err) => {
      if (!err) {
        res.render(path.join(__dirname, "../public/views/vistaLogout"), {
          email,
        });
      } else {
        res.redirect("/");
      }
    });
  } else {
    res.redirect("/");
  }
});

app.get("*", function (req, res) {
  req.logger.warn("peticion a una ruta inexistente");
  res.status(404).send("Esta página no existe");
});

io.on("connection", async (socket) => {
  socket.emit("products", await Product.listarTodo());
  socket.emit("carrito", await Cart.listarCarrito(varUser));

  socket.on("addToCart", async ({ idProducto }) => {
    const producto = parseInt(idProducto);
    const carrito = await Cart.agregarAlCarrito(producto, varUser);
    io.sockets.emit("carrito", await Cart.listarCarrito(varUser));
  });

  socket.on("removeFromCart", async ({ idProducto }) => {
    const producto = parseInt(idProducto);
    const carrito = await Cart.borrarDelCarrito(producto, varUser);
    io.sockets.emit("carrito", await Cart.listarCarrito(varUser));
  });

  socket.on("clearCart", async () => {
    const carritoNuevo = await Cart.borrarCarrito(varUser);
    io.sockets.emit("carrito", await Cart.listarCarrito(varUser));
  });
});

const server = httpServer.listen(process.env.PORT || PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});

server.on("error", (error) => {
  console.error(`Error en el servidor ${error}`);
});

console.log("args ->", process.argv.slice(2));

// andres@correox.cl
// 123456A
// benjamin@correox.cl
// 12345678B
// taskkill /f /im node.exe
// taskkill /f /im nginx.exe
// taskkill /f /im pm2.exe
// pm2 start ecosystem.config.cjs
// Name:	Noemi Feil
// Username:	noemi.feil@ethereal.email
// Password:	TQTNSbWZfZvbTe9bgV
