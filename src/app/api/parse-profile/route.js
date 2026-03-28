import { parseProfileFromPDF } from '@/lib/gemini'


export const maxDuration = 60; // Allows the function to run for up to 60 seconds
export async function POST(req) {
  try {
    const { pdfBase64, type } = await req.json()
    
    if (!pdfBase64) {
      return Response.json({ error: 'Missing PDF content' }, { status: 400 })
    }

    const profile = await parseProfileFromPDF(pdfBase64)
    
    if (!profile) {
      return Response.json({ error: 'Failed to parse profile' }, { status: 500 })
    }

    return Response.json({ profile })
  } catch (error) {
    console.error('Parse Profile API Error:', error)
    return Response.json({ error: error.message }, { status: 500 })
  }
}
