# ✈️ Travel Planner

[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Chakra UI](https://img.shields.io/badge/Chakra_UI-v3-319795?logo=chakraui&logoColor=white)](https://chakra-ui.com/)

> Veb aplikacija stvorena za planiranje putovanja. Putovanje može biti samo od tačke A do tačke B ili kroz više gradova — sa interaktivnom mapom, praćenjem troškova i aktivnosti po destinaciji i statistikom po putovanju.

---

## Kratko o projektu

Ideja iza aplikacije je jednostavna: putovanje predstavlja skup destinacija sa sopstvenim rasporedom, aktivnostima i troškovima. Travel Planner organizuje ta putovanja tako da korisnik u svakom trenutku zna gde ide, koliko troši i koliko mu budžeta ostaje.

---

## Sadržaj

1. [Kako radi](#kako-radi)
2. [Šta aplikacija nudi](#šta-aplikacija-nudi)
3. [Tech Stack](#tech-stack)
4. [Pokretanje lokalno](#pokretanje-lokalno)
5. [Podešavanje okruženja](#podešavanje-okruženja)
6. [Mapa projekta](#mapa-projekta)
7. [API pregled](#api-pregled)
8. [Kako je zaštićen sistem](#kako-je-zaštićen-sistem)
9. [Testovi](#testovi)

---

## Kako radi

```
Korisnik se registruje ili prijavljuje
        │
        ▼
Kreira putovanje — unosi start i cilj i bira mesto iz padajućeg menija, unosi datume i budžet
        │
        ▼
Dodaje međustanice (opciono) — Unosi naziv međustanice, sistem validira udaljenost od rute, ako je validno ruta se prikazuje na mapi
        │
        ▼
Po svakoj stanici unosi aktivnosti i troškove
        │
        ▼
Prati statistiku — pie chart troškova, progress bar budžeta, bar chart po putovanjima
        │
        ▼
World Map — pregled svih putovanja na jednoj karti sa travel style rangom
```

Model podataka prati tu istu logiku:

```
Korisnik
 └── Putovanje
      └── Destinacija  ← finalna označena sa isFinal: true
           ├── Aktivnost
           └── Trošak
```

Svaki resurs je vlasništvo korisnika koji ga je kreirao. Middleware `checkOwner.js` verifikuje ceo lanac pre svake izmene — od tokena do konkretnog resursa, kako ne bi mogao neko drugi, ako mu je id našeg putovanja poznat, da ga vidi, izmeni ili obriše.

---

## Šta aplikacija nudi

### Za korisnika

| Funkcionalnost         | Opis                                                                                                             |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------- |
| Registracija i prijava | JWT autentifikacija, bcrypt hashovanje, validacija na frontu i backu                                             |
| Kreiranje putovanja    | Interaktivna mapa, izbor starta i cilja preko input polja, datumi, budžet                                        |
| Dodavanje stanica      | Izbor preko input polja, pregled na mapi, Nominatim geosearch, validacija 200 km od rute                         |
| Aktivnosti po stanici  | Naziv, opis, datum, lokacija                                                                                     |
| Troškovi po stanici    | Naziv, kategorija, iznos, period                                                                                 |
| Statistika             | Pie chart troškova na putovanju, bar chart na početnoj stranici, progress bar budžeta                            |
| Dashboard              | Globalni pregled, naredna putovanja, bar chart troškova poslednjih 5 putovanja                                   |
| World Map              | Sva putovanja na jednoj karti, travel style rang                                                                 |
| Pretraga               | Po nazivu, statusu (predstojeća/aktivna/završena), datumu ili budžetu                                            |
| Tema                   | Tamna i svetla, perzistovana, primenjena svuda uključujući toastove                                              |
| Responsivnost          | Sidebar na desktopu, hamburger meni na mobilnom, uopšteno aplikacija je prilagođena desktop i mobilnim uređajima |

### Za sistem

- Kaskadno brisanje — brisanjem putovanja automatski se brišu destinacije, aktivnosti i troškovi
- Server se pokreće tek nakon uspešne konekcije na bazu
- Rate limiting — stroži limit za auth rute nego za ostale
- Ownership chain provera na svakom zaštićenom endpointu

---

## Tech Stack

### Backend

```
Node.js + Express         — REST API server
MongoDB + Mongoose        — baza podataka
JSON Web Token            — autentifikacija (7 dana važi token)
bcrypt                    — hashovanje lozinki (10 salt rounds)
express-validator         — validacija ulaznih podataka
express-rate-limit        — zaštita od brute-force napada
helmet                    — HTTP bezbednosni headeri
cors                      — kontrola cross-origin zahteva
dotenv                    — varijable okruženja
nodemon                   — auto-restart u razvoju
```

### Frontend

```
React 19 + TypeScript     — UI biblioteka
Vite                      — build alat
Chakra UI v3              — komponente i stilizovanje
React Router DOM          — rutiranje
Axios                     — HTTP zahtevi sa JWT interceptorom
Recharts                  — grafikoni (pie, bar, progress bar)
React Leaflet + Leaflet   — interaktivne mape
next-themes               — tamna/svetla tema
react-toastify            — notifikacije
lucide-react              — ikone
jwt-decode                — provera isteka tokena
```

### Testiranje

```
Selenium WebDriver (Java) — E2E testovi korisničkog interfejsa
TestNG                    — test runner
Maven                     — build za Java projekte
Postman                   — testiranje API endpointa
```

---

## Pokretanje lokalno

### Šta je potrebno

- Node.js v18+
- MongoDB (lokalno ili Atlas)
- Git
- Java 17+ i Maven _(samo za Selenium testove)_
- Google Chrome _(samo za Selenium testove)_

### Koraci

**1. Kloniranje**

```bash
git clone https://github.com/tvoj-username/travel-planner.git
cd travel-planner
```

**2. Backend**

```bash
cd backend
npm install
cp .env.example .env
# Potrebno je popuniti .env fajl po uzoru na .example fajl
npm run dev
```

**3. Frontend** _(u novom terminalu)_

```bash
cd frontend
npm install
# Potrebno je popuniti .env fajl sa promenljivom VITE_API_URL=adresa_backend_api-ja
npm run dev
```

> Backend se mora pokrenuti pre frontenda. Server se konektuje na MongoDB pa tek onda počinje da prima zahteve — ako baza nije dostupna, proces se gasi sa greškom.

---

## Podešavanje okruženja

Kreirati `backend/.env` na osnovu `backend/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/travelplanner
JWT_SECRET=zameniti_sa_dugackim_nasumicnim_stringom
```

| Varijabla    | Šta je                       | Primer                                    |
| ------------ | ---------------------------- | ----------------------------------------- |
| `PORT`       | Port backenda                | `5000`                                    |
| `MONGO_URI`  | MongoDB connection string    | `mongodb://localhost:27017/travelplanner` |
| `JWT_SECRET` | Ključ za potpisivanje tokena | `nekaLozinka123!`                         |

---

## Mapa projekta

```
travel-planner/
│
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── authController.js         # registracija, prijava
│   │   │   ├── tripController.js         # CRUD putovanja, kaskadno brisanje
│   │   │   ├── destinationController.js  # CRUD destinacija, kaskadno brisanje
│   │   │   ├── activityController.js     # CRUD aktivnosti
│   │   │   ├── expenseController.js      # CRUD troškova
│   │   │   ├── statisticsController.js   # statistika po putovanju
│   │   │   └── userController.js         # profil korisnika
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js         # verifikacija JWT tokena
│   │   │   ├── checkOwner.js             # provera lanca vlasništva
│   │   │   ├── rateLimiter.js            # rate limiting
│   │   │   └── errorMiddleware.js        # globalni handler grešaka
│   │   │
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Trip.js
│   │   │   ├── Destination.js            # isFinal: true za finalnu stanicu
│   │   │   ├── Activity.js
│   │   │   └── Expense.js
│   │   │
│   │   ├── routes/                       # Express rute za svaki resurs
│   │   └── server.js                     # entry point, DB → server
│   │
│   ├── .env                              # lokalni tajni podaci
│   ├── .env.example                      # primer .evn fajla
│   └── package.json
│
├── frontend/
│   └── src/
│       ├── api/
│       │   └── axios.ts                  # Axios sa JWT interceptorom i 401 redirect
│       │
│       ├── components/
│       │   ├── TripCard.tsx              # kartica putovanja sa inline brisanjem
│       │   ├── TripMap.tsx               # Leaflet + OSRM + Nominatim
│       │   ├── Statistics.tsx            # grafikoni po putovanju
│       │   ├── ActivitySection.tsx       # aktivnosti po destinaciji
│       │   ├── ExpenseSection.tsx        # troškovi po destinaciji
│       │   └── TripCardSkeleton.tsx      # skeleton loading
│       │
│       ├── context/AuthContext/          # globalno stanje autentifikacije
│       │
│       ├── hooks/
│       │   ├── useTrips.ts               # fetchovanje sa debounce pretragom
│       │   ├── useCreateTrip.ts          # logika kreiranja putovanja
│       │   └── useToastTheme.ts          # tema toastova sinhronizovana sa UI temom
│       │
│       ├── layouts/
│       │   ├── AppLayout/                # sidebar + topbar + mobilni hamburger
│       │   └── AuthLayout/               # layout za login i registraciju
│       │
│       ├── pages/
│       │   ├── Login / Register
│       │   ├── Dashboard                 # globalni pregled i statistika
│       │   ├── Trips                     # lista sa pretragom, filterima, paginacijom
│       │   ├── TripDetails               # mapa, stanice, statistika, izmene
│       │   ├── CreateTrip                # kreiranje sa interaktivnom mapom
│       │   ├── WorldMap                  # sve destinacije na jednoj karti
│       │   ├── Profile                   # korisnički profil
│       │   └── NotFound                  # 404 stranica
│       │
│       ├── routes/
│       │   ├── AppRouter.tsx             # sve rute aplikacije
│       │   └── ProtectedRoute.tsx        # guard sa proverom tokena
│       │
│       ├── types/types.ts                # TypeScript interfejsi
│       └── utils/helpers.ts              # validacija, formatiranje, računanje udaljenosti
│
└── tests/
    ├── selenium/                         # Java + TestNG (Page Object Model)
    │   ├── src/main/java/com/projekat/   # Page klase
    │   │   ├── BasePage.java
    │   │   ├── LoginPage.java
    │   │   └── CreateTripPage.java
    │   ├── src/test/java/com/projekat/   # Test klase
    │   │   ├── BaseTest.java
    │   │   ├── LoginTest.java
    │   │   └── CreateTripTest.java
    │   ├── testng.xml
    │   └── pom.xml
    │
    └── postman/
        ├── travel_planner.json           # kolekcija, 26 zahteva
        ├── env.json                      # okruženje za lokalni razvoj
        └── env.example.json              # šablon bez tajnih vrednosti
```

---

## API pregled

Svi zaštićeni endpointi zahtevaju `Authorization: Bearer <token>` header.

| Metoda   | Ruta                                    | Opis                                                     |
| -------- | --------------------------------------- | -------------------------------------------------------- |
| `POST`   | `/api/auth/register`                    | Registracija novog korisnika                             |
| `POST`   | `/api/auth/login`                       | Prijava, vraća JWT token                                 |
| `GET`    | `/api/users/profile`                    | Preuzimanje profila                                      |
| `PUT`    | `/api/users/profile`                    | Izmena profila                                           |
| `GET`    | `/api/trips`                            | Lista putovanja (pretraga, filter, sort, paginacija)     |
| `POST`   | `/api/trips`                            | Kreiranje putovanja                                      |
| `GET`    | `/api/trips/:id`                        | Jedno putovanje                                          |
| `PUT`    | `/api/trips/:id`                        | Izmena putovanja                                         |
| `DELETE` | `/api/trips/:id`                        | Brisanje putovanja + sve destinacije/aktivnosti/troškovi |
| `GET`    | `/api/destinations/:tripId`             | Destinacije putovanja                                    |
| `POST`   | `/api/destinations`                     | Dodavanje destinacije                                    |
| `PUT`    | `/api/destinations/:id`                 | Izmena destinacije                                       |
| `DELETE` | `/api/destinations/:id`                 | Brisanje destinacije + aktivnosti/troškovi               |
| `GET`    | `/api/activities/:destinationId`        | Aktivnosti destinacije                                   |
| `POST`   | `/api/activities`                       | Dodavanje aktivnosti                                     |
| `DELETE` | `/api/activities/:id`                   | Brisanje aktivnosti                                      |
| `GET`    | `/api/expenses/:destinationId`          | Troškovi destinacije                                     |
| `POST`   | `/api/expenses`                         | Dodavanje troška                                         |
| `DELETE` | `/api/expenses/:id`                     | Brisanje troška                                          |
| `GET`    | `/api/statistics/global-stats`          | Globalna statistika korisnika                            |
| `GET`    | `/api/statistics/trip/:tripId/overview` | Celokupna statistika putovanja                           |

---

## Kako je zaštićen sistem

**Autentifikacija**
JWT token sa trajanjem od 7 dana. Token se šalje u `Authorization` headeru. Na frontu, Axios interceptor automatski dodaje token na svaki zahtev i preusmerava na login ako dobije 401.

**Provera vlasništva**
`checkOwner.js` middleware verifikuje ceo lanac pre svake izmene ili brisanja:

```
token → userId → tripId → destinationId → aktivnost ili trošak
```

Korisnik ne može da menja tuđe podatke čak i ako zna ID resursa.

**Ostale mere**

| Mera          | Detalji                                                                                                   |
| ------------- | --------------------------------------------------------------------------------------------------------- |
| bcrypt        | Hashovanje lozinki, 10 salt rounds                                                                        |
| Helmet        | Bezbednosni HTTP headeri                                                                                  |
| CORS          | Ograničen na `localhost:5173` u razvoju                                                                   |
| Rate limiting | 300 req/15min za API; 30 req/sat za auth rute                                                             |
| Validacija    | express-validator — email, lozinka min 8 znakova + slovo + broj + specijalni znak, ime i prezime obavezni |

---

## Testovi

### Selenium — E2E (Java + TestNG + Page Object Model)

Testovi su podeljeni na **Page klase** (enkapsuliraju interakcije sa elementima stranice) i **Test klase** (scenario testovi). Page Object Model pattern olakšava održavanje — ako se promeni UI, menja se samo Page klasa, ne i testovi.

Pokretanje:

```bash
cd tests/selenium
.\mvnw test
```

> Backend i frontend moraju biti pokrenuti. Google Chrome mora biti instaliran.

**Šta se testira:**

- `LoginTest` — uspešna prijava → preusmeravanje na dashboard
- `LoginTest` — pogrešna lozinka → poruka o grešci, ostaje na login stranici
- `CreateTripTest` — kompletno kreiranje putovanja sa mapom → preusmeravanje na detalje
- `CreateTripTest` — kreiranje bez odabrane lokacije → ostaje na formi, toast poruka

### Postman — REST API

Kolekcija od 26 zahteva pokretanih u redosledu. Svaki zahtev automatski čuva varijable za sledeće (`TOKEN`, `TRIP_ID`, `DEST_ID`, `ACTIVITY_ID`, `EXPENSE_ID`).

Pokretanje:

1. Postman → **Import** → `tests/postman/travel_planner.json`
2. Import okruženja → `tests/postman/env.json`
3. Odaberi **Local** okruženje
4. **Collection Runner** → pokreni sve od vrha

Ili:

```bash
npm install -g newman
newman run travel_planner.json -e env.json
```

**Šta se testira:**

- Auth: registracija, slaba lozinka (400), prijava, pogrešna lozinka (400), pristup bez tokena (401)
- Profil: preuzimanje bez lozinke u odgovoru, izmena
- Putovanja: kreiranje, lista sa paginacijom, filter po statusu, po ID, izmena budžeta
- Destinacije: kreiranje, preuzimanje, pristup tuđoj (403/404)
- Aktivnosti: kreiranje, preuzimanje, brisanje
- Troškovi: kreiranje, preuzimanje, brisanje
- Statistika: globalna, po putovanju, po kategoriji, po datumu, zabranjen pristup (403/404)
- Kaskadno brisanje: brisanje putovanja → verifikacija da su obrisani i svi podaci

### Ručno testiranje

Testirani su svi korisnički tokovi: registracija sa validacijom, prijava, kreiranje putovanja na mapi, dodavanje stanica, unos aktivnosti i troškova, statistika i grafikoni, World Map, promena teme, prikaz na mobilnom.
