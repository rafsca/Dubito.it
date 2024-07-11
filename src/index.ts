import express, { Request, Response } from "express";
import { App } from "./App";
// import { routerUsers } from "./routers/users";

const marketplace = new App();
const app = express();
const server = express.json();
// const routerApi = express.Router();

app.use(server);

// routerApi.use("/users", routerUsers);

// app.use("/api", routerApi);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

app.get("/api/users", (req: Request, res: Response) => {
  const usersList = marketplace.listUsers();
  return res.status(200).json(usersList);
});

app.get("/api/ads", (req: Request, res: Response) => {
  const adsList = marketplace.listAds();
  return res.status(200).json({ adsList });
});

app.get("/api/devices", (req: Request, res: Response) => {
  const devicesList = marketplace.listDevices();
  return res.status(200).json({ devicesList });
});

app.post("/api/auth/register", (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  if (!email) return res.status(400).json({ message: "Missing email" });
  if (!password) return res.status(400).json({ message: "Missing password" });
  const success = marketplace.register(email, password);
  if (success) return res.status(200).json({ message: "register success" });
  else return res.status(400).json({ message: "Email already exists" });
});

app.delete("/api/users", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Missing token" });
  const success = marketplace.deleteAccounts(token);
  if (success) return res.status(200).json({ message: "delete success" });
  else return res.status(400).json({ message: "Error delete" });
});

app.post("/api/auth/login", (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;
  const idDevice = req.body.idDevice;
  if (!email) return res.status(400).json({ message: "Missing email" });
  if (!password) return res.status(400).json({ message: "Missing password" });
  const success = marketplace.login(email, password, idDevice);
  if (success) return res.status(200).json({ message: success });
  else return res.status(400).json({ message: "Email or password invalid" });
});

app.post("/api/auth/logout", (req: Request, res: Response) => {
  const token = req.body.token;
  if (!token) return res.status(400).json({ message: "Missing idDevice" });
  const success = marketplace.logout(token);
  if (success) return res.status(200).json({ message: "logout success" });
  else return res.status(400).json({ message: "Error logout" });
});

app.get("/api/ads", (req: Request, res: Response) => {
  const adsList = marketplace.listAds();
  return res.status(200).json({ adsList });
});

app.put("/api/ads/:primaryKeyAd", (req: Request, res: Response) => {
  console.log("Request received with params:", req.params);
  console.log("Request received with body:", req.body);
  console.log("Request received with headers:", req.headers);

  const primaryKeyAd = req.params.primaryKeyAd;
  const token = req.headers.authorization;
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const stato = req.body.stato;
  const urlPhoto = req.body.urlPhoto;
  const category = req.body.category;
  const address = req.body.address;
  const phone = req.body.phone;

  if (!token) {
    console.log("Missing token");
    return res.status(400).json({ message: "Missing token" });
  }
  if (!primaryKeyAd) {
    console.log("Missing primaryKeyAd");
    return res.status(400).json({ message: "Missing primaryKeyAd" });
  }

  const success = marketplace.updateAds(primaryKeyAd, title, description, price, stato, urlPhoto, category, address, phone, token);

  if (!!success) {
    console.log("Update success");
    return res.status(200).json(success);
  }
});

app.post("/api/ads", (req: Request, res: Response) => {
  const title = req.body.title;
  const description = req.body.description;
  const price = req.body.price;
  const stato = req.body.stato;
  const urlPhoto = req.body.urlPhoto;
  const category = req.body.category;
  const address = req.body.address;
  const phone = req.body.phone;
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Missing token" });
  if (!title) return res.status(400).json({ message: "Missing title" });
  if (!description) return res.status(400).json({ message: "Missing description" });
  if (!price) return res.status(400).json({ message: "Missing price" });
  if (!stato) return res.status(400).json({ message: "Missing stato" });
  if (!urlPhoto) return res.status(400).json({ message: "Missing urlPhoto" });
  if (!category) return res.status(400).json({ message: "Missing category" });
  if (!address) return res.status(400).json({ message: "Missing address" });
  if (!phone) return res.status(400).json({ message: "Missing phone" });
  const success = marketplace.createAds(token, title, description, price, stato, urlPhoto, category, address, phone);
  if (success) return res.status(200).json({ success });
  else return res.status(400).json({ message: "createAd failed" });
});

app.get("/api/users/{referenceKeyUser}/favorites", (req: Request, res: Response) => {
  const referenceKeyUser = req.params.referenceKeyUser;
  const favoritesList = marketplace.listUserFavorites(Number(referenceKeyUser));
  return res.status(200).json({ favoritesList });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
