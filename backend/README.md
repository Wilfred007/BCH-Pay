# BCH Pay Backend

The backend API for BCH Pay, handling invoice generation, blockchain monitoring, and merchant management.

## 🚀 Features

- **Invoice Service**: Generates unique BCH addresses and tracks payments.
- **Price Service**: Real-time BCH/Fiat price conversion using CoinGecko.
- **Blockchain Integration**: Powered by `@psf/bch-js` for robust BCH interactions.
- **Authentication**: JWT-based merchant authentication.

## 🛠 Development

### Setup

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root of the backend directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
RESTURL=https://chipnet.fullstack.cash/v6/
```

### Run Server

```bash
npm run dev
```

## 🏗 Built With

- [Express](https://expressjs.com/)
- [Mongoose](https://mongoosejs.com/)
- [@psf/bch-js](https://www.npmjs.com/package/@psf/bch-js)
- [bchaddrjs-slp](https://www.npmjs.com/package/bchaddrjs-slp)
