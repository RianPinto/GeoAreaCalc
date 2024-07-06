import express from 'express';
import puppeteer from 'puppeteer';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

app.post('/fetch-map-data', async (req, res) => {
  const { url } = req.body;

  try {
    console.log(`Navigating to URL: ${url}`);
    
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.goto(url, { waitUntil: 'networkidle2' });

    const data = await page.evaluate(() => {
      const element = document.getElementById('U5ELMd');
      const nextDiv = element ? element.nextElementSibling : null;
      const width = nextDiv ? nextDiv.offsetWidth : 0;
      return {
        content: element ? element.textContent.trim() : '',
        width,

      };
    });

    await browser.close();

    res.json({ content: data.content, width: data.width});
  } catch (error) {
    console.error('Error fetching map data:', error);
    res.status(500).json({ error: 'Failed to fetch map data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
