# Deadbolt 

# Update to v2 from v1

- `POST /session` will return the user in an envelope now, and will return Two Factor Auth data if needed.
- `POST /user` will return the user in an envelope now, and will return Two Factor Auth data if needed.
- Migrations have been added.
- Database can now be seeded
- Passwords can easily by reset (for development) by changing the `passwordHash` to "plain:whatever". Will be converted to proper hash when login occurs.

# Intro

Just another user authentication library running on Express and Typescript. This project mainly exists to satisfy my curiosity around Express, Typescript, testing, databases, etc.

This service is meant to run as a microservice within your cluster/swarm/whatever. The API is not meant to be exposed to the public.

## Supported settings

All settings can be set through environment variables or a `.env` file in the root of the project. If a settings exists in both, the environment variable will be used.

- PORT - Which port to let Express listen on.
- DB_HOST - Mysql server host
- DB_USER - Mysql server user
- DB_PASS - Mysql server password
- DB_PORT - Mysql server port
- DB_NAME - Mysql Database name
- RESET_TOKEN_EXPIRES_HOURS - The amount of hours before a password reset token expires. Defaults to 24.
- CONFIRM_TOKEN_EXPIRES_HOURS = The amount of hours before a email confirm token expires. Defaults to 24 * 7.
- SESSION_HOURS - The amount of hours a new session is valid. Defaults to 24 * 14.

## To develop

```sh
# Start a development server that watches for changes.
npm run serve 
```

## To run for realsies

```sh
# Start transpiled version of the app
npm run start
```

## To test

```sh
# Start transpiled version of the app
npm test
```

## todo