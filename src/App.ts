import { ModelUser } from "./models/User";
import { ModelAd } from "./models/Ad";
import { ModelReview } from "./models/Review";
import { ModelAuth } from "./models/Auth";
import { ModelReport } from "./models/Report";
import { ModelFavorite } from "./models/Favorite";
import { ModelDevice } from "./models/device";
import { DocAPI } from "./models/DocAPI";

export class App {
  users: ReadonlyArray<Readonly<ModelUser>> = [];
  ads: ReadonlyArray<Readonly<ModelAd>> = [];
  reviews: ReadonlyArray<Readonly<ModelReview>> = [];
  auth: ReadonlyArray<Readonly<ModelAuth>> = [];
  reports: ReadonlyArray<Readonly<ModelReport>> = [];
  favorites: ReadonlyArray<Readonly<ModelFavorite>> = [];
  devices: ReadonlyArray<Readonly<ModelDevice>> = [];

  getAuthByToken(token: ModelAuth["token"]) {
    const authFound = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });
    if (!!authFound) return authFound;
    else return null;
  }

  deleteDevices(token: ModelAuth["token"], idDevice: ModelDevice["idDevice"]) {
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      this.devices = this.devices.filter(function (device) {
        if (device.referenceKeyUser === auth.referenceKeyUser && device.idDevice === idDevice) return false;
        else return true;
      });
    } else console.log("Autenticazione non effettuata");
  }

  changeDeviceName(token: ModelAuth["token"], deviceName: ModelDevice["deviceName"], idDevice: ModelDevice["idDevice"]) {
    const auth = this.getAuthByToken(token);
    const device = this.devices.find(function (device) {
      if (device.referenceKeyUser === auth?.referenceKeyUser && device.idDevice === idDevice) return true;
      else return false;
    });
    if (!!auth) {
      if (device?.referenceKeyUser === auth.referenceKeyUser && device?.idDevice === idDevice) {
        this.devices = this.devices.map(function (device) {
          if (device.referenceKeyUser === auth.referenceKeyUser && device.idDevice === idDevice) {
            return { ...device, deviceName: deviceName };
          } else return device;
        });
      } else console.log("Non è possibile modificare questo dispositivo");
    } else console.log("Autenticazione non effettuata");
  }

  registerDevices(token: ModelAuth["token"], idDevice: ModelDevice["idDevice"]) {
    const auth = this.getAuthByToken(token);
    const userDevices = this.devices.filter(function (device) {
      if (device.referenceKeyUser === auth?.referenceKeyUser) return true;
      else return false;
    });
    if (!!auth) {
      if (userDevices.length < 2) {
        const newDevice = new ModelDevice(auth.referenceKeyUser, idDevice);
        this.devices = [...this.devices, newDevice];
      } else console.log("Numero massimo di dispositivi raggiunto");
    } else console.log("Autenticazione non effettuata");
  }

  login(email: ModelUser["email"], password: ModelUser["password"], idDevice: ModelDevice["idDevice"]) {
    // Cerca nell'array users l'email e la password, se li trova permette l'accesso, altrimenti mostra un messaggio di errore
    const userFound = this.users.find(function (user) {
      return user.email === email && user.password === password;
    });

    if (!userFound) {
      console.log("Utente non registrato o password errata");
      return "Email or password invalid";
    }

    const authFound = this.auth.find(function (auth) {
      return auth.referenceKeyUser === userFound.primaryKeyUser;
    });

    if (authFound) {
      console.log("Utente già loggato");
      return "Already logged in";
    }

    const validDevice = this.devices.find(function (device) {
      return device.referenceKeyUser === userFound.primaryKeyUser && device.idDevice === idDevice;
    });

    if (!validDevice) {
      const userDevices = this.devices.filter(function (device) {
        return device.referenceKeyUser === userFound.primaryKeyUser;
      });

      if (userDevices.length >= 2) {
        console.log("Numero massimo di dispositivi raggiunto");
        return "Max number of devices reached";
      }

      const newDevice = new ModelDevice(userFound.primaryKeyUser, idDevice);
      this.devices = [...this.devices, newDevice];
    }

    const newAuth = new ModelAuth(userFound.primaryKeyUser);
    this.auth = [...this.auth, newAuth];
    console.log("Login effettuato con successo");
    return newAuth.token;
  }

  register(email: ModelUser["email"], password: ModelUser["password"]) {
    // Cerca nell'array users l'email, se lo trova mostra un messaggio di errore, altrimenti crea un nuovo utente
    const userFound = this.users.find(function (user) {
      if (user.email === email) return true;
      else return false;
    });

    if (!!userFound) return false;
    else {
      const newUser = new ModelUser(email, email, password);
      this.users = [...this.users, newUser];
      console.log(this.users);
      return true;
    }
  }

  logout(token: ModelAuth["token"]) {
    // Cerca nell'array auth il token, se lo trova cancella l'elemento, altrimenti mostra un messaggio di errore
    const authFound = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });
    if (!!authFound) {
      this.auth = this.auth.filter(function (auth) {
        if (auth.token === token) return false;
        else return true;
      });
      console.log("logout effettuato con successo");
      return true;
    } else console.log("token non valido");
    return false;
  }

  changeUsername(username: ModelUser["username"], token: ModelAuth["token"]) {
    // Cerca nell'array users l'id e il token, se lo trova permette di modificare l'username, altrimenti mostra un messaggio di errore
    const authFound = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });

    const userFound = this.users.find(function (user) {
      if (authFound?.referenceKeyUser === user.primaryKeyUser) return true;
      else return false;
    });

    this.users.map(function (user) {
      if (user.primaryKeyUser === userFound?.primaryKeyUser) return { ...user, username: username };
      else return user;
    });
  }

  deleteAccounts(token: ModelAuth["token"]) {
    // Cerca nell'array users l'id e il token, se lo trova cancella l'elemento, altrimenti mostra un messaggio di errore
    const authFound = this.getAuthByToken(token);

    if (!!authFound) {
      this.users = this.users.filter(function (user) {
        if (user.primaryKeyUser === authFound?.referenceKeyUser) return false;
        else return true;
      });
      this.auth = this.auth.filter(function (auth) {
        if (auth.referenceKeyUser === authFound?.referenceKeyUser) return false;
        else return true;
      });
      return true;
    } else return false;
  }

  createAds(
    token: ModelAuth["token"],
    title: string,
    description: string,
    price: number,
    status: string,
    urlPhoto: string,
    category: string,
    address: string,
    phone: number
  ) {
    // Permette a un user di creare un nuovo annuncio e lo aggiunge nell'array ads, impostando tutti i parametri richiesti
    const authFound = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });

    if (!!authFound) {
      const newAd = new ModelAd(title, description, price, authFound.referenceKeyUser, urlPhoto, status, category, address, phone);
      this.ads = [...this.ads, newAd];
      return newAd;
    } else return "Impossibile creare l'annuncio";
  }

  updateAds(
    referenceKeyAd: ModelAd["primaryKeyAd"],
    title: string,
    description: string,
    price: number,
    status: string,
    urlPhoto: string,
    category: string,
    address: string,
    phone: number,
    token: ModelAuth["token"]
  ) {
    // Cerca nell'array ads l'id, se lo trova permette di modificare i parametri dell'ad, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    let adFound = null;
    if (!!auth) {
      adFound = this.ads.find(function (ad) {
        if (ad.primaryKeyAd === referenceKeyAd) return true;
        else return false;
      });
    } else return "Autenticazione non effettuata";

    if (!!adFound) {
      const isUserOwner = auth?.referenceKeyUser === adFound.idOwner;

      if (isUserOwner) {
        this.ads = this.ads.map(function (ad) {
          if (ad.primaryKeyAd === referenceKeyAd)
            return {
              ...ad,
              title: title,
              description: description,
              price: price,
              status: status,
              urlPhoto: urlPhoto,
              category: category,
              address: address,
              phone: phone,
            };
          else return ad;
        });
        return "Annuncio modificato con successo";
      } else return "Non sei il proprietario dell'annuncio";
    } else return "Annuncio non trovato";
  }

  deleteAds(referenceKeyAd: ModelAd["primaryKeyAd"], token: ModelAuth["token"]) {
    // Cerca nell'array ads l'id, se lo trova cancella l'elemento, altrimenti mostra un messaggio di errore
    const auth: any = this.getAuthByToken(token);
    let adFound: any = null;
    if (!!auth) {
      adFound = this.ads.find(function (ad) {
        if (ad.primaryKeyAd === referenceKeyAd) return true;
        else return false;
      });
    } else console.log("Autenticazione non effettuata");

    if (!!adFound) {
      const isUserOwner = auth.referenceKeyUser === adFound.idOwner;

      if (isUserOwner) {
        this.ads = this.ads.filter(function (ad) {
          if (ad.primaryKeyAd === referenceKeyAd) return false;
          else return true;
        });
      } else console.log("Non sei il proprietario dell'annuncio");
    } else console.log("Annuncio non trovato");
  }

  markAsSold(referenceKeyAd: ModelAd["primaryKeyAd"], token: ModelAuth["token"], referenceKeyUserPurchase: number) {
    // Cerca nell'array ads l'id, se lo trova modifica la voce sold, altrimenti mostra un messaggio di errore
    const auth: any = this.getAuthByToken(token);
    let adFound: any = null;
    if (!!auth) {
      adFound = this.ads.find(function (ad) {
        if (ad.primaryKeyAd === referenceKeyAd) return true;
        else return false;
      });
    } else console.log("Autenticazione non effettuata");

    if (!!adFound) {
      const isUserOwner = auth.referenceKeyUser === adFound.idOwner;
      if (isUserOwner) {
        this.ads.map(function (ad) {
          if (ad.primaryKeyAd === referenceKeyAd)
            return {
              ...ad,

              referenceKeyUserPurchase: referenceKeyUserPurchase,
            };
          else return ad;
        });
      } else console.log("Non sei il proprietario dell'annuncio");
    } else console.log("Annuncio non trovato");
  }

  createReviews(title: string, rating: number, description: string, referenceKeyAd: ModelAd["primaryKeyAd"], token: ModelAuth["token"]) {
    // Permette a un user di recensire un annuncio e un utente lo aggiunge nell'array reviews
    const auth = this.getAuthByToken(token);

    const adFound = this.ads.find(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });

    if (!!auth) {
      if (!!adFound) {
        if (adFound.referenceKeyUserPurchase === auth.referenceKeyUser) {
          const newReview = new ModelReview(auth.referenceKeyUser, title, rating, description, referenceKeyAd);
          this.reviews = [...this.reviews, newReview];
        } else console.log("Solo chi acquisita il prodotto puo' creare una recensione");
      } else console.log("Annuncio non trovato");
    } else console.log("Autenticazione non effettuata");
  }

  updateReviews(referenceKeyReview: number, title: string, rating: number, description: string, token: ModelAuth["token"]) {
    // Cerca nell'array reviews l'id, se lo trova permette di modificare i parametri dell'annuncio, altrimenti mostra un messaggio di errore
    const auth: any = this.getAuthByToken(token);
    let reviewFound: any = null;
    if (!!auth) {
      reviewFound = this.reviews.find(function (review) {
        if (review.primaryKeyReview === referenceKeyReview) return true;
        else return false;
      });
    } else console.log("Autenticazione non effettuata");

    if (!!reviewFound) {
      const isUserOwner = auth.referenceKeyUser === reviewFound.referenceKeyUser;
      if (isUserOwner) {
        this.reviews.map(function (review) {
          if (review.primaryKeyReview === referenceKeyReview)
            return {
              ...review,
              title: title,
              rating: rating,
              description: description,
            };
          else return review;
        });
      } else console.log("Non sei il proprietario della recensione");
    } else console.log("Recensione non trovata");
  }

  deleteReviews(referenceKeyReview: number, token: ModelAuth["token"]) {
    // Cerca nell'array reviews l'id, se lo trova cancella l'elemento, altrimenti mostra un messaggio di errore
    const auth: any = this.getAuthByToken(token);
    let reviewFound: any = null;
    if (!!auth) {
      reviewFound = this.reviews.find(function (review) {
        if (review.primaryKeyReview === referenceKeyReview) return true;
        else return false;
      });
    } else console.log("Autenticazione non effettuata");

    if (!!reviewFound) {
      const isUserOwner = auth.referenceKeyUser === reviewFound.referenceKeyUser;
      if (isUserOwner) {
        this.reviews = this.reviews.filter(function (review) {
          if (review.primaryKeyReview === referenceKeyReview) return false;
          else return true;
        });
      } else console.log("Non sei il proprietario della recensione");
    } else console.log("Recensione non trovata");
  }

  createReports(referenceKeyAd: ModelAd["primaryKeyAd"], token: ModelAuth["token"], title: string, description: string) {
    // Permette a un user di creare un report e lo aggiunge nell'array reports
    const auth = this.getAuthByToken(token);
    const adFound = this.ads.find(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });

    if (!!auth) {
      if (!!adFound) {
        const newReport = new ModelReport(auth.referenceKeyUser, referenceKeyAd, title, description);
        this.reports = [...this.reports, newReport];
      } else console.log("Annuncio non trovato");
    } else console.log("Autenticazione non effettuata");
  }

  closeReports(referenceKeyReport: ModelReport["primaryKeyReport"], token: ModelAuth["token"]) {
    // Cerca nell'array reports l'id, se lo trova modifica la voce closed, altrimenti mostra un messaggio di errore
    const auth: any = this.getAuthByToken(token);
    let reportFound = null;
    if (!!auth) {
      reportFound = this.reports.find(function (report) {
        if (report.primaryKeyReport === referenceKeyReport) return true;
        else return false;
      });
    } else console.log("Autenticazione non effettuata");

    if (!!reportFound) {
      this.reports = this.reports.map(function (report) {
        if (reportFound.primaryKeyReport === report.primaryKeyReport)
          return {
            ...auth,
            closed: true,
          };
        else return auth;
      });
    } else console.log("Report non trovato");
  }

  listByCategory(category: string) {
    // Cerca nell'array ads la category, se la trova restituisce l'array filtrato, altrimenti restituisce un array vuoto
    return this.ads.filter(function (ad) {
      if (ad.category === category) return true;
      else return false;
    });
  }

  listUserFavorites(referenceKeyUser: ModelUser["primaryKeyUser"]) {
    // Cerca nell'array favorites l'id, se lo trova restituisce l'array filtrato, altrimenti restituisce un array vuoto
    return this.favorites.filter(function (favorite) {
      if (favorite.referenceKeyUser === referenceKeyUser) return true;
      else return false;
    });
  }

  createFavorites(referenceKeyAd: ModelAd["primaryKeyAd"], token: ModelAuth["token"]) {
    // Permette a un user di aggiungere un annuncio come preferito
    const authFound = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });

    const adFound = this.ads.find(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });

    if (!!authFound) {
      if (!!adFound) {
        const newFavorite = new ModelFavorite(authFound.referenceKeyUser, adFound.primaryKeyAd);
        this.favorites = [...this.favorites, newFavorite];
      } else console.log("Annuncio non trovato");
    } else console.log("Autenticazione non effettuata");
  }

  deleteFavorites(referenceKeyAd: ModelAd["primaryKeyAd"], token: ModelAuth["token"]) {
    // Cerca nell'array favorites l'id, se lo trova cancella l'elemento, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    let favoriteFound = null;
    if (!!auth) {
      favoriteFound = this.favorites.find(function (favorite) {
        if (favorite.referenceKeyAd === referenceKeyAd && favorite.referenceKeyUser === auth.referenceKeyUser) return true;
        else return false;
      });
    } else console.log("Autenticazione non effettuata");

    if (!!favoriteFound) {
      this.favorites = this.favorites.filter(function (favorite) {
        if (favoriteFound.primaryKeyFavorite === favorite.primaryKeyFavorite) return false;
        else return true;
      });
    } else console.log("Non puoi eliminare questo preferito");
  }

  showAdDetails(referenceKeyAd: ModelAd["primaryKeyAd"], token: ModelAuth["token"]) {
    // Cerca nell'array ads l'id, se lo trova mostra i dettagli dell'annuncio, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    return this.ads.filter(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });
  }

  listUserAds(referenceKeyUser: ModelUser["primaryKeyUser"]) {
    // Cerca nell'array ads gli id dell'user, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.ads.filter(function (ad) {
      if (ad.idOwner === referenceKeyUser) return true;
      else return false;
    });
  }

  listUserReviews(referenceKeyUser: ModelUser["primaryKeyUser"]) {
    // Cerca nell'array reviews gli id dell'user, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.reviews.filter(function (review) {
      if (review.referenceKeyUser === referenceKeyUser) return true;
      else return false;
    });
  }

  listUserSoldedAds(referenceKeyUser: ModelUser["primaryKeyUser"]) {
    // Cerca nell'array ads gli id dell'user con lo status sold, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.ads.filter(function (ad) {
      if (ad.idOwner === referenceKeyUser && ad.referenceKeyUserPurchase !== 0) return true;
      else return false;
    });
  }

  listUserBuyedAds(referenceKeyUser: ModelUser["primaryKeyUser"]) {
    // Cerca nell'array ads gli id dell'user con lo status sold, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.ads.filter(function (ad) {
      if (ad.referenceKeyUserPurchase === referenceKeyUser) return true;
      else return false;
    });
  }

  listAds() {
    return this.ads;
  }

  listUsers() {
    return this.users;
  }

  listFavorites() {
    return this.favorites;
  }

  listAuth() {
    return this.auth;
  }

  listReviews() {
    return this.reviews;
  }

  listDevices() {
    return this.devices;
  }
}

const apis = {
  login: new DocAPI("/auth/login", "POST", false),
  logut: new DocAPI("/auth/logout/{referenceKeyUser}", "DELETE", true),
  register: new DocAPI("/users/register", "POST", false),
  deleteAccount: new DocAPI("/users/{primaryKeyUser}", "DELETE", true),
  listAds: new DocAPI("/ads", "GET", false),
  listByCategory: new DocAPI("/ads?category=", "GET", true),
  adDetail: new DocAPI("/ads/{primaryKeyAd}", "GET", true),
  createAd: new DocAPI("/ads", "POST", true),
  updateAd: new DocAPI("/ads/{primaryKeyAd}", "PUT", true),
  deleteAd: new DocAPI("/ads/{primaryKeyAd}", "DELETE", true),
  listReviews: new DocAPI("/reviews", "GET", false),
  reviewDetail: new DocAPI("/reviews/{primaryKeyReview}", "GET", true),
  createReview: new DocAPI("/reviews", "POST", true),
  deleteReview: new DocAPI("/reviews/{primaryKeyReview}", "DELETE", true),
  listUserFavorites: new DocAPI("/users/{referenceKeyUser}/favorites", "GET", false),
  createFavorite: new DocAPI("/favorites", "POST", true),
  deleteFavorite: new DocAPI("/favorites/{primaryKeyFavorite}", "DELETE", true),
  listUsers: new DocAPI("/users", "GET", true),
  user: new DocAPI("/users/{primaryKeyUser}", "GET", true),
  UserDevices: new DocAPI("/devices", "GET", true),
  device: new DocAPI("/devices/{idDevice}", "GET", true),
  createDevice: new DocAPI("/devices", "POST", true),
  deleteDevice: new DocAPI("/devices/{idDevice}", "DELETE", true),
  changeDeviceName: new DocAPI("/devices/{idDevice}", "PUT", true),
  listUserAds: new DocAPI("/users/{idOwner}/ads", "GET", true),
  listUserReviews: new DocAPI("/users/{referenceKeyUser}/reviews", "GET", true),
  listUserSoldedAds: new DocAPI("/users/{idOwner}/{referenceKeyUserPurchase}", "GET", true),
  listUserBuyedAds: new DocAPI("/users/{referenceKeyUserPurchase}", "GET", true),
};
