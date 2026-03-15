import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const fetchBrandsFromAI = async (query: string): Promise<string[]> => {
  if (!ai) return [];
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List 20 car brands that match or are related to the search term "${query}". Return only the brand names in a JSON array.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as string[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export const fetchModelsFromAI = async (brand: string): Promise<string[]> => {
  if (!ai) return [];

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `List absolutely ALL car models ever produced by the manufacturer "${brand}". 
      
      CRITICAL INSTRUCTION:
      The user specifically needs distinct generations and chassis codes for enthusiast and utility vehicles.
      
      - For models like the Toyota Land Cruiser, DO NOT just list "Land Cruiser". You MUST list specific series: "Land Cruiser (LC70)", "Land Cruiser (LC79)", "Land Cruiser (LC200)", "Land Cruiser (LC300)", "Land Cruiser Prado (150)", etc.
      - For models like BMW 3 Series, list "3 Series (E46)", "3 Series (E90)", "3 Series (G20)", etc.
      - For Porsche, list "911 (991)", "911 (992)", etc.
      
      General Rule: If a model has well-known distinct generations or codes used in the used car market, list them as separate entries (e.g., "Model Name (Code)").
      
      Include all standard models, commercial vehicles, and discontinued models.
      Sort the list alphabetically.
      Return a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    if (response.text) {
      return JSON.parse(response.text) as string[];
    }
    return [];
  } catch (error) {
    console.error("Error fetching models:", error);
    return [];
  }
};

export const generateTitleSuggestion = async (brand: string, model: string, year: string, body: string): Promise<string> => {
    if (!ai) return "";
  
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Create a short, attractive listing title (max 6 words) for a car rental. 
        The car is a ${brand} ${model} from ${year}, type ${body}. 
        Example format: "SUV Premium, confort et sécurité". 
        Focus on the vehicle type and key quality. French language.`,
        config: {
          responseMimeType: "text/plain",
        }
      });
  
      return response.text?.trim() || "";
    } catch (error) {
      console.error("Error generating title:", error);
      return "";
    }
  };