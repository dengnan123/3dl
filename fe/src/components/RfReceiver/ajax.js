/**
 *
 * @param {Options} options
 */
export function ajax(options) {
  const opts = getOptions(options)

  const xhr = new XMLHttpRequest()

  return new Promise((resolve, reject) => {
    let resolved = false

    const { method, url, async, headers, responseType, timeout, onProgress } = opts

    xhr.open(method, url, !!async)

    const timer = setTimeout(() => {
      if (resolved) {
        return
      }

      try {
        xhr.timeout = true
        xhr.status = 0
        xhr.abort()
      } catch (error) {}

      reject(xhr)
    }, timeout)

    Object.keys(headers).forEach(key => {
      xhr.setRequestHeader(key, headers[key])
    })

    if (responseType) {
      xhr.responseType = responseType
    }

    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const parse = req => req.response || req.responseText

        resolved = true
        clearTimeout(timer)
        if (isHTTPStatusValid(xhr.status)) {
          resolve(parse(xhr))
        } else {
          reject(xhr)
        }
      }
    }
    xhr.onprogress = function(e) {
      const { loaded, total } = e
      let complete = ((loaded / total) * 100) | 0
      onProgress({
        loaded,
        total,
        complete
      })
    }

    xhr.onerror = () => {
      resolved = true
      clearTimeout(timer)
      reject(xhr)
    }

    xhr.onabort = () => {
      resolved = true
      clearTimeout(timer)
      reject(xhr)
    }

    xhr.send()
  })
}

/**
 *
 * @param {Options} opts
 */
function getOptions(opts) {
  const { method, url, responseType, headers, onProgress } = opts || {}
  return {
    method: method || 'GET',
    url,
    async: true,
    timeout: 1000 * 60 * 30,
    responseType,
    headers: {
      'X-Requested-With': 'XMLHttpRequest',
      ...(headers || {})
    },
    onProgress: onProgress
  }
}

function isHTTPStatusValid(status) {
  return (status >= 200 && status < 300) || status === 304
}
