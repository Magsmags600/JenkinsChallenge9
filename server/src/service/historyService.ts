import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Use this in place of __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Path to the db.json file
const dbFilePath = path.join(__dirname, '../../db/db.json');

// Define the City class
class City {
  constructor(public id: string, public name: string) {}
}

class HistoryService {
  // Read method to read from db.json
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(dbFilePath, 'utf-8');
      const parsedData = JSON.parse(data);

      // Assuming db.json contains a key 'cities' that stores the city history
      return parsedData.cities || [];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  // Write method to write updated cities array to db.json
  private async write(cities: City[]): Promise<void> {
    try {
      const data = await fs.readFile(dbFilePath, 'utf-8');
      const dbContent = JSON.parse(data);

      // Update the cities key in the dbContent
      dbContent.cities = cities;

      // Write the updated content back to db.json
      await fs.writeFile(dbFilePath, JSON.stringify(dbContent, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing to search history:', error);
      throw error;
    }
  }

  // Get cities method to return cities as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }

  // Add city method to add a new city to db.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();
    const id = cityName.toLowerCase().replace(/\s+/g, '-'); // Generate a simple ID based on city name
    const city = new City(id, cityName);

    if (!cities.find((c) => c.name === cityName)) {
      cities.push(city);
      await this.write(cities);
    }
  }

  // BONUS: Remove city method to remove a city by ID from db.json
  async removeCity(id: string): Promise<void> {
    let cities = await this.read();
    cities = cities.filter((city) => city.id !== id);
    await this.write(cities);
  }
}

export default new HistoryService();
