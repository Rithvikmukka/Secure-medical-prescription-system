// =============================================================================
// ENCODING & DECODING DEMONSTRATION (ACADEMIC REQUIREMENT)
// =============================================================================

/**
 * ENCODING vs ENCRYPTION (ACADEMIC CLARIFICATION)
 * 
 * ENCODING:
 * - Reversible transformation of data format
 * - No secrecy, just format change
 * - Example: Base64, URL encoding, HTML encoding
 * - Purpose: Data transmission, storage compatibility
 * 
 * ENCRYPTION:
 * - Reversible transformation with secrecy
 * - Requires key for decryption
 * - Example: AES, RSA
 * - Purpose: Confidentiality, security
 * 
 * This file demonstrates ENCODING (separate from crypto.ts encryption)
 */

/**
 * Base64 Encoding Demonstration
 * 
 * WHY BASE64:
 * - Universal text-safe encoding
 * - Used in email attachments, URLs, JSON
 * - Demonstrates encoding concepts clearly
 * - Different from encryption (no keys, no secrecy)
 */
export function encodeBase64(data: string): string {
  try {
    // Browser-compatible Base64 encoding
    return btoa(unescape(encodeURIComponent(data)));
  } catch (error) {
    console.error('Base64 encoding error:', error);
    throw new Error('Failed to encode data to Base64');
  }
}

/**
 * Base64 Decoding Demonstration
 */
export function decodeBase64(encodedData: string): string {
  try {
    // Browser-compatible Base64 decoding
    return decodeURIComponent(escape(atob(encodedData)));
  } catch (error) {
    console.error('Base64 decoding error:', error);
    throw new Error('Failed to decode Base64 data');
  }
}

/**
 * Demonstrate encoding vs encryption with prescription data
 * 
 * ACADEMIC PURPOSE: Show the difference clearly
 */
export function demonstrateEncodingVsEncryption(prescriptionData: any) {
  console.log('🔓 ENCODING vs ENCRYPTION DEMONSTRATION');
  console.log('=====================================');
  
  // Original data
  const originalData = JSON.stringify(prescriptionData, null, 2);
  console.log('📄 Original Data:');
  console.log(originalData);
  
  // ENCODING (Base64) - No secrecy, just format change
  const encodedData = encodeBase64(originalData);
  console.log('\n🔤 BASE64 ENCODED (no secrecy):');
  console.log(encodedData);
  
  // DECODING (Base64) - Reversible without keys
  const decodedData = decodeBase64(encodedData);
  console.log('\n🔤 BASE64 DECODED:');
  console.log(decodedData);
  
  // Verify encoding is reversible
  const isEncodingCorrect = decodedData === originalData;
  console.log(`\n✅ Encoding Verification: ${isEncodingCorrect ? 'SUCCESS' : 'FAILED'}`);
  
  return {
    original: originalData,
    encoded: encodedData,
    decoded: decodedData,
    isCorrect: isEncodingCorrect
  };
}

/**
 * URL Encoding Demonstration (additional encoding technique)
 */
export function encodeURL(data: string): string {
  return encodeURIComponent(data);
}

export function decodeURL(encodedData: string): string {
  return decodeURIComponent(encodedData);
}

/**
 * Multiple Encoding Techniques Demonstration
 */
export function demonstrateMultipleEncodings(data: string) {
  console.log('🔄 MULTIPLE ENCODING TECHNIQUES');
  console.log('==================================');
  
  console.log('📄 Original:', data);
  
  // Base64 encoding
  const base64Encoded = encodeBase64(data);
  console.log('🔤 Base64:', base64Encoded);
  
  // URL encoding
  const urlEncoded = encodeURL(data);
  console.log('🌐 URL:', urlEncoded);
  
  // HTML encoding (basic)
  const htmlEncoded = data
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
  console.log('🌐 HTML:', htmlEncoded);
  
  return {
    original: data,
    base64: base64Encoded,
    url: urlEncoded,
    html: htmlEncoded
  };
}
