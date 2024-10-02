// import dotenv from 'dotenv';
// dotenv.config();

// // TODO: Define an interface for the Coordinates object

// // TODO: Define a class for the Weather object

// // TODO: Complete the WeatherService class
// class WeatherService {
//   // TODO: Define the baseURL, API key, and city name properties
//   // TODO: Create fetchLocationData method
//   // private async fetchLocationData(query: string) {}
//   // TODO: Create destructureLocationData method
//   // private destructureLocationData(locationData: Coordinates): Coordinates {}
//   // TODO: Create buildGeocodeQuery method
//   // private buildGeocodeQuery(): string {}
//   // TODO: Create buildWeatherQuery method
//   // private buildWeatherQuery(coordinates: Coordinates): string {}
//   // TODO: Create fetchAndDestructureLocationData method
//   // private async fetchAndDestructureLocationData() {}
//   // TODO: Create fetchWeatherData method
//   // private async fetchWeatherData(coordinates: Coordinates) {}
//   // TODO: Build parseCurrentWeather method
//   // private parseCurrentWeather(response: any) {}
//   // TODO: Complete buildForecastArray method
//   // private buildForecastArray(currentWeather: Weather, weatherData: any[]) {}
//   // TODO: Complete getWeatherForCity method
//   // async getWeatherForCity(city: string) {}
// }

// export default new WeatherService();
import dotenv from 'dotenv';
import fetch from 'node-fetch';

dotenv.config();

// Define an interface for the Coordinates object
interface Coordinates {
  lat: number;
  lon: number;
}

// Define a class for the Weather object
class Weather {
  constructor(
    public city: string,
    public date: string,
    public icon: string,
    public iconDescription: string,
    public tempF: number,
    public windSpeed: number,
    public humidity: number
  ) {}
}

// Complete the WeatherService class
class WeatherService {
  private baseURL: string = 'https://api.openweathermap.org/data/2.5/forecast';
  private apiKey: string = process.env.OPENWEATHER_API_KEY as string;
  private cityName: string = '';

  // Create fetchLocationData method
  private async fetchLocationData(query: string): Promise<any> {
    const geocodeUrl = this.buildGeocodeQuery(query);
    const response = await fetch(geocodeUrl);
    return await response.json();
  }

  // Create destructureLocationData method
  private destructureLocationData(locationData: any): Coordinates {
    const { lat, lon } = locationData[0];
    return { lat, lon };
  }

  // Create buildGeocodeQuery method
  private buildGeocodeQuery(query: string): string {
    return `http://api.openweathermap.org/geo/1.0/direct?q=${query}&limit=1&appid=${this.apiKey}`;
  }

  // Create buildWeatherQuery method
  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseURL}?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${this.apiKey}&units=imperial`;
  }

  // Create fetchAndDestructureLocationData method
  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.cityName);
    return this.destructureLocationData(locationData);
  }

  // Create fetchWeatherData method
  private async fetchWeatherData(coordinates: Coordinates): Promise<any> {
    const weatherUrl = this.buildWeatherQuery(coordinates);
    const response = await fetch(weatherUrl);
    return await response.json();
  }

  // Build parseCurrentWeather method
  private parseCurrentWeather(data: any): Weather {
    const current = data.list[0];
    return new Weather(
      data.city.name,
      new Date(current.dt * 1000).toLocaleDateString(),
      current.weather[0].icon,
      current.weather[0].description,
      current.main.temp,
      current.wind.speed,
      current.main.humidity
    );
  }

  // Complete buildForecastArray method
  private buildForecastArray(weatherData: any[]): Weather[] {
    return weatherData.slice(1, 6).map((item: any) => {
      return new Weather(
        item.city.name,
        new Date(item.dt * 1000).toLocaleDateString(),
        item.weather[0].icon,
        item.weather[0].description,
        item.main.temp,
        item.wind.speed,
        item.main.humidity
      );
    });
  }

  // Complete getWeatherForCity method
  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;

    // Step 1: Fetch and destructure location data (lat, lon)
    const coordinates = await this.fetchAndDestructureLocationData();

    // Step 2: Fetch weather data using coordinates
    const weatherData = await this.fetchWeatherData(coordinates);

    // Step 3: Parse current weather
    const currentWeather = this.parseCurrentWeather(weatherData);

    // Step 4: Build forecast array for next 5 days
    const forecast = this.buildForecastArray(weatherData.list);

    // Return current weather and forecast as an array
    return [currentWeather, ...forecast];
  }
}

export default new WeatherService();
