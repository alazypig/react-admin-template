import ApiBase from '../base/apiBase'
import * as Responses from './response'

export default class FileAPI extends ApiBase {
  async uploadFiles(file: Blob) {
    const data = new FormData()
    data.append('file', file)
    data.append('output', 'json')
    data.append(
      'auth_token',
      JSON.stringify({
        token: this.options?.token,
        id: this.options?.userID,
      }),
    )
    return this.upload<Responses.Upload>('/group1/upload', data)
  }
}
