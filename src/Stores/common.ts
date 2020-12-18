import {File} from 'Api'

class Common {
  async uploadFile(file: Blob) {
    return await File.uploadFiles(file)
  }
}
export default Common
