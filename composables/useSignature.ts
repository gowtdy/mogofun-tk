import CryptoJS from 'crypto-js'
import { config } from '~/config/config'

/**
 * Generate signature for text content
 * @param {string} text - Text content to be signed
 * @param {number} timestamp - UTC timestamp in seconds
 * @returns {string} - Signature
 */
export const useSignature = () => {
  const generateSignature = (text: string, timestamp: number): string => {
    // 1. Convert text content to UTF-8 encoded string
    const utf8Text = CryptoJS.enc.Utf8.parse(text)
    
    // 2. Combine signature string
    const signString = `text=${utf8Text}&timestamp=${timestamp}`

    // 3. Generate signature using HMAC-SHA256
    const signature = CryptoJS.HmacSHA256(signString, config.signature.secretKey)
    
    return signature.toString()
  }

  const generateSoundSignature = (text: string, timestamp: number): string => {
    // 1. Convert text content to UTF-8 encoded string
    const utf8Text = CryptoJS.enc.Utf8.parse(text)
    
    // 2. Combine signature string
    const signString = `text=${utf8Text}&timestamp=${timestamp}`

    // 3. Generate signature using HMAC-SHA256
    const signature = CryptoJS.HmacSHA256(signString, config.signature.soundSecretKey)
    
    return signature.toString()
  }

  const generateUploadSignature = (text: string, timestamp: number): string => {
    // 1. Convert text content to UTF-8 encoded string
    const utf8Text = CryptoJS.enc.Utf8.parse(text)
    
    // 2. Combine signature string
    const signString = `text=${utf8Text}&timestamp=${timestamp}`

    // 3. Generate signature using HMAC-SHA256
    const signature = CryptoJS.HmacSHA256(signString, config.signature.uploadSecretKey)
    
    return signature.toString()
  }

  const generateCoverSignature = (text: string, timestamp: number): string => {
    // 1. Convert text content to UTF-8 encoded string
    const utf8Text = CryptoJS.enc.Utf8.parse(text)
    
    // 2. Combine signature string
    const signString = `text=${utf8Text}&timestamp=${timestamp}`

    // 3. Generate signature using HMAC-SHA256
    const signature = CryptoJS.HmacSHA256(signString, config.signature.coverSecretKey)
    
    return signature.toString()
  }

  return {
    generateSignature,
    generateSoundSignature,
    generateUploadSignature,
    generateCoverSignature
  }
} 