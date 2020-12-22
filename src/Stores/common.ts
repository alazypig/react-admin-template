import {File} from 'Api'

class CommonStore {
  async uploadFile(file: Blob) {
    return await File.uploadFiles(file)
  }
}
export default CommonStore
