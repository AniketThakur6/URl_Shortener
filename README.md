# URL Shortener

A full-stack URL shortener that lets anonymous visitors create short links, optionally choose a custom alias, track click counts, copy links, generate QR codes, and manage the links created in their browser.

## Features

- Create a random six-character short code for an HTTP or HTTPS URL.
- Choose an optional custom alias using letters, numbers, hyphens, and underscores.
- Redirect short links to their original destination.
- Count visits to each shortened link.
- Display, refresh, copy, visit, and delete a visitor's links.
- Generate QR codes for short links.
- Keep each visitor's link list separate with an HTTP-only anonymous-user cookie.
- Automatically expire links after 30 days through MongoDB's TTL index.

## Tech stack

| Area | Technology |
| --- | --- |
| Client | React 19, Vite, Tailwind CSS, Axios |
| UI helpers | Lucide React, React Toastify, qrcode.react |
| Server | Node.js, Express 5 |
| Database | MongoDB with Mongoose |

## Project structure

```text
day-11-url-shortner/
├── client/                     # React user interface
│   └── src/
│       ├── apis/api.jsx        # Axios client for /api/url
│       └── components/         # Form, link cards, QR code, delete dialog
├── server/                     # Express API
│   └── src/
│       ├── app/app.js          # Middleware and route registration
│       ├── config/             # Environment and MongoDB connection
│       ├── controllers/        # Shorten, list, redirect, and delete logic
│       ├── models/url.model.js # URL schema and TTL index
│       ├── routes/             # API routes
│       └── utils/              # Random-code generator
└── README.md
```

## Prerequisites

- Node.js 18 or later
- npm
- A running MongoDB instance (local or MongoDB Atlas)

## Installation and local development

1. Clone the repository and open this project directory:

   ```bash
   cd day-11-url-shortner
   ```

2. Install server dependencies:

   ```bash
   cd server
   npm install
   ```

3. Create `server/.env` using this template:

   ```env
   PORT=3000
   MONGO_URI=mongodb://127.0.0.1:27017/url-shortener
   CLIENT_URL=http://localhost:5173
   ```

   `PORT=3000` is important for the current client configuration: Vite proxies `/api` requests to `http://localhost:3000`, and the client builds short-link URLs with this same origin.

4. Start the API server:

   ```bash
   npm run dev
   ```

5. In a second terminal, install and start the client:

   ```bash
   cd client
   npm install
   npm run dev
   ```

6. Open the URL shown by Vite, normally `http://localhost:5173`.

## Available scripts

### Server

| Command | Description |
| --- | --- |
| `npm run dev` | Start Express with Nodemon. |
| `npm start` | Start Express with Node.js. |

### Client

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Create a production build. |
| `npm run preview` | Preview the production build. |
| `npm run lint` | Run ESLint. |

## API documentation

Base API path: `/api/url`

### Create a short URL

`POST /api/url`

Request body:

```json
{
  "url": "https://example.com/a/very/long/page",
  "alias": "optional-custom-name"
}
```

`alias` is optional. It may contain only letters, numbers, `-`, and `_`.

Success response (`201 Created`):

```json
{
  "message": "URL shortend successfully",
  "data": {
    "originalUrl": "https://example.com/a/very/long/page",
    "shortCode": "abc123"
  }
}
```

The first successful request creates an `anonymousUserId` HTTP-only cookie. If that same browser tries to shorten the same original URL without an alias, the API returns `400` with `URL already shorten`.

### List this visitor's URLs

`GET /api/url`

The request must include the anonymous-user cookie. Links are returned newest first.

```json
{
  "message": "URLs fetched successfully",
  "data": {
    "urls": [
      {
        "_id": "...",
        "originalUrl": "https://example.com",
        "shortCode": "abc123",
        "clicks": 0
      }
    ]
  }
}
```

### Delete one of this visitor's URLs

`DELETE /api/url/:id`

Only the browser whose anonymous-user cookie owns the link can delete it.

Success response:

```json
{ "message": "URL delete successfully" }
```

### Follow a short URL

`GET /:code`

Example: `http://localhost:3000/abc123`

The server returns a `302` redirect to the stored original URL and increments its click counter. Unknown codes return `404`.

## Validation and link lifetime

- URLs are required, must start with `http://` or `https://`, and cannot exceed 2,048 characters.
- Custom aliases must be globally unique.
- Each URL document receives an `expiresAt` value 30 days after creation.
- MongoDB's TTL monitor removes expired documents asynchronously, so deletion may occur shortly after (rather than exactly at) the expiry time.

## Production notes

- Set `CLIENT_URL` to the deployed frontend origin and configure CORS to allow it with credentials.
- Update the Vite proxy and the client-side short-link origin currently hard-coded as `http://localhost:3000` before deployment; use a public server URL or an environment variable instead.
- Use HTTPS in production so browser cookies and redirect traffic are protected.
- MongoDB TTL expiry deletes the link record; it does not prevent a destination URL from changing independently.

## License

This project currently has no license file. Add one before distributing or reusing the code under specific terms.
