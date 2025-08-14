# BakeBook AI Assistant

This document provides information about the BakeBook AI Assistant feature and how to set it up.

## Features

- **AI-Powered Chat**: Get baking advice, tips, and answers to your baking questions
- **Recipe Suggestions**: Get recipe ideas based on available ingredients
- **Pricing Calculator**: Calculate pricing for your baked goods
- **Recipe Scaling**: Easily scale recipes up or down
- **Baking Tips**: Get random baking tips and tricks

## Setup Instructions

1. **Get a Google AI API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/)
   - Create a new API key
   - Copy the API key

2. **Environment Variables**
   Create a `.env.local` file in the root of your project with the following content:
   ```
   NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_api_key_here
   ```
   Replace `your_api_key_here` with your actual Google AI API key.

3. **Install Dependencies**
   Make sure all dependencies are installed:
   ```bash
   npm install
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

## Usage

1. Navigate to the Assistant page in the application
2. Type your baking-related question or request in the chat input
3. The AI assistant will respond with helpful information

## Available Commands

- **General Advice**: Ask any baking-related question
- **Recipe Ideas**: "Suggest a recipe with flour, eggs, and sugar"
- **Pricing Help**: "How much should I charge for a cake?"
- **Baking Tips**: "Give me a baking tip"
- **Recipe Scaling**: "How to make this recipe for 8 people?"

## Troubleshooting

- **API Key Issues**: Make sure your API key is correctly set in the `.env.local` file
- **Rate Limiting**: The free tier of the Google AI API has rate limits
- **Errors**: Check the browser console for any error messages

## Implementation Details

The AI Assistant uses the Google Gemini API to provide intelligent responses to baking-related queries. The implementation includes:

- A React-based chat interface
- Serverless API routes for secure API key handling
- Structured response handling for different types of queries
- Error handling and user feedback

## Future Enhancements

- Save chat history
- Add voice input support
- Implement image recognition for ingredient identification
- Add more specialized baking tools and calculators
