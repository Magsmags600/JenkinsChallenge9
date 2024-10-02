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

  if (!cityName) {
    return res.status(400).json({ error: 'City name is required' });
  }

  try {
    // Get weather data from WeatherService
    const weatherData = await WeatherService.getWeatherByCityName(cityName);

    // Save city to search history
    await HistoryService.addCityToHistory(cityName);

    // Return weather data to the client
    res.json(weatherData);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve weather data' });
  }
});

// GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    // Get search history from HistoryService
    const history = await HistoryService.getSearchHistory();

    // Return history to the client
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve search history' });
  }
});

// BONUS: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    // Remove city from search history using HistoryService
    await HistoryService.deleteCityFromHistory(id);

    // Return success message
    res.json({ message: 'City deleted from history' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete city from search history' });
  }
});

export default router;
