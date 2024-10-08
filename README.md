# Weather Tracker Application

## Project Overview

The **Weather Tracker** is a server-side application built in TypeScript that interacts with the OpenWeather API to retrieve 5-day weather forecasts. Users can search for weather data by city, and their search history is stored in a JSON file. The client-side code is pre-built and cannot be modified, so the focus is on developing the server-side functionalities.

## Userstory
As a developer, I want to build a weather tracker that provides users with accurate 5-day weather forecasts for any city they search. The application should also store their search history, allowing users to review or delete previously searched cities. The server-side logic should interface with the OpenWeather API and be able to handle user input for weather queries, save data to a JSON file, and be easily deployable to a hosting platform like Render.

## Features

- **Fetch Weather Data**: Retrieves 5-day weather forecasts for any city using the OpenWeather API.
- **Search History**: Stores a history of user searches, which can be retrieved or deleted.
- **RESTful API**: Exposes routes for managing weather data and search history.
- **Environment Variables**: Uses `.env` to securely manage the OpenWeather API key.

## Server-side Structure
The project’s server-side code is organized as follows:

Routes: Handles API and HTML requests.
routes/api/index.ts: Entry point for all API routes.
routes/api/weatherRoutes.ts: Manages weather data retrieval and search history handling.
routes/htmlRoutes.ts: Serves the front-end HTML page.
Services: Implements the business logic for handling weather and search history.
service/historyService.ts: Manages reading, writing, and manipulating the searchHistory.json file.
service/weatherService.ts: Handles API calls to the OpenWeather service and data parsing.
Server:
server.ts: Sets up the Express server, middleware, and connects routes.

## Deployment
https://jenkinschallenge9-weather.onrender.com/

# 
https://github.com/Magsmags600/JenkinsChallenge9/tree/main


## Questions

If you have any questions or encounter any issues, please feel free to reach out via the following:

GitHub: magsmags600
#
Email: margaretjenkins@gmail.com


## License
This project is licensed under the MIT License.

