import ApiBase from '../base/apiBase'
import * as Params from './params'

export default class CommonAPI extends ApiBase {
  login(params: Params.Login) {
    return this.post('/login', params)
  }
}
