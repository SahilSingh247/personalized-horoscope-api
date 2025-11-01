# Personalized Horoscope API
A backend service that generates and serves personalized daily horoscopes for users based on their zodiac sign. This assignment focuses on creating the core APIs, storing user data, and fetching daily horoscope content.

## Design decisions (current system)
- Architecture: small Express.js API with clear separation — routes, controllers, middleware (JWT auth, rate-limit), and utils for zodiac logic and the horoscope store. Keeps responsibilities separated and easy to test.
- Data model:
	- A lightweight `zodiac -> horoscope templates` storage (DB-backed).
	- A utility `getZodiac` to map birthdate → zodiac.
	This approach is simple, fast, and easy to seed/update.
- Generation approach: template-driven messages (DB templates + simple variables) produced at request-time. This minimizes storage and makes updates simple. Rate limiting and JWT protect abuse and personalization endpoints.

## Improvements I'd make with more time
- Robust infra:
	- Introduce Redis for caching to reduce repeated generation.
	- Configure read replicas and/or partitioning for DB scaling.
- Personalization quality:
	- Support better user profiles (birthplace/time, preferences) for more accurate personalization.
	- Use a templating engine with conditional logic and variable substitution for flexible message composition.
	- Optionally add lightweight ML or rule-based models to match style/personality to user preferences.
- Security & privacy:
	- Stronger PII handling (minimal storage, access controls) and encryption at rest.
	- Permissioned access controls, audit logs, and deletion workflows for compliance.

## How this will scale when each user gets a personalized horoscope

- Caching with Redis
	- Key scheme: `horoscope:{date}:{userId}` with a TTL set to 24h.
		- Explanation: using a date+user key ensures each user's daily horoscope is cached independently while keeping keys compact and predictable.
	- Cache-first flow: Redis → Postgres → generate → write back.
		- Explanation: Try Redis first for low latency. On miss, read user/profile data from Postgres and attempt to fetch any stored personalized result. If still missing, generate the horoscope (fast template or worker-assisted), write the result back to Redis and optionally persist to Postgres (if historical snapshots are required).
	- Benefits & trade-offs: drastically reduces compute and latency for repeat requests; must manage cache invalidation when templates or personalization logic change.

- Autoscaling
	- Scale stateless Node instances horizontally using metrics like CPU (target 50–70%) and request rate (RPS).
		- Explanation: stateless servers are easy to scale behind a load balancer; CPU and request-rate-based autoscaling balances cost and responsiveness. Include health/readiness probes to avoid routing traffic to unhealthy instances.
	- Use a load balancer (or API gateway), connection pooling for the DB, and ephemeral local caches only for per-instance transient state.
		- Explanation: pooling reduces DB connections and improving throughput; avoid sticky sessions unless needed — prefer token-based auth (JWT) for statelessness.

- Database Indexing (Postgres)
	- Create unique index on `users(email)` and composite index on `personalized_horoscopes(user_id, date)`.
		- Explanation: `users(email)` uniqueness enforces data integrity and speeds lookups during auth/registration. The composite index makes fetching a single user's horoscope for a specific date fast and efficient.
	- Partition `personalized_horoscopes` table by date (monthly) and index the `date` column.
		- Explanation: range (monthly) partitioning reduces query/maintenance cost for large historical datasets and keeps indexes smaller. Indexing `date` helps time-range queries (e.g., analytics or export) perform well.

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

CREATE TABLE horoscope_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    zodiac_sign VARCHAR(20) NOT NULL,
    date DATE NOT NULL,
    horoscope_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, date)
);
\q
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

