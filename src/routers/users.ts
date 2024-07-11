import express, { Request, Response } from "express";
import { App } from "../App";

const marketplace = new App();
export const routerUsers = express.Router();

routerUsers.get("/", (req: Request, res: Response) => {
  return res.status(200).json(marketplace.listUsers());
});
