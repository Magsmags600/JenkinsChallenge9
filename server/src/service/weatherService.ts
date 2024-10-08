import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config();

interface Coordinates {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string | undefined;  // Allow state to be string or undefined
}

class Weather {
  constructor(
    public cityName: string,
    public date: string,
    public temp: number,
    public windSpeed: number,
    public humidity: number,
    public icon: string,
    public description: string
  ) {}
}

class WeatherService {
  private baseUrl: string;
  private apiKey: string;
  private cityName = '';

  constructor() {
    this.baseUrl = process.env.API_BASE_URL || '';
    this.apiKey = process.env.API_KEY || '';
  }

  private async fetchLocationData(query: string): Promise<Coordinates[]> {
    try {
      const response = await fetch(query);
      const data = await response.json() as Coordinates[];  // Assert type here
      return data;
    } catch (error) {
      console.error('Error fetching location data:', error);
      throw error;
    }
  }

  private destructureLocationData(data: Coordinates[]): Coordinates {
    if (!data[0]) {
      throw new Error('City not found');
    }
    const { name, lat, lon, country, state } = data[0];
    return { name, lat, lon, country, state };
  }

  private buildGeocodeQuery(): string {
    return `${this.baseUrl}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseUrl}/data/2.5/forecast?lat=${coordinates.lat}&lon=${coordinates.lon}&units=imperial&appid=${this.apiKey}`;
  }

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather[]> {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates));
      const weatherData = await response.json() as { list: any[] };  // Assert type here
      if (!weatherData.list) {
        throw new Error('Weather data not available');
      }

      const currentWeather = this.parseCurrentWeather(weatherData.list[0]);
      const forecast = this.buildForecastArray(currentWeather, weatherData.list);
      return forecast;
    } catch (error) {
      console.error('Error fetching weather data:', error);
      throw error;
    }
  }

  private parseCurrentWeather(data: any): Weather {
    const date = new Date(data.dt * 1000).toLocaleDateString();
    return new Weather(
      this.cityName,
      date,
      data.main.temp,
      data.wind.speed,
      data.main.humidity,
      data.weather[0].icon,
      data.weather[0].description || data.weather[0].main
    );
  }

  private buildForecastArray(currentWeather: Weather, weatherData: any[]): Weather[] {
    const forecastArray: Weather[] = [currentWeather];
    const noonForecasts = weatherData.filter((entry: any) => entry.dt_txt.includes('12:00:00'));

    noonForecasts.forEach((day: any) => {
      forecastArray.push(
        new Weather(
          //change to .city remove Name
          this.cityName,
          new Date(day.dt * 1000).toLocaleDateString(),
          
          day.main.temp,
          day.wind.speed,
          day.main.humidity,
          day.weather[0].icon,
          day.weather[0].description || day.weather[0].main
        )
      );
    });

    return forecastArray;
  }

  async getWeatherForCity(city: string): Promise<Weather[]> {
    this.cityName = city;
    const coordinates = await this.fetchAndDestructureLocationData();
    return this.fetchWeatherData(coordinates);
  }
}

export default new WeatherService();
