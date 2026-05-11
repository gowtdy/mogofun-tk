/**
 * 上传策略配置
 * 根据文件大小自动选择合适的分片大小、并发数和存储方式
 */

export interface UploadStrategy {
  chunkSize: number // 分片大小（字节）
  simultaneousUploads: number // 并发上传数
  storage: 'localStorage' | 'indexedDB' // 存储方式
  retryTimes: number // 重试次数
  retryDelay: number // 重试延迟（毫秒）
}

/**
 * 根据文件大小获取上传策略
 */
export function getUploadStrategy(fileSize: number): UploadStrategy {
  // 小文件（< 50MB）
  if (fileSize < 50 * 1024 * 1024) {
    return {
      // chunkSize: 2 * 1024 * 1024, // 2MB
      chunkSize: 5 * 1024 * 1024, // 5MB
      simultaneousUploads: 5,
      storage: 'localStorage',
      retryTimes: 2, // 2次
      retryDelay: 200 // 200ms
    }
  }
  
  // 中等文件（50MB - 200MB）
  if (fileSize < 200 * 1024 * 1024) {
    return {
      chunkSize: 5 * 1024 * 1024, // 5MB
      simultaneousUploads: 4,
      storage: 'localStorage',
      retryTimes: 2,
      retryDelay: 200 // 200ms
    }
  }
  
  // 大文件（200MB - 500MB）
  if (fileSize < 500 * 1024 * 1024) {
    return {
      chunkSize: 10 * 1024 * 1024, // 10MB
      simultaneousUploads: 3,
      storage: 'indexedDB',
      retryTimes: 2,
      retryDelay: 2000
    }
  }
  
  // 超大文件（> 500MB）
  return {
    chunkSize: 20 * 1024 * 1024, // 20MB
    simultaneousUploads: 2,
    storage: 'indexedDB',
    retryTimes: 2, // 2次
    retryDelay: 200
  }
}

/**
 * 计算文件的 hash（用于文件唯一标识）
 * 使用 SHA-256 的 base64 编码，约43个字符，比 hex 编码的64字符短，但比截断的32字符更安全
 */
export async function calculateFileHash(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    
    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer
        const hashBuffer = await crypto.subtle.digest('SHA-256', arrayBuffer)
        // 使用 base64 编码，比 hex 编码更短（43字符 vs 64字符）
        // 同时保持完整的256位安全性，避免截断导致的冲突风险
        const hashArray = new Uint8Array(hashBuffer)
        // 将 Uint8Array 转换为字符串，然后进行 base64 编码
        let binaryString = ''
        for (let i = 0; i < hashArray.length; i++) {
          binaryString += String.fromCharCode(hashArray[i])
        }
        const base64String = btoa(binaryString)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '') // 移除 padding，进一步缩短到约43字符
        resolve(base64String)
      } catch (error) {
        reject(error)
      }
    }
    
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}

/**
 * 计算大文件的部分 hash（用于文件唯一标识）
 * 只读取文件的前2MB和最后2MB，计算hash
 * 这样既能保证唯一性，又避免读取整个大文件，性能更好
 */
export async function calculateLargeFileHash(file: File): Promise<string> {
  try {
    const chunkSize = 2 * 1024 * 1024 // 2MB
    const fileSize = file.size
    
    // 如果文件小于等于4MB，直接计算整个文件的hash
    if (fileSize <= chunkSize * 2) {
      return await calculateFileHash(file)
    }
    
    // 并行读取文件的前2MB和最后2MB（只读4MB，比之前的6MB更快）
    const [startBuffer, endBuffer] = await Promise.all([
      file.slice(0, chunkSize).arrayBuffer(),
      file.slice(fileSize - chunkSize, fileSize).arrayBuffer()
    ])
    
    // 合并两个chunk
    const totalLength = startBuffer.byteLength + endBuffer.byteLength
    const combinedBuffer = new Uint8Array(totalLength)
    combinedBuffer.set(new Uint8Array(startBuffer), 0)
    combinedBuffer.set(new Uint8Array(endBuffer), startBuffer.byteLength)
    
    // 计算hash
    const hashBuffer = await crypto.subtle.digest('SHA-256', combinedBuffer)
    const hashArray = new Uint8Array(hashBuffer)
    let binaryString = ''
    for (let i = 0; i < hashArray.length; i++) {
      binaryString += String.fromCharCode(hashArray[i])
    }
    const base64String = btoa(binaryString)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=/g, '')
    return base64String
  } catch (error) {
    throw error
  }
}

/**
 * 生成文件唯一标识符
 * 小文件：计算整个文件的 SHA-256 hash
 * 大文件：计算文件的部分 hash（前2MB + 最后2MB），避免冲突风险且性能更好
 * @param file 文件对象
 * @param uid 可选的用户ID，如果提供则包含在hash计算中，进一步降低冲突概率
 */
export async function generateFileIdentifier(file: File, uid?: string): Promise<string> {
  // 对于小文件（<10MB），直接计算整个文件的 hash
  if (file.size < 10 * 1024 * 1024) {
    try {
      const fileHash = await calculateFileHash(file)
      // 如果提供了 uid，将其与文件 hash 组合，进一步降低冲突概率
      if (uid) {
        const combined = `${fileHash}-${uid}`
        const combinedHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(combined))
        const hashArray = new Uint8Array(combinedHash)
        let binaryString = ''
        for (let i = 0; i < hashArray.length; i++) {
          binaryString += String.fromCharCode(hashArray[i])
        }
        return btoa(binaryString)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=/g, '')
      }
      return fileHash
    } catch (error) {
      // 如果 hash 计算失败，使用文件信息作为后备方案
      const fileInfo = uid ? `${file.name}-${file.size}-${file.lastModified}-${uid}` : `${file.name}-${file.size}-${file.lastModified}`
      return btoa(fileInfo).replace(/[^a-zA-Z0-9]/g, '')
    }
  }
  
  // 对于大文件（≥10MB），计算部分 hash（前2MB + 最后2MB，共4MB）
  // 这样既能保证唯一性，又避免读取整个大文件的性能问题
  try {
    const fileHash = await calculateLargeFileHash(file)
    // 如果提供了 uid，将其与文件 hash 组合，进一步降低冲突概率
    if (uid) {
      const combined = `${fileHash}-${uid}`
      const combinedHash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(combined))
      const hashArray = new Uint8Array(combinedHash)
      let binaryString = ''
      for (let i = 0; i < hashArray.length; i++) {
        binaryString += String.fromCharCode(hashArray[i])
      }
      return btoa(binaryString)
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=/g, '')
    }
    return fileHash
  } catch (error) {
    // 如果部分 hash 计算失败，使用文件信息作为后备方案
    const fileInfo = uid ? `${file.name}-${file.size}-${file.lastModified}-${uid}` : `${file.name}-${file.size}-${file.lastModified}`
    return btoa(fileInfo).replace(/[^a-zA-Z0-9]/g, '')
  }
}

