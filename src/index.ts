import express, { Request, Response } from "express";
import { App } from "./App";
// import { routerUsers } from "./routers/users";

const marketplace = new App();
const app = express();
const server = express.json();
const port = process.env.PORT || 3000;
const baseURL = process.env.BASE_URL || "http://localhost:";
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

app.get("/api/auth", (req: Request, res: Response) => {
  const authList = marketplace.listAuth();
  return res.status(200).json({ authList });
});

app.get("/api/ads", (req: Request, res: Response) => {
  const adsList = marketplace.listAds();
  return res.status(200).json({ adsList });
});

app.get("/api/devices", (req: Request, res: Response) => {
  const devicesList = marketplace.listDevices();
  return res.status(200).json({ devicesList });
});

app.patch("/api/users", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Missing token" });
  const username = req.body.username;
  if (!username) return res.status(400).json({ message: "Invalid username" });
  const success = marketplace.changeUsername(username, token);
  if (success) return res.status(200).json({ message: "success" });
  else return res.status(400).json({ message: "Error" });
});

app.patch("/api/devices", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Missing token" });
  const idDevice = req.body.idDevice;
  const deviceName = req.body.deviceName;
  if (!idDevice) return res.status(400).json({ message: "Invalid idDevice" });
  const success = marketplace.changeDeviceName(token, deviceName, idDevice);
  if (success) return res.status(200).json({ message: "success" });
  else return res.status(400).json({ message: "Error" });
});

app.post("/api/devices", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Missing token" });
  const idDevice = req.body.idDevice;
  if (!idDevice) return res.status(400).json({ message: "Invalid idDevice" });
  const success = marketplace.registerDevices(token, idDevice);
  if (success) return res.status(200).json({ message: "success" });
  else return res.status(400).json({ message: "Error" });
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

app.delete("/api/devices", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  const idDevice = req.body.idDevice;
  console.log(idDevice);
  console.log(token);
  if (!idDevice) return res.status(400).json({ message: "Missing idDevice" });
  if (!token) return res.status(400).json({ message: "Missing token" });
  const success = marketplace.deleteDevices(token, idDevice);
  if (success) return res.status(200).json({ message: "delete success" });
  else return res.status(400).json({ message: "Error delete" });
});

app.delete("/api/ads/:primaryKeyAd", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Missing token" });
  const primaryKeyAd = req.params.primaryKeyAd;
  if (!primaryKeyAd) return res.status(400).json({ message: "Missing primaryKeyAd" });
  const success = marketplace.deleteAds(primaryKeyAd, token);
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

app.get("/api/auth/logout", (req: Request, res: Response) => {
  const token = req.headers.authorization;
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
  const primaryKeyAd = req.params.primaryKeyAd;
  const token = req.headers.authorization;
  const referenceKeyUserPurchase = req.body.referenceKeyUserPurchase;
  if (!token) return res.status(400).json({ message: "Missing token" });
  if (!primaryKeyAd) return res.status(400).json({ message: "Missing primaryKeyAd" });
  if (!referenceKeyUserPurchase) return res.status(400).json({ message: "Missing referenceKeyUserPurchase" });
  const success = marketplace.markAsSold(primaryKeyAd, token, referenceKeyUserPurchase);
  if (success) return res.status(200).json({ message: "purchase success" });
  else return res.status(400).json({ message: "Error purchase" });
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
  const favoritesList = marketplace.listUserFavorites(referenceKeyUser);
  return res.status(200).json({ favoritesList });
});

app.post("/api/ads/:primaryKeyAd/reviews", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Missing token" });
  const title = req.body.title;
  const description = req.body.description;
  const rating = req.body.rating;
  const referenceKeyAd = req.params.primaryKeyAd;
  if (!title) return res.status(400).json({ message: "Missing title" });
  if (!description) return res.status(400).json({ message: "Missing description" });
  if (!rating) return res.status(400).json({ message: "Missing rating" });
  if (!referenceKeyAd) return res.status(400).json({ message: "Missing referenceKeyAd" });
  const success = marketplace.createReviews(title, rating, description, referenceKeyAd, token);
  if (success) return res.status(200).json({ message: "success" });
  else return res.status(400).json({ message: "createReviews failed" });
});

app.get("/api/reviews", (req: Request, res: Response) => {
  const reviewsList = marketplace.listReviews();
  return res.status(200).json({ reviewsList });
});

app.put("/api/reviews/:primaryKeyReview", (req: Request, res: Response) => {
  const primaryKeyReview = req.params.primaryKeyReview;
  const title = req.body.title;
  const description = req.body.description;
  const rating = req.body.rating;
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Missing token" });
  if (!primaryKeyReview) return res.status(400).json({ message: "Missing primaryKeyReview" });
  if (!title) return res.status(400).json({ message: "Missing title" });
  if (!description) return res.status(400).json({ message: "Missing description" });
  if (!rating) return res.status(400).json({ message: "Missing rating" });
  const success = marketplace.updateReviews(primaryKeyReview, title, rating, description, token);
  if (success) return res.status(200).json({ message: "success" });
  else return res.status(400).json({ message: "updateReviews failed" });
});

app.delete("/api/reviews/:primaryKeyReview", (req: Request, res: Response) => {
  const primaryKeyReview = req.params.primaryKeyReview;
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Missing token" });
  if (!primaryKeyReview) return res.status(400).json({ message: "Missing primaryKeyReview" });
  const success = marketplace.deleteReviews(primaryKeyReview, token);
  if (success) return res.status(200).json({ message: "delete success" });
  else return res.status(400).json({ message: "delete failed" });
});

app.get("/api/reports", (req: Request, res: Response) => {
  const reportsList = marketplace.listReports();
  return res.status(200).json({ reportsList });
});

app.post("/api/ads/:primaryKeyAd/reports", (req: Request, res: Response) => {
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Missing token" });
  const referenceKeyAd = req.params.primaryKeyAd;
  const title = req.body.title;
  const description = req.body.description;
  if (!title) return res.status(400).json({ message: "Missing title" });
  if (!description) return res.status(400).json({ message: "Missing description" });
  if (!referenceKeyAd) return res.status(400).json({ message: "Missing referenceKeyAd" });
  const success = marketplace.createReports(referenceKeyAd, token, title, description);
  if (success) return res.status(200).json({ message: "success" });
  else return res.status(400).json({ message: "createReports failed" });
});

app.put("/api/reports/:primaryKeyReport", (req: Request, res: Response) => {
  const primaryKeyReport = req.params.primaryKeyReport;
  const token = req.headers.authorization;
  if (!token) return res.status(400).json({ message: "Missing token" });
  if (!primaryKeyReport) return res.status(400).json({ message: "Missing primaryKeyReport" });
  const success = marketplace.closeReports(primaryKeyReport, token);
  if (success) return res.status(200).json({ message: "success" });
  else return res.status(400).json({ message: "updateReports failed" });
});

app.get("/api/ads/:category", (req: Request, res: Response) => {
  const category = req.params.category;

  if (!category) return res.status(400).json({ message: "Missing category" });
  const adsList = marketplace.listByCategory(category);
  if (!!adsList) return res.status(200).json({ adsList });
  else return res.status(400).json({ message: "No ads found" });
});

app.get("/api/users/:primaryKeyUser/favorites", (req: Request, res: Response) => {
  const primaryKeyUser = req.params.primaryKeyUser;
  if (!primaryKeyUser) return res.status(400).json({ message: "Missing primaryKeyUser" });
  const favoritesList = marketplace.listUserFavorites(primaryKeyUser);
  if (!!favoritesList) return res.status(200).json({ favoritesList });
  else return res.status(400).json({ message: "No favorites found" });
});

app.listen(3000, () => {
  console.log("Server running on `http://localhost:3000`");
});
