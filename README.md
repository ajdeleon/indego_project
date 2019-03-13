# Indego Bike Map

This project is inspired by open source [front](https://github.com/punkave/frontend-challenge) and [backend](https://github.com/punkave/frontend-challenge) challenges found on the [P'unk Avenue](https://punkave.com/) Github.

The main goal was to create a map showing bike availability for [Indego bikes ](https://www.rideindego.com/) using their public API. Rather than pulling directly from their API endpoint the data is pulled hourly and stored in a mongodb database for historical tracking. An Express API server interfaces with the DB to provide custom endpoints providing the data needed for the project. This data is then consumed by a javascript frontend with the help of the Google Maps API.

I'll go through each service of the project to document how it works and some of my design choices that were motivated by personal preference and roadblocks I encountered along the way.

## Docker-compose

The project uses docker to help with orchestrating the different services in this project. The easiest way to get started is to run the following command from the root of the project:

`docker-compose up`

One issue I ran into while using docker-compose is that there are no directives built in that allow you to tell one service to wait for another before starting up. This was causing issues with the express server since it was trying to connect to mongodb before mongo was ready for connections. This would result in the server exiting with an error so that the entire project would not work. In order to resolve this I used a bash script upon startup of the node server that attempts to make a connection to mongodb every 15 seconds until it is successful. I have since found that this is a pretty common issue with docker and most people handle it in a similar way. While it took a while to debug I think it does make the node server a little more reliable in general even outside of docker since it will handle a database error a little more gracefully. I think the error messaging around this situation when a db connection can't be made could be better still.

Another issue I ran into is that while docker-compose makes networking between containers very easy, I got stuck on the fact that when the browser requests data from the server, the source is the browser itself and not the client container. This makes it impossible to use the built in networking where you can make requests by container name. So instead of requesting data from http://api/stations I had to open up the server port on the host IP and then request the actual address of the server directly.

## Node API

### Getting started

To start the node server in watchmode with the help of `nodemon` run:

`npm run dev`

### Tests

Unit tests are written for all routes with. [ Mocha ](https://mochajs.org/) is used as a test runner and [ Chai ](https://www.chaijs.com/) is used as an assertion library.

To run unit tests make sure the server is stopped then run:

`npm run test`

### Returned data structures

#### Station

```
{
  "_id": mongodb ID,
  "addressStreet": String,
  "addressZipCode": String,
  "bikesAvailable": Num,
  "docksAvailable": Num,
  "kioskId": Num,
  "name": String,
  "latitude": Num,
  "longitude": Num,
  "weather": mongodb ID,
  "at": Date,
  "updatedAt": Date
}
```

#### Weather
```
{
  "_id": mongodb ID,
  "temp": Num,
  "pressure": Num,
  "humidity": Num,
  "temp_min": Num,
  "temp_max": Num,
  "weather": ["main": String, "description": String],
  "at": Date,
  "updatedAt": Date
}
```

### Routes

`GET /stations`
Returns a list of stations and the weather at a specific time.
- "at" parameter is rounded down to the closest hourly data available.
- "at" is required or else the entire collection will be returned.

#### Query Parameters:

>**at**
 - string [date-time]
 - **required**
 - timestamp of the pulled data (yyyy-mm-ddThh:mm:ss.fffZ)
 - default: none


>**frequency**
 - string Enum: "daily", "hourly"
 - default: hourly


>**to & from**
 - strings [date-time]
 - the timestamp boundaries of desired data (yyyy-mm-ddThh:mm:ss.fffZ)
 - can be used in place of "at" if date range is desired
 - if one is used the other must also be used

#### Example:

 `curl http://localhost:4000/stations?at=2019-02-03T04:00:01.267Z`

#### Success Response:

```
{
  "at": Date,
  stations": [ array of type Station ],
  "weather": { object of type Weather }
}
```

#### Error response:
```
{
  "error": String
}
```

---

`GET /stations/:id`
Returns a single station and the weather over a period of time.

### Path Parameters:
>**:id**
 - id of the desired station

#### Query Parameters:

>**at**
 - string [date-time]
 - timestamp of the pulled data (yyyy-mm-ddThh:mm:ss.fffZ)
 - default: none


>**frequency**
 - string Enum: "daily", "hourly"
 - default: hourly


>**to & from**
 - strings [date-time]
 - the timestamp boundaries of desired data (yyyy-mm-ddThh:mm:ss.fffZ)
 - can be used in place of "at" if date range is desired
 - if one is used the other must also be used

#### Example:

 `curl http://localhost:4000/stations?at=2019-02-03T04:00:01.267Z`

#### Success Response:

```
{
  "at": Date,
  stations": [ array of type Station ],
  "weather": { object of type Weather }
}
```

#### Error response:
```
{
  "error": String
}
```

---

`GET /stations/recent`
Returns the most recently collected data for all of the stations

#### Example:

 `curl http://localhost:4000/stations/recent`

#### Success Response:

```
{
  "at": Date,
  stations": [ array of type Station ],
  "weather": { object of type Weather }
}
```

#### Error response:
```
{
  "error": String
}
```

### Cron

There is a cron job that runs every hour on the hour to pull in data from the Indego API and from the OpenWeather API. This cron can be found in `/api/services/updateDatabase.js`

The cron modifies the returned slightly for the needs of the project then saves the data directly to the Mongo database.

One issue I ran into was that for some reason I wasn't able to get `axios` to work with pulling data from the Indego API. There were some cross origin issues that I could not quite solve from the node side. The workaround I came up with was to use a promise wrapped https request using node's built in `https` module. While a little clunkier than using a framework like `axios` it still ended up working just as well and gave me a nice refresher on what goes on behind the scenes of tools like `axios` and `fetch`.

## MongoDB

In the past I had found that the hardest part of using Mongo was the actual setup process. Docker made this so easy that it was a breeze to use.

Models and schema are provided with the help of [mongoose](https://mongoosejs.com/). This makes mongo a little safer to use in my experience, since without appropriate schemas it is very free for all and doesn't provide reliable data from within collections.

All of the model information is in the `/api/models` directory and imported as needed into other sections of the project.

## Client

The client is the simplest part of the project. It is a basic HTML page that loads up a Google Map.

An API call to the backend server is made initially and all of the returned data is translated to Markers and Info Windows in the request callback. I found the Google documentation to be top notch with plenty of examples and clear organization. This made using it a pleasant experience with few kinks along the way.

The Client docker container consists of just a few static files (html, css, js) that are served via Nginx. I had initially thought about setting up a separate Nginx container to act as a reverse proxy between the Client and Server but in the end I decided that the extra complexity was not necessary for this sized project. For a larger project I would consider it because it would help to log access logs using something like Elasticsearch which I have done in previous projects and found to be highly useful.
