// --- Gemini API Service ---

const BASE_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent";

export const validateApiKey = async (key) => {
  const cleanKey = key.trim();
  try {
    const response = await fetch(`${BASE_URL}?key=${cleanKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "ping" }] }]
      })
    });

    if (response.ok) {
      return { valid: true, tier: 'paid' };
    } else {
      const errorData = await response.json();
      if (response.status === 429) {
        return { valid: true, tier: 'free', message: 'Rate limited (429)' };
      }
      return { valid: false, error: errorData.error?.message || 'Unknown error' };
    }
  } catch (error) {
    return { valid: false, error: 'Network error' };
  }
};

export const generateImageDescription = async (base64Image, key) => {
  const cleanKey = key.trim();
  const prompt = `Task: Generate a High-Precision, RAG-Ready description for this image.

  Instructions:
  1. Analyze the image with extreme attention to detail (Thinking Mode: Enabled).
  2. Perform full OCR on any visible text.
  3. Describe visual structure, data relationships, specific colors, and emotional mood.
  4. Your output must be dense and information-rich to support vector embeddings for a text-based RAG system.

  Return a raw JSON object (no markdown) with:
  1. "filename": A short, descriptive filename (max 8 words, snake_case).
  2. "description": A comprehensive, very very very accurate paragraph combining visual analysis and text transcription.
  3. "tags": An array of 5-10 specific technical keywords for indexing.`;

  try {
    const response = await fetch(`${BASE_URL}?key=${cleanKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: prompt },
            { inlineData: { mimeType: "image/jpeg", data: base64Image } }
          ]
        }],
        generationConfig: {
          responseMimeType: "application/json"
        }
      })
    });

    if (!response.ok) {
      if (response.status === 429) throw new Error("RATE_LIMIT");
      throw new Error(`API Error: ${response.status}`);
    }
    const result = await response.json();

    const usage = result.usageMetadata || {};
    const totalTokens = (usage.promptTokenCount || 0) + (usage.candidatesTokenCount || 0);
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    return {
      data: JSON.parse(text),
      tokens: totalTokens
    };
  } catch (error) {
    if (error.message !== "RATE_LIMIT") {
      console.error("Gemini Vision API Error:", error);
    }
    throw error;
  }
};

export const generateSummary = async (descriptions, key) => {
  if (!descriptions || !key) return null;
  const cleanKey = key.trim();

  const prompt = `Here are visual descriptions of images extracted from a PDF document:\n\n${descriptions}\n\nBased ONLY on these images, write a concise "Visual Executive Summary" (max 3 sentences) describing what this document appears to be about (e.g., "A financial report with revenue charts", "A technical manual for a coffee machine", etc.).`;

  try {
    const response = await fetch(`${BASE_URL}?key=${cleanKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: "text/plain"
        }
      })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    const usage = result.usageMetadata || {};
    const totalTokens = (usage.promptTokenCount || 0) + (usage.candidatesTokenCount || 0);

    return { text, tokens: totalTokens };
  } catch (error) {
    console.error("Gemini Text API Error:", error);
    return null;
  }
};
