const express = require('express');
const http = require('http');
const { Configuration, OpenAIApi } = require('openai');
const cors = require('cors'); // Import the 'cors' middleware
const port = 3000;
const dotenv = require('dotenv');
dotenv.config();
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors()); // Add the 'cors' middleware to handle CORS

// Replace 'YOUR_OPENAI_API_KEY' with your actual OpenAI API key
const openaiApiKey = process.env.key;
if (!openaiApiKey) {
  console.error('OpenAI API key is missing. Please set the OPENAI_API_KEY environment variable.');
  process.exit(1);
}

const configuration = new Configuration({
  apiKey: openaiApiKey,
});

const openai = new OpenAIApi(configuration);

app.get("/", (req, res) => {
  res.send("hi");
});

// Route for code conversion
app.post('/convert', async (req, res) => {
  try {
    const { code, targetLanguage } = req.body;

    // Send a request to the GPT-3.5 turbo model for code conversion
    const convertedCode = await makeOpenAIRequest(
      `Convert the following code from JavaScript to ${targetLanguage}: ${code}`
    );

    res.json({ convertedCode });
  } catch (error) {
    console.error('Error during code conversion:', error.message);
    res.status(500).json({ error: 'An error occurred during code conversion.' });
  }
});

// Route for code debugging
app.post('/debug', async (req, res) => {
  try {
    const { code } = req.body;

    // Send a request to the GPT-3.5 turbo model for code debugging
    const debuggingOutput = await makeOpenAIRequest(`Debug the following code: ${code}`);

    res.json({ debuggingOutput });
  } catch (error) {
    console.error('Error during code debugging:', error.message);
    res.status(500).json({ error: 'An error occurred during code debugging.' });
  }
});

// Route for code quality check
app.post('/qualitycheck', async (req, res) => {
  try {
    const { code } = req.body;

    // Send a request to the GPT-3.5 turbo model for code quality check
    const qualityCheckOutput = await makeOpenAIRequest(
      `Assess the quality of the following code: ${code}`
    );

    res.json({ qualityCheckOutput });
  } catch (error) {
    console.error('Error during code quality check:', error.message);
    res.status(500).json({ error: 'An error occurred during code quality check.' });
  }
});

// Function to make a request to OpenAI API
async function makeOpenAIRequest(prompt) {
  const response = await openai.createChatCompletion({
    model: 'gpt-3.5-turbo',
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.',
      },
      {
        role: 'user',
        content: prompt,
      },
    ],
  });

  return response.data.choices[0].message.content;
}

// Start the server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
