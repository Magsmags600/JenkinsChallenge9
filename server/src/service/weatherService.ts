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
import dayjs, { type Dayjs } from 'dayjs';
import dotenv from 'dotenv';
dotenv.config();

interface Coordinates {
  cityName: string;
  latitude: number;
  longitude: number;
  countryCode: string;
  region?: string;
}

class Weather {
  constructor(
    public cityName: string,
    public date: string,
    public temperature: number,
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
      return await response.json();
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
    return {
      cityName: name,
      latitude: lat,
      longitude: lon,
      countryCode: country,
      region: state,
    };
  }

  private buildGeocodeQuery(): string {
    return `${this.baseUrl}/geo/1.0/direct?q=${this.cityName}&limit=1&appid=${this.apiKey}`;
  }

  private buildWeatherQuery(coordinates: Coordinates): string {
    return `${this.baseUrl}/data/2.5/forecast?lat=${coordinates.latitude}&lon=${coordinates.longitude}&units=imperial&appid=${this.apiKey}`;
  }

  private async fetchAndDestructureLocationData(): Promise<Coordinates> {
    const locationData = await this.fetchLocationData(this.buildGeocodeQuery());
    return this.destructureLocationData(locationData);
  }

  private async fetchWeatherData(coordinates: Coordinates): Promise<Weather[]> {
    try {
      const response = await fetch(this.buildWeatherQuery(coordinates));
      const weatherData = await response.json();
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

    const noonForecasts = weatherData.filter((entry: any) =>
      entry.dt_txt.includes('12:00:00')
    );

    noonForecasts.forEach((day: any) => {
      forecastArray.push(
        new Weather(
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
