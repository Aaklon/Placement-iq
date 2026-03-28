export function parseJson(text) {
  try {
    const clean = text
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim()
    return JSON.parse(clean)
  } catch (err) {
    console.error('JSON parse error:', err)
    return null
  }
}
