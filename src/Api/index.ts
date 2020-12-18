import {ApiBaseOptions} from './base/apiBase'
import CommonAPI from './common'
import FileAPI from './file'

const metas = document.getElementsByTagName('meta')
let apiEnv: string | null
let FILE_URL: string | undefined
for (let i = 0; i < metas.length; i++) {
  if (metas[i].getAttribute('name') === 'env') {
    apiEnv = metas[i].getAttribute('content')
    FILE_URL = apiEnv === 'production' ? 'todo' : 'http://172.30.9.75:8080'
  }
}

export const apiOptions = new ApiBaseOptions()
export const common = new CommonAPI(apiOptions)
export const File = new FileAPI(apiOptions, FILE_URL)
