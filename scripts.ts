class ModelUser {
  primaryKeyUser: number;
  username: string;
  email: string;
  password: string;

  constructor(username: string, email: string, password: string) {
    this.primaryKeyUser = Math.random();
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

class ModelAd {
  primaryKeyAd: number;
  title: string;
  description: string;
  price: number;
  createdAt: Date;
  idOwner: ModelUser["primaryKeyUser"];
  urlPhoto: string;
  status: string;
  referenceKeyUserPurchase: ModelUser["primaryKeyUser"];
  category: string;
  address: string;
  phone: number;

  constructor(
    title: string,
    description: string,
    price: number,
    idOwner: ModelUser["primaryKeyUser"],
    urlPhoto: string,
    status: string,
    category: string,
    address: string,
    phone: number
  ) {
    this.primaryKeyAd = Math.random();
    this.title = title;
    this.description = description;
    this.price = price;
    this.createdAt = new Date();
    this.idOwner = idOwner;
    this.urlPhoto = urlPhoto;
    this.status = status;
    this.referenceKeyUserPurchase = 0;
    this.category = category;
    this.address = address;
    this.phone = phone;
  }
}

class ModelReview {
  primaryKeyReview: number;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  title: string;
  rating: number;
  description: string;
  date: Date;
  referenceKeyAd: ModelAd["primaryKeyAd"];

  constructor(referenceKeyUser: number, title: string, rating: number, description: string, referenceKeyAd: number) {
    this.primaryKeyReview = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.title = title;
    this.rating = rating;
    this.description = description;
    this.date = new Date();
    this.referenceKeyAd = referenceKeyAd;
  }
}

class ModelAuth {
  primaryKeyAuth: ModelUser["primaryKeyUser"];
  referenceKeyUser: ModelUser["primaryKeyUser"];
  token: number;

  constructor(referenceKeyUser: number) {
    this.primaryKeyAuth = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.token = Math.random();
  }
}

class ModelReport {
  primaryKeyReport: number;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  description: string;
  title: string;
  referenceKeyAd: ModelAd["primaryKeyAd"];
  closed: boolean;

  constructor(referenceKeyUser: number, referenceKeyAd: number, title: string, description: string) {
    this.primaryKeyReport = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.description = description;
    this.title = title;
    this.referenceKeyAd = referenceKeyAd;
    this.closed = false;
  }
}

class ModelFavorite {
  primaryKeyFavorite: number;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  referenceKeyAd: ModelAd["primaryKeyAd"];

  constructor(referenceKeyUser: number, referenceKeyAd: number) {
    this.primaryKeyFavorite = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.referenceKeyAd = referenceKeyAd;
  }
}

class ModelDevice {
  primaryKey: number;
  referenceKeyUser: ModelUser["primaryKeyUser"];
  idDevice: number;
  deviceName: string | number;

  constructor(referenceKeyUser: number, device: number) {
    this.primaryKey = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.idDevice = device;
    this.deviceName = device;
  }
}

class App {
  users: Array<ModelUser> = [];
  ads: Array<ModelAd> = [];
  reviews: Array<ModelReview> = [];
  auth: Array<ModelAuth> = [];
  reports: Array<ModelReport> = [];
  favorites: Array<ModelFavorite> = [];
  devices: Array<ModelDevice> = [];

  getAuthByToken(token: number) {
    const authFound = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });
    if (!!authFound) return authFound;
    else return null;
  }

  deleteDevice(token: number, idDevice: number) {
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      this.devices = this.devices.filter(function (device) {
        if (device.referenceKeyUser === auth.referenceKeyUser && device.idDevice === idDevice) return false;
        else return true;
      });
    } else console.log("Autenticazione non effettuata");
  }

  changeDeviceName(token: number, deviceName: string, idDevice: number) {
    const auth: any = this.getAuthByToken(token);
    const device: any = this.devices.find(function (device) {
      if (device.referenceKeyUser === auth.referenceKeyUser && device.idDevice === idDevice) return true;
      else return false;
    });
    if (!!auth) {
      if (device.referenceKeyUser === auth.referenceKeyUser && device.idDevice === idDevice) {
        this.devices = this.devices.map(function (device) {
          if (device.referenceKeyUser === auth.referenceKeyUser && device.idDevice === idDevice) {
            return { ...device, deviceName: deviceName };
          } else return device;
        });
      } else console.log("Non è possibile modificare questo dispositivo");
    } else console.log("Autenticazione non effettuata");
  }

  registerDevice(token: number, idDevice: number) {
    const auth: any = this.getAuthByToken(token);
    const userDevices = this.devices.filter(function (device) {
      if (device.referenceKeyUser === auth.referenceKeyUser) return true;
      else return false;
    });
    if (!!auth) {
      if (userDevices.length < 2) {
        const newDevice = new ModelDevice(auth.referenceKeyUser, idDevice);
        this.devices = [...this.devices, newDevice];
      } else console.log("Numero massimo di dispositivi raggiunto");
    } else console.log("Autenticazione non effettuata");
  }

  login(email: string, password: string, idDevice: number) {
    // Cerca nell'array users l'email e la password, se li trova permette l'accesso, altrimenti mostra un messaggio di errore
    const userFound = this.users.find(function (user) {
      return user.email === email && user.password === password;
    });

    if (!userFound) {
      console.log("Utente non registrato o password errata");
      return null;
    }

    const authFound = this.auth.find(function (auth) {
      return auth.referenceKeyUser === userFound.primaryKeyUser;
    });

    if (authFound) {
      console.log("Utente già loggato");
      return null;
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
        return null;
      }

      const newDevice = new ModelDevice(userFound.primaryKeyUser, idDevice);
      this.devices = [...this.devices, newDevice];
    }

    const newAuth = new ModelAuth(userFound.primaryKeyUser);
    this.auth = [...this.auth, newAuth];
    console.log("Login effettuato con successo");
    return newAuth.token;
  }

  register(email: string, password: string) {
    // Cerca nell'array users l'email, se lo trova mostra un messaggio di errore, altrimenti crea un nuovo utente
    const userFound = this.users.find(function (user) {
      if (user.email === email) return true;
      else return false;
    });

    if (!!userFound) console.log("email gia in uso");
    else {
      const newUser = new ModelUser(email, email, password);
      this.users = [...this.users, newUser];
      console.log("Registrazione effettuata con successo");
    }
  }

  logout(token: number) {
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
    } else console.log("token non valido");
  }

  changeUsername(username: string, token: number) {
    // Cerca nell'array users l'id e il token, se lo trova permette di modificare l'username, altrimenti mostra un messaggio di errore
    const authFound: any = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });

    const userFound: any = this.users.find(function (user) {
      if (authFound.referenceKeyUser === user.primaryKeyUser) return true;
      else return false;
    });

    this.users.map(function (user) {
      if (user.primaryKeyUser === userFound.primaryKeyUser) return { ...user, username: username };
      else return user;
    });
  }

  deleteAccount(token: number) {
    // Cerca nell'array users l'id e il token, se lo trova cancella l'elemento, altrimenti mostra un messaggio di errore
    const authFound: any = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });

    this.users = this.users.filter(function (user) {
      if (authFound.referenceKeyUser === user.primaryKeyUser) return false;
      else return true;
    });
  }

  createAd(
    token: number,
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
    } else console.log("Autenticazione non effettuata");
  }

  updateAd(
    referenceKeyAd: number,
    title: string,
    description: string,
    price: number,
    status: string,
    urlPhoto: string,
    category: string,
    address: string,
    phone: number,
    token: number
  ) {
    // Cerca nell'array ads l'id, se lo trova permette di modificare i parametri dell'ad, altrimenti mostra un messaggio di errore
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
      } else console.log("Non sei il proprietario dell'annuncio");
    } else console.log("Annuncio non trovato");
  }

  deleteAd(referenceKeyAd: number, token: number) {
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

  markAsSold(referenceKeyAd: number, token: number, referenceKeyUserPurchase: number) {
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

  createReview(title: string, rating: number, description: string, referenceKeyAd: number, token: number) {
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

  updateReview(referenceKeyReview: number, title: string, rating: number, description: string, token: number) {
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

  deleteReview(referenceKeyReview: number, token: number) {
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

  createReport(referenceKeyAd: number, token: number, title: string, description: string) {
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

  closeReport(referenceKeyReport: number, token: number) {
    // Cerca nell'array reports l'id, se lo trova modifica la voce closed, altrimenti mostra un messaggio di errore
    const auth: any = this.getAuthByToken(token);
    let reportFound: any = null;
    if (!!auth) {
      reportFound = this.reports.find(function (report) {
        if (report.primaryKeyReport === referenceKeyReport) return true;
        else return false;
      });
    } else console.log("Autenticazione non effettuata");

    if (!!reportFound) {
      this.reports = this.reports.map(function (report) {
        if (reportFound.primaryKey === report.primaryKeyReport)
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

  listUserFavorites(referenceKeyUser: number) {
    // Cerca nell'array favorites l'id, se lo trova restituisce l'array filtrato, altrimenti restituisce un array vuoto
    return this.favorites.filter(function (favorite) {
      if (favorite.referenceKeyUser === referenceKeyUser) return true;
      else return false;
    });
  }

  addToFavorite(referenceKeyAd: number, token: number) {
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

  deleteFavorite(referenceKeyAd: number, token: number) {
    // Cerca nell'array favorites l'id, se lo trova cancella l'elemento, altrimenti mostra un messaggio di errore
    const auth: any = this.getAuthByToken(token);
    let favoriteFound: any = null;
    if (!!auth) {
      favoriteFound = this.favorites.find(function (favorite) {
        if (favorite.referenceKeyAd === referenceKeyAd && favorite.referenceKeyUser === auth.referenceKeyUser) return true;
        else return false;
      });
    } else console.log("Autenticazione non effettuata");

    if (!!favoriteFound) {
      this.favorites = this.favorites.filter(function (favorite) {
        if (favoriteFound.primaryKey === favorite.primaryKeyFavorite) return false;
        else return true;
      });
    } else console.log("Non puoi eliminare questo preferito");
  }

  showAdDetails(referenceKeyAd: number, token: number) {
    // Cerca nell'array ads l'id, se lo trova mostra i dettagli dell'annuncio, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    return this.ads.filter(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });
  }

  listUserAds(referenceKeyUser: number) {
    // Cerca nell'array ads gli id dell'user, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.ads.filter(function (ad) {
      if (ad.idOwner === referenceKeyUser) return true;
      else return false;
    });
  }

  listUserReviews(referenceKeyUser: number) {
    // Cerca nell'array reviews gli id dell'user, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.reviews.filter(function (review) {
      if (review.referenceKeyUser === referenceKeyUser) return true;
      else return false;
    });
  }

  listUserSoldedAds(referenceKeyUser: number) {
    // Cerca nell'array ads gli id dell'user con lo status sold, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.ads.filter(function (ad) {
      if (ad.idOwner === referenceKeyUser && ad.referenceKeyUserPurchase !== 0) return true;
      else return false;
    });
  }

  listUserBuyedAds(referenceKeyUser: number) {
    // Cerca nell'array ads gli id dell'user con lo status sold, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.ads.filter(function (ad) {
      if (ad.referenceKeyUserPurchase === referenceKeyUser) return true;
      else return false;
    });
  }
}
