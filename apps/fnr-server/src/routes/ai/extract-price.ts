import { Request, Response } from 'express';
import OpenAI from 'openai';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const extractPrice = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // For initial testing, just return "Hello World"
    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content:
            "You are a helpful assistant that returns 'Hello World' for testing purposes.",
        },
        {
          role: 'user',
          content: 'Please return Hello World',
        },
      ],
      model: 'gpt-4.1-nano',
    });

    const result = completion.choices[0]?.message?.content || 'No response';

    return res.json({
      success: true,
      message: result,
    });
  } catch (error) {
    console.error('Error in price extraction:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to extract price',
    });
  }
};
