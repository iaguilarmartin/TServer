# TServer

A Tile Server built using Mapnik and NodeJS

## How to use it?

Install server dependencies with the following command

```
npm install
```

Run server
```
npm start
```
To see the server in action just open **index.html** file in your browser

### Change default server listening port

By default server runs on port **8888**. If you want to change just start server with the following command:
```
PORT=5005 npm start
```

### Run server unit tests

Unit tests have been implemented using mocha and chai. To run them just execute the following command:
```
npm test
```

### Generate server documentation

All modules and methods of this application have been documented using jsdoc. To generate a Web page with this information execute:
```
npm run document
```

Web site files will created inside docs folder.