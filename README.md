# URL Shortener

A full-stack MERN URL shortener where anonymous visitors can create short links, optionally set a custom alias, track clicks, and manage their own links through a browser cookie.

**Live application:** [url-shortener-liard-pi.vercel.app](https://url-shortener-liard-pi.vercel.app)

**Repository:** [github.com/AniketThakur6/URl_Shortener](https://github.com/AniketThakur6/URl_Shortener)

## Table of contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment variables](#environment-variables)
- [Installation and local development](#installation-and-local-development)
- [Available scripts](#available-scripts)
- [API documentation](#api-documentation)
- [Validation and link lifetime rules](#validation-and-link-lifetime-rules)
- [Deployment](#deployment)
- [Production notes](#production-notes)
- [Testing](#testing)
- [Contributing](#contributing)
- [License](#license)

## Features

- Generate random six-character short codes.
- Create custom aliases containing letters, numbers, hyphens, and underscores.
- Redirect visitors to the original URL and track click counts.
- Generate QR codes for shortened links.
- Copy, visit, refresh, and delete saved links from the browser interface.
- Keep each visitor's links separate with an anonymous HTTP-only cookie; no account is required.
- Automatically expire links after 30 days with a MongoDB TTL index.

## Tech stack

| Area     | Technologies                                                                    |
| -------- | ------------------------------------------------------------------------------- |
| Client   | React 19, Vite, Tailwind CSS, Axios, Lucide React, React Toastify, qrcode.react |
| Server   | Node.js, Express 5                                                              |
| Database | MongoDB, Mongoose                                                               |

## Project structure

```text
URLShortner/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── apis/
│   │   │   └── api.jsx                 # Axios API client
│   │   ├── assets/                     # Client assets
│   │   ├── components/
│   │   │   ├── DeleteConfirmModal.jsx  # Delete confirmation dialog
│   │   │   ├── MyQRCode.jsx             # QR code rendering
│   │   │   ├── ResultCard.jsx           # Newly created link
│   │   │   ├── ShortenForm.jsx          # URL and alias form
│   │   │   └── UrlList.jsx              # Saved link list items
│   │   ├── App.jsx                      # Main client view
│   │   ├── index.css                    # Global styles
│   │   └── main.jsx                     # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js                   # Vite and API proxy configuration
├── server/
│   ├── src/
│   │   ├── app/
│   │   │   └── app.js                  # Express middleware and route registration
│   │   ├── config/
│   │   │   ├── config.js                # Environment configuration
│   │   │   └── db.js                    # MongoDB connection
│   │   ├── controllers/
│   │   │   └── url.controller.js        # URL creation, listing, redirect, and delete logic
│   │   ├── models/
│   │   │   └── url.model.js             # Mongoose schema and TTL index
│   │   ├── routes/
│   │   │   └── urlShortner.route.js     # /api/url routes
│   │   ├── utils/
│   │   │   └── generateCode.utils.js    # Random short-code generator
│   │   └── server.js                    # Server entry point
│   └── package.json
└── README.md
```

## Prerequisites

- Node.js 18 or newer
- npm
- A running MongoDB instance, either locally or through MongoDB Atlas

## Environment variables

### Server: `server/.env`

| Variable     | Required | Example                                   | Description                      |
| ------------ | -------- | ----------------------------------------- | -------------------------------- |
| `PORT`       | Yes      | `3000`                                    | Port used by the Express server. |
| `MONGO_URI`  | Yes      | `mongodb://127.0.0.1:27017/url-shortener` | MongoDB connection string.       |
| `CLIENT_URL` | Yes      | `http://localhost:5173`                   | Frontend origin allowed by CORS. |

### Client: `client/.env`

| Variable       | Required | Example                 | Description                          |
| -------------- | -------- | ----------------------- | ------------------------------------ |
| `VITE_API_URL` | Yes      | `http://localhost:3000` | API origin used by the Axios client. |

## Installation and local development

1. Clone the repository and enter the project directory:

   ```bash
   git clone https://github.com/AniketThakur6/URl_Shortener.git
   cd URl_Shortener
   ```

2. Install the server dependencies:

   ```bash
   cd server
   npm install
   ```

3. Create `server/.env`:

   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/url-shortener
   CLIENT_URL=http://localhost:5173
   ```

   For MongoDB Atlas, replace `MONGO_URI` with the Atlas connection string.

4. Start the server in development mode:

   ```bash
   npm run dev
   ```

5. In a second terminal, install the client dependencies:

   ```bash
   cd client
   npm install
   ```

6. Create `client/.env`:

   ```env
   VITE_API_URL=http://localhost:3000
   ```

7. Start the client:

   ```bash
   npm run dev
   ```

   The client normally runs at `http://localhost:5173`. Vite proxies `/api` requests to the server during development, while `VITE_API_URL` provides the API origin used by the client application.

## Available scripts

### Server

| Command       | Description                            |
| ------------- | -------------------------------------- |
| `npm run dev` | Start the Express server with Nodemon. |
| `npm start`   | Start the Express server with Node.js. |

### Client

| Command           | Description                           |
| ----------------- | ------------------------------------- |
| `npm run dev`     | Start the Vite development server.    |
| `npm run build`   | Build the client for production.      |
| `npm run preview` | Preview the production build locally. |
| `npm run lint`    | Run ESLint.                           |

## API documentation

The API base path is `/api/url`. Requests that create or manage links use the `anonymousUserId` HTTP-only cookie issued by the server.

### Create a short URL

`POST /api/url`

Request:

```json
{
  "url": "https://example.com/articles/a-long-page",
  "alias": "example-article"
}
```

The `alias` field is optional. Omit it or send an empty string to receive a random short code.

Success response (`201 Created`):

```json
{
  "message": "URL shortend successfully",
  "data": {
    "originalUrl": "https://example.com/articles/a-long-page",
    "shortCode": "example-article"
  }
}
```

The response also sets the `anonymousUserId` HTTP-only cookie. A duplicate URL for the same visitor without an alias returns `400 Bad Request`.

### List the visitor's URLs

`GET /api/url`

Request body: none. The browser automatically sends the ownership cookie.

Success response (`200 OK`):

```json
{
  "message": "URLs fetched successfully",
  "data": {
    "urls": [
      {
        "_id": "65f0c4e2b4d6b1a2c3d4e5f6",
        "originalUrl": "https://example.com",
        "shortCode": "aB3xYz",
        "clicks": 4
      }
    ]
  }
}
```

Links are returned newest first. If no ownership cookie exists, the list is empty.

### Delete a URL

`DELETE /api/url/:id`

Example:

```text
DELETE /api/url/65f0c4e2b4d6b1a2c3d4e5f6
```

Request body: none. Only the visitor who owns the link can delete it.

Success response (`200 OK`):

```json
{
  "message": "URL delete successfully"
}
```

### Redirect to the original URL

`GET /:code`

Example:

```text
GET http://localhost:3000/aB3xYz
```

This endpoint has no JSON request body. A valid code returns `302 Found` with a `Location` header pointing to the original URL and increments the link's click count.

An unknown or expired code returns `404 Not Found`:

```json
{
  "error": "url not found"
}
```

## Validation and link lifetime rules

- URLs are required, must begin with `http://` or `https://`, and cannot exceed 2,048 characters.
- Aliases are optional and may contain only letters, numbers, hyphens, and underscores.
- An alias must be unique across all stored links. An existing alias returns an error.
- Random short codes are six characters long and regenerated if a collision is found.
- Every link receives an `expiresAt` timestamp 30 days after creation.
- MongoDB's TTL monitor removes expired documents asynchronously, so a link may remain available briefly after its exact expiry time.
- Expiry removes the shortened link record; it does not delete or modify the destination URL.

## Deployment

The live client is deployed at [url-shortener-liard-pi.vercel.app](https://url-shortener-liard-pi.vercel.app).

For a production deployment:

1. Deploy the client and server as separate services, or configure the hosting provider to serve both applications.
2. Set the server's `CLIENT_URL` to the exact deployed frontend origin.
3. Set the client's `VITE_API_URL` to the public server origin.
4. Configure `MONGO_URI` with a production MongoDB or MongoDB Atlas connection string.
5. Confirm that the production MongoDB network settings allow the server to connect.

## Production notes

- Configure CORS with the exact frontend origin from `CLIENT_URL` and keep credential support enabled.
- Use HTTPS in production. The server uses a secure, cross-site `anonymousUserId` cookie, so browsers may reject it over insecure connections.
- Replace localhost origins in deployment configuration with the appropriate public client and server URLs.
- Make sure the MongoDB deployment can create and use the TTL index on `expiresAt`.

## Testing

No automated tests are currently included in this project. Useful future coverage includes controller tests, short-code generation tests, validation tests, and redirect click-count tests.

## Contributing

1. Fork the repository and create a feature branch:

   ```bash
   git checkout -b feature/your-feature
   ```

2. Make your changes while following the existing project structure and code style.
3. Run the client lint command before opening a pull request.
4. Open a pull request with a clear description of the change.

## License

No license file exists yet. Until a license is added, the project should be treated as all rights reserved rather than as open-source software.
