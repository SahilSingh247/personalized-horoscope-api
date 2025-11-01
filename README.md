# Personalized Horoscope API
A backend service that generates and serves personalized daily horoscopes for users based on their zodiac sign. This assignment focuses on creating the core APIs, storing user data, and fetching daily horoscope content.

## Requirements

- Node.js (v16+ recommended) and npm
- Docker (for running PostgreSQL in a container)
- AI used: GitHub Copilot(with GPT 5.0) for code suggestions and generating horoscope data 

This project already includes a simple PostgreSQL connection at `src/postgresql/index.js` which is pre-configured to connect to:

- host: `localhost`
- port: `5431` (host port)
- user: `postgres`
- database: `horoscope_db`
- password: `mysecretpassword`

If you prefer to change any of these values, edit `src/postgresql/index.js` or replace it with a connection that reads environment variables.

## Clone the repository

Open PowerShell and run:

```powershell
git clone https://github.com/SahilSingh247/personalized-horoscope-api.git
cd personalized-horoscope-api
```

## Run PostgreSQL in Docker on port 5431 (Windows PowerShell)

The project expects a PostgreSQL server accessible at localhost:5431. The easiest way on Windows is to run a Docker container mapping the container's 5432 port to host 5431.

Run this in PowerShell:

```powershell
docker run --name personalized-horoscope-db -e POSTGRES_PASSWORD=mysecretpassword -e POSTGRES_USER=postgres -e POSTGRES_DB=horoscope_db -p 5431:5432 -d postgres:16
```

Notes:
- This creates a container named `personalized-horoscope-db` and exposes it on `localhost:5431`.
- The container's internal PostgreSQL default port (5432) is mapped to host port 5431.

Wait a few seconds for PostgreSQL to initialize. You can check container logs with:

```powershell
docker logs -f personalized-horoscope-db
```

### Create the required table

This repository doesn't include automated migrations, so you should create the `users` table before registering users.

Option A — run psql interactively inside the container (recommended):

```powershell
docker exec -it personalized-horoscope-db psql -U postgres -d horoscope_db
```

Then at the `psql` prompt paste and run:

```sql
CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name TEXT NOT NULL,
	email TEXT UNIQUE NOT NULL,
	password TEXT NOT NULL,
	birthdate DATE NOT NULL,
	zodiac_sign TEXT,
	created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
\q
```

Option B — one-liner (PowerShell):

```powershell
docker exec -it personalized-horoscope-db psql -U postgres -d horoscope_db -c "CREATE TABLE users (id SERIAL PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL, password TEXT NOT NULL, birthdate DATE NOT NULL, zodiac_sign TEXT, created_at TIMESTAMP WITH TIME ZONE DEFAULT now());"
```

If you use a different DB name, user, or password update `src/postgresql/index.js` accordingly.

## Install dependencies and start the server

Install Node dependencies and start the app (PowerShell):

```powershell
npm install
npm run start
```

By default the server listens on port `3000` (see `src/server.js`). You should see a message like `Server is running on port 3000`.

## API: Authentication (example)

Base URL: http://localhost:3000

### POST /api/auth/signup

Create a new user. Request and response are JSON.

Request (application/json)

Body fields:
- `name` (string) — user's full name
- `email` (string) — unique user email
- `password` (string) — plaintext password (will be hashed by the server)
- `birthdate` (string or date) — ISO date (e.g. `1990-05-21`), used to compute zodiac sign

Example request body:

```json
{
	"name": "Jane Doe",
	"email": "jane@example.com",
	"password": "s3cret",
	"birthdate": "1990-05-21"
}
```

Successful response (201 Created):

```json
{
	"message": "User created successfully",
	"user": {
		"id": 1,
		"name": "Jane Doe",
		"email": "jane@example.com",
		"zodiac_sign": "Gemini"
	}
}
```

Error responses:
- 400 Bad Request — missing fields or user already exists
- 500 Internal Server Error — server/database error

## Testing the API on Windows

You can test the endpoint with `curl`, PowerShell `Invoke-RestMethod`, or Postman.

Curl (PowerShell):

```powershell
curl -X POST http://localhost:3000/api/auth/signup -H "Content-Type: application/json" -d '{"name":"Jane Doe","email":"jane@example.com","password":"s3cret","birthdate":"1990-05-21"}'
```

PowerShell (recommended because it handles JSON nicely):

```powershell
$body = @{ name = 'Jane Doe'; email = 'jane@example.com'; password = 's3cret'; birthdate = '1990-05-21' } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri 'http://localhost:3000/api/auth/signup' -Body $body -ContentType 'application/json'
```

Postman / REST clients:
- Set POST to `http://localhost:3000/api/auth/signup`
- Choose `application/json` and paste the JSON body above
- Send and inspect the response

## Verifying data in the database

To inspect the `users` table values from the container:

```powershell
docker exec -it personalized-horoscope-db psql -U postgres -d horoscope_db -c "SELECT id, name, email, zodiac_sign, created_at FROM users;"
```

Or run `psql` interactively and `SELECT * FROM users;`.

## Troubleshooting

- If the app can't connect to PostgreSQL, confirm the container is running and that port `5431` is not blocked by firewall.
- If you changed DB credentials, update `src/postgresql/index.js`.
- If you see errors about missing tables, make sure you created the `users` table as shown above.

## Notes

- This README shows a minimal development setup using Docker for PostgreSQL. For production, move DB credentials to environment variables, add migrations, and secure secrets.

If you want, I can add a small SQL migration script under `scripts/` and a simple `npm` script that applies it automatically. Would you like that?
A backend service that generates and serves personalized daily horoscopes for users based on their zodiac sign. This assignment focuses on creating the core APIs, storing user data, and fetching daily horoscope content.
