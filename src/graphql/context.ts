import db from "../database";
import { IncomingMessage } from "http";
import Auth from "../services/auth";
import { getUserIdFromToken } from "../services/jwt";


export interface Context {
  auth: typeof Auth;
  db: typeof db;
  userId: string | null;
}

const createContext = async ({ req }: { req: IncomingMessage }) => {
  const userId = getUserIdFromToken(req.headers.authorization);
  return {
    auth: Auth,
    db,
    userId
  };
};

export default createContext;
