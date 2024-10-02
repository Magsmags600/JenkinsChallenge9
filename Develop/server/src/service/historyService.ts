// // TODO: Define a City class with name and id properties

// // TODO: Complete the HistoryService class
// class HistoryService {
//   // TODO: Define a read method that reads from the searchHistory.json file
//   // private async read() {}
//   // TODO: Define a write method that writes the updated cities array to the searchHistory.json file
//   // private async write(cities: City[]) {}
//   // TODO: Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
//   // async getCities() {}
//   // TODO Define an addCity method that adds a city to the searchHistory.json file
//   // async addCity(city: string) {}
//   // * BONUS TODO: Define a removeCity method that removes a city from the searchHistory.json file
//   // async removeCity(id: string) {}
// }

// export default new HistoryService();
import fs from 'fs/promises';
import path from 'path';

// Define a City class with name and id properties
class City {
  constructor(public id: string, public name: string) {}
}

// Path to the searchHistory.json file
const dbPath = path.join(__dirname, '../searchHistory.json');

class HistoryService {
  // Define a read method that reads from the searchHistory.json file
  private async read(): Promise<City[]> {
    try {
      const data = await fs.readFile(dbPath, 'utf-8');
      return JSON.parse(data) || [];
    } catch (error) {
      console.error('Error reading search history:', error);
      return [];
    }
  }

  // Define a write method that writes the updated cities array to the searchHistory.json file
  private async write(cities: City[]): Promise<void> {
    try {
      await fs.writeFile(dbPath, JSON.stringify(cities, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error writing search history:', error);
    }
  }

  // Define a getCities method that reads the cities from the searchHistory.json file and returns them as an array of City objects
  async getCities(): Promise<City[]> {
    return this.read();
  }

  // Define an addCity method that adds a city to the searchHistory.json file
  async addCity(cityName: string): Promise<void> {
    const cities = await this.read();

    // Check if the city already exists in the search history
    const cityExists = cities.some(city => city.name.toLowerCase() === cityName.toLowerCase());
    if (!cityExists) {
      const newCity = new City(this.generateId(), cityName);
      cities.push(newCity);
      await this.write(cities);
    }
  }

  // BONUS: Define a removeCity method that removes a city from the searchHistory.json file
  async removeCity(id: string): Promise<void> {
    const cities = await this.read();
    const updatedCities = cities.filter(city => city.id !== id);
    await this.write(updatedCities);
  }

  // Helper function to generate a unique ID (could use a package like UUID)
  private generateId(): string {
    return Math.random().toString(36).substring(2, 9);
  }
}

export default new HistoryService();
