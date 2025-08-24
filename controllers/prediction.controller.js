import got from 'got';
import db from '../database.js'
import dotenv from 'dotenv'; 
dotenv.config()

// Imagga API credentials
const apiKey = process.env.IMAGGA_API_KEY;
const apiSecret = process.env.IMAGGA_API_SECRET ;

async function prediction(req, res) {
  const { url, id } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'Missing image URL' });
  }

  try {
    // Call Imagga API with limit parameter to get more results
    const imaggaUrl = 'https://api.imagga.com/v2/tags?image_url=' + encodeURIComponent(url) + '&limit=10';
    const response = await got(imaggaUrl, {
      username: apiKey, 
      password: apiSecret,
      responseType: 'json'
    });

    // Parse the response if it's a string
    const responseData = typeof response.body === 'string' 
      ? JSON.parse(response.body) 
      : response.body;
      
    // Extract tags from response
    let predictions = responseData.result.tags.map(tag => ({
      name: tag.tag.en,
      value: tag.confidence / 100 // Convert confidence to 0-1 range to match previous format
    }));
    
    // Ensure we have at least 3 predictions
    if (predictions.length < 3) {
      // Add generic predictions if we don't have enough
      const genericPredictions = [
        { name: "object", value: 0.5 },
        { name: "image", value: 0.4 },
        { name: "photo", value: 0.3 }
      ];
      
      // Add only as many generic predictions as needed
      const neededCount = 3 - predictions.length;
      predictions = [...predictions, ...genericPredictions.slice(0, neededCount)];
    }

    // Update entries and send JSON response with predictions and entries
    const entries = await db('users')
      .where('id', '=', id)
      .increment('entries', 1)
      .returning('entries');

    res.json({ 
      predictions, 
      entries: entries[0].entries 
    });
  } catch (error) {
    console.error("API Error:", error.message);
    if (error.response) {
      console.error("Response body:", error.response.body);
    }
    res.status(500).json({ error: "Error processing image" });
  }
}

export {prediction};