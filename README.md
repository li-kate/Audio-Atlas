# Audio Atlas

Description

## Tools

- **Auth0**: Log in, log out, register (https://github.com/auth0/auth0-react/)
- **MongoDB Atlas**: Store user data
- **React**: Frontend (V19)

## Development

To run this project locally, there's some stuff to install and do.

**In same folder as src**

- npm install (npm@11.1.0)
- npm i react@latest react-dom@latest
- npm install @auth0/auth0-react axios
- npm install ajv@latest ajv-keywords@latest
- npm install --save react-router-dom

**In server folder**

- npm install express cors mongoose dotenv auth0

**In python-backend folder**

- pip install spotipy

**NOT NEEDED - Set up MongoDB Atlas**

- Need your own database and connection string into env file
- get connection string: https://www.mongodb.com/docs/guides/atlas/connection-string/

## Run the Web App

make 3 terminals

**cd python-backend**

- python app.py

**cd server**

- node index.js

**cd audio-atlas**

- npm start
