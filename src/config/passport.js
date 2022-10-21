import passport from "passport";
import local from "passport-local";
import {usersModel} from "../db/dbModels.js";
import { createHash, isValidPassword } from "./bcrypt.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        try {
          const { name,direccion,edad,telefono,foto,prefijo } = req.body;
          if (!name || !email || !password ) return done(null, false);
          let exists = await usersModel.findOne({ email: email });
          if (exists) return done(null, false);
          let result = await usersModel.create({
            name,
            email,
            password: createHash(password),
            direccion,
            edad,
            telefono,
            prefijo,
            foto
          });
          return done(null, result);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        try {
          if (!email || !password)
            return res
              .status(400)
              .send({ status: "error", error: "Credenciales inválidas" })
              .done(null, false);
          let user = await usersModel.findOne({ email: email });
          if (!user)
            return res
              .status(400)
              .send({ status: "error", error: "Usuario no existe" })
              .done(null, false);
          if (!isValidPassword(user, password))
            return res
              .status(400)
              .send({ status: "error", error: "Password Incorrecto" })
              .done(null, false);
          return done(null, user);
        } catch (error) {
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let result = await usersModel.findOne({ _id: id });
    return done(null, result);
  });
};

export default initializePassport;
