import { geminiModel, safeParseJSON } from '@/lib/gemini'

export async function POST(req) {
  try {
    const { answers, company, role } = await req.json()
    
    if (!answers || !company || !role) {
      return Response.json({ error: 'Missing interview data' }, { status: 400 })
    }

    const prompt = `
      You are an expert interviewer evaluating a student for a ${role} position at ${company}.
      The student has provided the following answers to the interview questions:
      
      ${JSON.stringify(answers)}
      
      Provide a detailed report in ONLY valid JSON, no markdown:
      {
        "overallScore": 0-100,
        "overallVerdict": "String summarizing general performance",
        "hireRecommendation": "yes | consider | no",
        "answers": [
          {
            "questionId": "",
            "question": "",
            "score": 0-100,
            "whatWasGood": "String",
            "whatWasMissing": "String",
            "idealAnswer": "String",
            "grade": "A | B | C | D"
          }
        ],
        "topStrengths": ["String"],
        "topWeaknesses": ["String"],
        "nextSteps": ["String"]
      }
    `

    const result = await geminiModel.generateContent(prompt)
    const report = safeParseJSON(result.response.text())

    if (!report) {
      return Response.json({ error: 'Failed to generate interview report' }, { status: 500 })
    }

    return Response.json(report)
  } catch (error) {
    console.error('Interview Report API Error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
