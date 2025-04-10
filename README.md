# Event Management System

## Prerequisite
1. Setup a PostgreSQL database and retrieve its URL.

    Reference URL: https://www.postgresql.org/download/

2. Configure Clerk and retrieve the essential keys following the setup instruction from
[here](https://clerk.com)

## Setup Steps
1. Using npm or yarn installl all the dependencies.
```
    npm install
```
2. Configure environment variables.
    - `DATABASE_URL` : PostgresSQL Database URL
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` : Public key for clerk integration
    - `CLERK_SECRET_KEY` : Secret key for clerk integration

## Build the next code.
```
    npm run build
```

## Run On Dev server
To run on the dev server run the following command,
```
    npm run dev
```

## Run On Production Server
To run on the production server the following command,
```
npm run start
```
You'll find your application at http://localhost:3000 as a result of the commands above.


## Run Using Docker
1. Build a docker image with the the following command whilst remaining in the project directory,
```
    docker build . -t eventms:latest
```
2. Start a container using the following command,
```
    docker run -p5050:3000 eventms:latest
```
The above commands binds the 5050 port of the host with the 3000 port of the container.
Hence you'll find your application at http://127.0.0.1:5050 or http://localhost:5050
