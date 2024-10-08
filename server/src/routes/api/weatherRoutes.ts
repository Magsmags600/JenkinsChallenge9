import { Router, type Request, type Response } from 'express';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  try {
    const { cityName } = req.body;
    if (!cityName) {
      return res.status(400).json({ error: 'City name is required' });
    }

    // Get weather data from WeatherService
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save city to search history
    await HistoryService.addCity(cityName);

    // Return the weather data
    return res.status(200).json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history (Suppress warning by using _req)
router.get('/history', async (_req: Request, res: Response) => {
  try {
    // Retrieve search history from HistoryService
    const history = await HistoryService.getCities();
    return res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching search history:', error);
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  try {
    const cityId = req.params.id;
    // Delete city from history using HistoryService
    await HistoryService.removeCity(cityId);
    return res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
    console.error('Error deleting city from history:', error);
    return res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;
