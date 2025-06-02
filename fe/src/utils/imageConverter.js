export const bufferToDataUrl = (buffer, mimeType) => {
  console.log('bufferToDataUrl received:', { buffer, mimeType });
  if (!buffer || !mimeType) return '';
  try {
    // Handle case where buffer is a Mongoose buffer object (has a buffer property)
    const base64 = Buffer.from(buffer.data || buffer).toString('base64');
    return `data:${mimeType};base64,${base64}`;
  } catch (e) {
    console.error("Error converting image buffer to Data URL:", e);
    return '';
  }
}; 