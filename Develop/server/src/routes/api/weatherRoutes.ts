// import { Router, type Request, type Response } from 'express';
// const router = Router();

// // import HistoryService from '../../service/historyService.js';
// // import WeatherService from '../../service/weatherService.js';

// // TODO: POST Request with city name to retrieve weather data
// router.post('/', (req: Request, res: Response) => {
//   // TODO: GET weather data from city name
//   // TODO: save city to search history
// });

// // TODO: GET search history
// router.get('/history', async (req: Request, res: Response) => {});

// // * BONUS TODO: DELETE city from search history
// router.delete('/history/:id', async (req: Request, res: Response) => {});

// export default router;
import { Router, type Request, type Response } from 'express';
import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

const router = Router();

// POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { cityName } = req.body;

  // Check if cityName is provided
  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Get weather data from WeatherService
    const weatherData = await WeatherService.getWeatherForCity(cityName);

    // Save city to search history if weather data is retrieved
    await HistoryService.addCity(cityName);

    // Return weather data to the client
    return res.json(weatherData);
  } catch (error) {
    console.error('Error fetching weather data:', error);
    return res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (_req: Request, res: Response) => {
  try {
    // Get search history from HistoryService
    const history = await HistoryService.getCities();

    // Return history to the client
    return res.json(history);
  } catch (error) {
    console.error('Error retrieving search history:', error);
    return res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Remove city from search history using HistoryService
    await HistoryService.removeCity(id);

    // Return success message
    return res.json({ message: 'City deleted from history' });
  } catch (error) {
    console.error('Error deleting city from search history:', error);
    return res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;
