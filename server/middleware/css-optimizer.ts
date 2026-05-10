export default defineEventHandler(async (event) => {
  // 只处理HTML响应
  const response = await event.node.res;

  // 保存原始的write方法
  const originalWrite = response.write;
  const originalEnd = response.end;

  let chunks: Buffer[] = [];

  // 重写write方法来收集数据
  response.write = function (chunk: any, encoding?: any, callback?: any) {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }
    return originalWrite.call(this, chunk, encoding, callback);
  };

  // 重写end方法来处理最终的HTML
  response.end = function (chunk?: any, encoding?: any, callback?: any) {
    if (chunk) {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    }

    const html = Buffer.concat(chunks).toString('utf8');

    // 检查是否是HTML响应
    if (html.includes('<!DOCTYPE html>') || html.includes('<html')) {

      try {
        // 查找所有CSS链接并添加media="print"和onload属性
        const optimizedHtml = html.replace(
          /<link([^>]*rel=["']stylesheet["'][^>]*)>/gi,
          (match: string, attributes: string) => {
            // 如果已经有onload属性，跳过
            if (attributes.includes('onload=')) {
              return match;
            }

            // 添加media="print"和onload="this.media='all'"
            const optimizedLink = `<link${attributes} media="print" onload="this.media='all'">`;
            return optimizedLink;
          }
        );


        // 发送优化后的HTML
        return originalEnd.call(this, optimizedHtml, encoding, callback);
      } catch (error) {
        return originalEnd.call(this, html, encoding, callback);
      }
    }

    // 非HTML响应，直接发送
    return originalEnd.call(this, html, encoding, callback);
  };
});
