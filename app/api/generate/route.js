import { NextResponse } from 'next/server'
import { AzureOpenAI } from 'openai'

const systemPrompt = `
You are a flashcard creator. Your task is to generate 10 flashcards from the input text. 
Each flashcard should have a front and back, both one sentence long. 
Only generate 10 flashcards
Return the flashcards in a strict JSON format without any additional text. 
The JSON format should be as follows:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`
export async function POST(req) {
  const openai = new AzureOpenAI({
    apiKey: process.env.AZURE_OPENAI_API_KEY,
    apiVersion: "2024-05-01-preview"
  })

  const data = await req.text()

  const completion = await openai.chat.completions.create({
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: data },
    ],
    model: process.env.DEPLOYMENT_NAME
  })

  // Parse the JSON response from the OpenAI API
  const flashcards = JSON.parse(completion.choices[0].message.content.trim())

  // Return the flashcards as a JSON response
  return NextResponse.json(flashcards.flashcards)
}