import crypto from 'crypto'
import dayjs from 'dayjs'
import XLSX from 'xlsx'
import JSZip from 'jszip'
import FileSaver from 'file-saver'

export const sleep = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms))
}

const REQUEST_PUBLIC_KEY = `-----BEGIN PUBLIC KEY-----
PUBLIC KEY
-----END PUBLIC KEY-----
`

export const rsaEncrypt = (message: string | object) => {
  if (typeof message === 'object') {
    message = JSON.stringify(message)
  }
  return crypto
    .publicEncrypt(
      {
        key: REQUEST_PUBLIC_KEY,
        passphrase: '',
        padding: crypto.constants.RSA_PKCS1_PADDING,
      },
      Buffer.from(message),
    )
    .toString('base64')
}

export const toFIL = (num: number) => {
  return (Number(num) / Math.pow(10, 18)).toLocaleString('en-US')
}

export const bytes2Power = (bytes: number, fixed = 2): string => {
  const flag = bytes < 0
  bytes = Math.abs(bytes)
  if (bytes === 0) return '0 B'
  const k = 1024 // or 1024
  const sizes = ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${flag ? '-' : ''}${(bytes / Math.pow(k, i)).toFixed(fixed)} ${
    sizes[i]
  }`
}

export const dateRender = (date: string, toCHS = true) => {
  if (!date) {
    return ''
  }
  const day = dayjs(date)
  return toCHS ? day.format('MM月DD日') : day.format('YYYY.MM.DD')
}

interface EArrayItem {
  [key: string]: number | string
}

export const exportFile = (
  headers: Array<{key: string; title: string}>,
  data: Array<EArrayItem>,
  fileName: string,
) => {
  const _headers = headers
    .map((item, i) =>
      Object.assign(
        {},
        {
          key: item.key,
          title: item.title,
          position: String.fromCharCode(65 + i) + 1,
        },
      ),
    )
    .reduce(
      (prev, next) =>
        Object.assign({}, prev, {
          [next.position]: {key: next.key, v: next.title},
        }),
      {},
    )

  const _data = data
    .map((item, i) =>
      headers.map((key, j) =>
        Object.assign(
          {},
          {
            content: item[key.key],
            position: String.fromCharCode(65 + j) + (i + 2),
          },
        ),
      ),
    )
    // 对刚才的结果进行降维处理（二维数组变成一维数组）
    .reduce((prev, next) => prev.concat(next))
    // 转换成 worksheet 需要的结构
    .reduce(
      (prev, next) =>
        Object.assign({}, prev, {[next.position]: {v: next.content}}),
      {},
    )

  // 合并 headers 和 data
  const output = Object.assign({}, _headers, _data)
  // 获取所有单元格的位置
  const outputPos = Object.keys(output)
  // 计算出范围 ,["A1",..., "H2"]
  const ref = `${outputPos[0]}:${outputPos[outputPos.length - 1]}`

  // 构建 workbook 对象
  const wb = {
    SheetNames: ['mySheet'],
    Sheets: {
      mySheet: Object.assign({}, output, {
        '!ref': ref,
        '!cols': headers.map(item => ({wpx: 100})),
      }),
    },
  }
  XLSX.writeFile(wb, fileName)
}

export const DateUnix = (date: string) => {
  if (!date) {
    return
  }
  const day = dayjs(date)
  return day.unix()
}

const image2Base64 = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas')
  canvas.width = img.width
  canvas.height = img.height
  const ctx = canvas.getContext('2d')
  if (ctx) {
    ctx.drawImage(img, 0, 0, img.width, img.height)
    const dataURL = canvas.toDataURL('image/png')
    return dataURL
  }
  return ''
}

const getBase64Image = (url: string) => {
  return new Promise<string>((resolve, reject) => {
    let base64 = ''
    const img = new Image()
    img.setAttribute('crossOrigin', 'Anonymous')
    img.onload = () => {
      base64 = image2Base64(img)
      resolve(base64.split(',')[1])
    }
    img.onerror = () => reject('加载失败')
    img.src = url
  })
}

const zipImg = async (zip: JSZip) => {
  const result = await zip.generateAsync({
    type: 'blob',
  })
  const fileName = '附件.zip'
  FileSaver.saveAs(result, fileName)
}

export const downZipImg = async (urlArr: Array<string>) => {
  try {
    const zip = new JSZip()
    for (let i = 0; i < urlArr.length; i++) {
      const lst = urlArr[i].split('.')
      const fileType = lst[lst.length - 1]
      const res = await getBase64Image(urlArr[i])
      zip.file('附件' + i + 1 + '.' + fileType, res, {base64: true})
    }
    zipImg(zip)
  } catch (err) {
    console.log('err', err)
  }
}

// 对undefined的处理函数
export const dataRender = (target: any, returnValue: any = 0) => {
  return target ? target : returnValue
}
