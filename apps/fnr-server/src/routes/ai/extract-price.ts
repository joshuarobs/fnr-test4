import { Request, Response } from 'express';
import OpenAI from 'openai';
import axios from 'axios';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to fetch HTML content from a URL
async function fetchHtml(url: string): Promise<string> {
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching HTML:', error);
    throw new Error('Failed to fetch HTML from URL');
  }
}

export const extractPrice = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Fetch HTML content from the URL
    const html = await fetchHtml(url);

    // Create the prompt with the fetched HTML
    const prompt = `Below I have provided the HTML source of a webpage that contains product information. Please analyze this HTML and extract the product name and price details.

Return your answer as a JSON object with the following structure. Here's an example of what your response should look like:
\`\`\`json
{
  "status": "success", 
  "timestamp": "CURRENT_DATETIME",
  "url": "EXTRACTED_URL",
  "product": {
    "name": "PRODUCT_NAME",
    "price": {
      "current": NUMERIC_PRICE,
      "currency": "CURRENCY_CODE",
      "formatted": "FORMATTED_PRICE",
      "isOnSale": BOOLEAN,
      "originalPrice": ORIGINAL_PRICE_IF_ON_SALE
    },
    "availability": "AVAILABILITY_STATUS",
    "identifier": {
      "sku": "PRODUCT_SKU_IF_AVAILABLE",
      "productId": "PRODUCT_ID_IF_AVAILABLE"
    }
  },
  "metadata": {
    "source": "SOURCE_OF_INFORMATION",
    "confidence": CONFIDENCE_SCORE
  },
  "errors": []
}
\`\`\`

Example response:
\`\`\`json
{
  "status": "success",
  "timestamp": "2025-05-04T14:32:17Z",
  "url": "https://example.com/products/wireless-headphones",
  "product": {
    "name": "Sony WH-1000XM5 Wireless Headphones",
    "price": {
      "current": 349.99,
      "currency": "USD",
      "formatted": "$349.99",
      "isOnSale": true,
      "originalPrice": 399.99
    },
    "availability": "In Stock",
    "identifier": {
      "sku": "WH1000XM5/B",
      "productId": "12345"
    }
  },
  "metadata": {
    "source": "structured_data",
    "confidence": 0.95
  },
  "errors": []
}
\`\`\`

If you cannot extract certain fields, use null for those values. If you encounter any errors during extraction, list them in the errors array.

HTML Source:

-----------
${html}
-----------

Only respond with the JSON object. Do not include any explanations or additional text outside of the JSON structure.`;

    // Make the OpenAI API call
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            'You are a helpful assistant that extracts product information from HTML content.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-4.1-nano',
      response_format: { type: 'json_object' },
    });

    const result = completion.choices[0]?.message?.content;

    if (!result) {
      return res.status(500).json({
        success: false,
        error: 'No response from OpenAI',
      });
    }

    try {
      // Parse the JSON response
      const parsedResult = JSON.parse(result);
      return res.json({
        success: true,
        data: parsedResult,
      });
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return res.status(500).json({
        success: false,
        error: 'Failed to parse OpenAI response',
        details: result,
      });
    }
  } catch (error) {
    console.error('Error in price extraction:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to extract price',
      details: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
