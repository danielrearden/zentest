import originalBodyParser from "body-parser";
import { Handler } from "../types.js";

// See: https://restana.21no.de/#/?id=errorhandler-not-being-called
export const bodyParser: Handler = (req, res, next) => {
  return new Promise((resolve) => {
    originalBodyParser.json()(req, res, (err) => {
      return resolve(next(err));
    });
  });
};
