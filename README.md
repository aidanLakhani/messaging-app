# React Messaging App
## Features
- Works out of the box on LAN with automatic host ip detection
- Uses secure options in production only, speeding up the development workflow
- Utilizes WebSockets for near instantaneous messaging

## Development Setup
To develop the application locally, first clone the repository.

To install dependencies, run `npm install` in both the root and client directories. 

- Run `npm run dev` in root directory to start both server and client
- Run `npm run client` to start only the client
- Run `npm run server` to start only the server

You will need to create a file called `config.env` in the root directory and set these environment variables.
```
JWT_SECRET
JWT_EXPIRES_IN
MONGODB_URI
MONGODB_PASSWORD
```

## Deploying to Production
The client can be compiled into a static website with `npm run build` from the client directory. To preview the build, run `npm run preview`. Once the client is built, it can be deployed with any web server, or any static website hosting service.

The server should be run with `npm start` or `node server.js`, not with nodemon.
____
When deploying, these environment variables need to be set:

Client:
```
VITE_API_URL (URL to the server)
```
Server:
```
NODE_ENV=production (ensures the server runs securely)
```