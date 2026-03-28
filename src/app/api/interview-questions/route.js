import { geminiModel, safeParseJSON } from '@/lib/gemini'

export async function POST(req) {
  try {
    const { company, role, type, count } = await req.json()
    
    if (!company || !role) {
      return Response.json({ error: 'Missing company or role' }, { status: 400 })
    }

    const interviewTitle = `${company} ${role} Interview`
    const prompt = `
      Generate ${count || 5} interview questions for a ${role} position at ${company}.
      The interview type is ${type || 'Mixed'}.
      
      For each question, provide:
      - id: string
      - question: the question text
      - type: 'Technical' | 'HR' | 'Behavioral'
      - hint: a small tip for the student
      - timeLimit: number (seconds)
      
      Return ONLY valid JSON array of questions, no markdown:
      [
        {
          "id": "",
          "question": "",
          "type": "",
          "hint": "",
          "timeLimit": 60
        }
      ]
    `

    const result = await geminiModel.generateContent(prompt)
    const questions = safeParseJSON(result.response.text())

    if (!questions) {
       return Response.json({ error: 'Failed to generate questions' }, { status: 500 })
    }

    return Response.json({ questions, interviewTitle })
  } catch (error) {
    console.error('Interview Questions API Error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
