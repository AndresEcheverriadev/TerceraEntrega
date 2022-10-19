import dotenv from "dotenv";
import yargs from "yargs";
dotenv.config();

const yarg = yargs(process.argv.slice(2))
  .default({
    p: '',
    m: "cluster" ? "cluster" : "fork",
  })
  .alias({
    p: "PORT",
    m: "MODE",
  });

const args = yarg.argv;

const config = {
  Port: args.p || 8080,
  Mode: args.m,
};

export { config };
