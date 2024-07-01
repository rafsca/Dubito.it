class ModelUser {
  constructor(username, email, password) {
    this.primaryKeyUser = Math.random();
    this.username = username;
    this.email = email;
    this.password = password;
  }
}

class ModelAd {
  constructor(title, description, price, idOwner, urlPhoto, status, category, address, phone) {
    this.primaryKeyAd = Math.random();
    this.title = title;
    this.description = description;
    this.price = price;
    this.createdAt = new Date();
    this.idOwner = idOwner;
    this.urlPhoto = urlPhoto;
    this.status = status;
    this.referenceKeyUserPurchase = "";
    this.category = category;
    this.address = address;
    this.phone = phone;
  }
}

class ModelReview {
  constructor(referenceKeyUser, title, rating, description, referenceKeyAd) {
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
  constructor(referenceKeyUser) {
    this.primaryKeyAuth = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.token = Math.random();
  }
}

class ModelReport {
  constructor(referenceKeyUser, referenceKeyAd, description) {
    this.primaryKeyReport = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.description = description;
    this.referenceKeyAd = referenceKeyAd;
    this.closed = false;
  }
}

class ModelFavorite {
  constructor(referenceKeyUser, referenceKeyAd) {
    this.primaryKeyFavorite = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.referenceKeyAd = referenceKeyAd;
  }
}

class ModelDevice {
  constructor(referenceKeyUser, device) {
    this.primaryKey = Math.random();
    this.referenceKeyUser = referenceKeyUser;
    this.idDevice = device;
    this.deviceName = device;
  }
}

class App {
  users = [];
  ads = [];
  reviews = [];
  auth = [];
  reports = [];
  favorites = [];
  devices = [];

  getAuthByToken(token) {
    const authFound = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });
    if (!!authFound) return authFound;
    else return null;
  }

  deleteDevice(token, device) {
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      this.devices = this.devices.filter(function (device) {
        if (device.referenceKeyUser === auth.referenceKeyUser && device.idDevice === device) return false;
        else return true;
      });
    } else console.log("Autenticazione non effettuata");
  }

  changeDeviceName(token, deviceName, device) {
    const auth = this.getAuthByToken(token);
    if (!!auth) {
      if (device.referenceKeyUser === auth.referenceKeyUser && device.idDevice === device) {
        this.devices = this.devices.map(function (device) {
          if (device.referenceKeyUser === auth.referenceKeyUser && device.idDevice === device) {
            return { ...device, deviceName: deviceName };
          } else return device;
        });
      } else console.log("Non è possibile modificare questo dispositivo");
    } else console.log("Autenticazione non effettuata");
  }

  registerDevice(token, device) {
    const auth = this.getAuthByToken(token);
    const userDevices = this.devices.filter(function (device) {
      if (device.referenceKeyUser === auth.referenceKeyUser) return true;
      else return false;
    });
    if (!!auth) {
      if (userDevices.length < 2) {
        const newDevice = new ModelDevice(auth.referenceKeyUser, device);
        this.devices = [...this.devices, newDevice];
      } else console.log("Numero massimo di dispositivi raggiunto");
    } else console.log("Autenticazione non effettuata");
  }

  login(email, password, device) {
    // Cerca nell'array users l'email e password, se lo trova permette l'accesso, altrimenti mostra un messaggio di errore

    const userFound = this.users.find(function (user) {
      if (user.email === email && user.password === password) return true;
      else return false;
    });

    if (!!userFound) {
      const newAuth = new ModelAuth(userFound.primaryKeyUser);
      this.auth = [...this.auth, newAuth];
      return newAuth.token;
    } else console.log("utente non registrato o hai raggiunto il numero massimo di dispositivi");
  }

  register(email, password, device) {
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

  logout(token) {
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

  changeUsername(username, token) {
    // Cerca nell'array users l'id e il token, se lo trova permette di modificare l'username, altrimenti mostra un messaggio di errore
    const authFound = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });

    const userFound = this.users.find(function (user) {
      if (authFound.referenceKeyUser === user.primaryKeyUser) return true;
      else return false;
    });

    this.users.map(function (user) {
      if (user.primaryKeyUser === userFound.primaryKeyUser) return { ...user, username: username };
      else return user;
    });
  }

  deleteAccount(token) {
    // Cerca nell'array users l'id e il token, se lo trova cancella l'elemento, altrimenti mostra un messaggio di errore
    const authFound = this.auth.find(function (auth) {
      if (auth.token === token) return true;
      else return false;
    });

    this.users = this.users.filter(function (user) {
      if (authFound.referenceKeyUser === user.primaryKeyUser) return false;
      else return true;
    });
  }

  createAd(token, title, description, price, status, urlPhoto, category, address, phone) {
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

  updateAd(referenceKeyAd, title, description, price, status, urlPhoto, category, address, phone, token) {
    // Cerca nell'array ads l'id, se lo trova permette di modificare i parametri dell'ad, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    const adFound = null;
    if (!!auth) {
      const adFound = this.ads.find(function (ad) {
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

  deleteAd(referenceKeyAd, token) {
    // Cerca nell'array ads l'id, se lo trova cancella l'elemento, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    const adFound = null;
    if (!!auth) {
      const adFound = this.ads.find(function (ad) {
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

  markAsSold(referenceKeyAd, token, referenceKeyUserPurchase) {
    // Cerca nell'array ads l'id, se lo trova modifica la voce sold, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    const adFound = null;
    if (!!auth) {
      const adFound = this.ads.find(function (ad) {
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

  createReview(title, rating, description, referenceKeyAd, token) {
    // Permette a un user di recensire un annuncio e un utente lo aggiunge nell'array reviews
    const auth = this.getAuthByToken(token);

    const adFound = this.ads.find(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });

    if (!!auth) {
      if (!!adFound) {
        if (adFound.referenceKeyUserPurchase === auth.referenceKeyUser) {
          const newReview = new ModelReview(title, rating, description, auth.referenceKeyUser, referenceKeyAd);
          this.reviews = [...this.reviews, newReview];
        } else console.log("Solo chi acquisita il prodotto puo' creare una recensione");
      } else console.log("Annuncio non trovato");
    } else console.log("Autenticazione non effettuata");
  }

  updateReview(referenceKeyReview, title, rating, description, token) {
    // Cerca nell'array reviews l'id, se lo trova permette di modificare i parametri dell'annuncio, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    const reviewFound = null;
    if (!!auth) {
      const reviewFound = this.reviews.find(function (review) {
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

  deleteReview(referenceKeyReview, token) {
    // Cerca nell'array reviews l'id, se lo trova cancella l'elemento, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    const reviewFound = null;
    if (!!auth) {
      const reviewFound = this.reviews.find(function (review) {
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

  createReport(referenceKeyAd, token, title, description) {
    // Permette a un user di creare un report e lo aggiunge nell'array reports
    const auth = this.getAuthByToken(token);
    const adFound = this.ads.find(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });

    if (!!auth) {
      if (!!adFound) {
        const newReport = new ModelReport(title, description, auth.referenceKeyUser, referenceKeyAd);
        this.reports = [...this.reports, newReport];
      } else console.log("Annuncio non trovato");
    } else console.log("Autenticazione non effettuata");
  }

  closeReport(referenceKeyReport, token) {
    // Cerca nell'array reports l'id, se lo trova modifica la voce closed, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    const reportFound = null;
    if (!!auth) {
      const reportFound = this.reports.find(function (report) {
        if (report.primaryKeyReport === referenceKeyReport) return true;
        else return false;
      });
    } else console.log("Autenticazione non effettuata");

    if (!!reportFound) {
      this.reports = this.reports.map(function (report) {
        if (reportFound.primaryKey === report.primaryKey)
          return {
            ...auth,
            closed: true,
          };
        else return auth;
      });
    } else console.log("Report non trovato");
  }

  listByCategory(category) {
    // Cerca nell'array ads la category, se la trova restituisce l'array filtrato, altrimenti restituisce un array vuoto
    this.ads = this.ads.filter(function (ad) {
      if (ad.category === category) return true;
      else return false;
    });
  }

  listUserFavorites(referenceKeyUser) {
    // Cerca nell'array favorites l'id, se lo trova restituisce l'array filtrato, altrimenti restituisce un array vuoto
    return this.favorites.filter(function (favorite) {
      if (favorite.referenceKeyUser === referenceKeyUser) return true;
      else return false;
    });
  }

  addToFavorite(referenceKeyAd, token) {
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

  deleteFavorite(referenceKeyAd, token) {
    // Cerca nell'array favorites l'id, se lo trova cancella l'elemento, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    const favoriteFound = null;
    if (!!auth) {
      const favoriteFound = this.favorites.find(function (favorite) {
        if (favorite.referenceKeyAd === referenceKeyAd && favorite.referenceKeyUser === auth.referenceKeyUser) return true;
        else return false;
      });
    } else console.log("Autenticazione non effettuata");

    if (!!favoriteFound) {
      this.favorites = this.favorites.filter(function (favorite) {
        if (favoriteFound.primaryKey === favorite.primaryKey) return false;
        else return true;
      });
    } else console.log("Non puoi eliminare questo preferito");
  }

  showAdDetails(referenceKeyAd, token) {
    // Cerca nell'array ads l'id, se lo trova mostra i dettagli dell'annuncio, altrimenti mostra un messaggio di errore
    const auth = this.getAuthByToken(token);
    return this.ads.filter(function (ad) {
      if (ad.primaryKeyAd === referenceKeyAd) return true;
      else return false;
    });
  }

  listUserAds(referenceKeyUser) {
    // Cerca nell'array ads gli id dell'user, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.ads.filter(function (ad) {
      if (ad.referenceKeyUser === referenceKeyUser) return true;
      else return false;
    });
  }

  listUserReviews(referenceKeyUser) {
    // Cerca nell'array reviews gli id dell'user, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.reviews.filter(function (review) {
      if (review.referenceKeyUser === referenceKeyUser) return true;
      else return false;
    });
  }

  listUserSoldedAds(referenceKeyUser) {
    // Cerca nell'array ads gli id dell'user con lo status sold, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.ads.filter(function (ad) {
      if (ad.referenceKeyUser === referenceKeyUser && ad.referenceKeyUserPurchase !== "") return true;
      else return false;
    });
  }

  listUserBuyedAds(referenceKeyUser) {
    // Cerca nell'array ads gli id dell'user con lo status sold, se lo trova mostra un array filtrato, altrimenti restituisce un array vuoto
    return this.ads.filter(function (ad) {
      if ((ad, referenceKeyUserPurchase === referenceKeyUser)) return true;
      else return false;
    });
  }
}
