## Clone the Application

To clone this application, just make use of

```bash
git clone https://github.com/AdetolaAremu/HuxBackend.git
```

## 1. To run the application you need to run

```js
npm install
```

This will install the packages and type dependencies i.e

```js
bcryptjs;
body - parser;
cors;
dotenv;
express;
express - mongo - sanitize;
express - rate - limit;
express - validator;
helmet;
jsonwebtoken;
mongoose;
nodemon;
pg;
ts - node;
tsc;
xss;
xxx - clean;
```

We also need to install type dependencies for the packages listed above such. Packages such as:

```js
@types/body-parser
@types/cors
@types/express
@types/express-validator
@types/jest
@types/node
@types/pg
types/supertest
```

This is a Typescript application, by default it will come with the tsconfig file.

## 2. ENVIRONMENT VARIABLES

You need environment variables for the code to work effectively. So please create ".env" file in your root folder. Contained in the file should be:

```js
DATABASE=mongodb+srv://name:<password>@cluster.....mongodb.net/hux
DATABASE_PASSWORD=name123
PORT=3002
JWT_SECRET=aaaaaa
EXPIRES_IN=1h
NODE_ENV=development // or development
```

## 3. Run the application

To run the application we will use a script in our package json with the name "start". So, in your terminal run:

```bash
npm start
```

OR

```bash
npm run start
```

The application should will run effectively after this
