// Import necessary libraries
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Configuration, OpenAIApi } from 'https://esm.sh/openai@3.2.1'

// 1. CONFIGURE AI: Get the secret key and set up the OpenAI client
const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY'); // Securely gets the key
const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
const openai = new OpenAIApi(configuration);

// 2. CREATE SERVER: This is the main entry point for the function
serve(async (req) => {
  try {
    // 3. AUTHENTICATE USER: Check who is calling this function
    const authHeader = req.headers.get('Authorization')! // Get the user's login token
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } } // Create a special client *as that user*
    );

    // Verify the user is real
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return new Response("Not authenticated", { status: 401 });
    }

    // 4. GET INPUT: Get the missing skills sent from the React app
    const { missingSkills } = await req.json(); // e.g., ["React Hooks", "PostgreSQL"]
    if (!missingSkills || missingSkills.length === 0) {
      return new Response("No skills provided", { status: 400 });
    }
    
    // 5. ENGINEER PROMPT: Create the instructions for the AI
    const prompt = `
      A user on a career development platform is missing the following skills
      for their target role: ${missingSkills.join(', ')}.
      
      Based on these missing skills, generate 3-5 personalized learning recommendations.
      For each recommendation:
      1. Provide a "title" (e.g., "Master React Hooks").
      2. Provide a "description" (a 1-2 sentence compelling reason why this helps).
      3. Suggest a "type" (e.g., "Article", "Video", "Book", "Project").
      
      Return ONLY a valid JSON array of objects in this format:
      [
        {"title": "...", "description": "...", "type": "..."},
        {"title": "...", "description": "...", "type": "..."}
      ]
    `; // The instruction to return *only* JSON is critical for it to work.

    // 6. CALL AI: Send the prompt to OpenAI
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    // 7. SEND RESPONSE: Get the AI's answer and send it back to the React app
    const recommendations = completion.data.choices[0].message.content;
    return new Response(
      recommendations, // This is the pure JSON string from the AI
      { headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // 8. HANDLE ERRORS: If anything fails, send back an error message
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
})