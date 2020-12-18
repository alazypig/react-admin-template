import axios, {AxiosPromise, AxiosError} from 'axios'
import {ErrorHandle} from './apiBase'
import {Response, FailResponse} from './responses'

const API_ROOT = '/api/v1'

export const createRequest = (root?: string) => {
  return axios.create({
    baseURL: root ? root : API_ROOT,
    headers: {
      'Content-type': 'application/json',
    },
    timeout: 30000,
    timeoutErrorMessage: '服务器开小差了，请稍后再试',
  })
}

type requestFactory = <T = {}>() => AxiosPromise<any>

export const wrapperSend = async <T>(
  request: requestFactory,
  errorHandle?: ErrorHandle,
): Promise<Response<any> | FailResponse> => {
  try {
    const res = await request<T>()
    return res.data
  } catch (error) {
    const e = error as AxiosError
    if (e.response) {
      errorHandle?.(e.response.status, e.response.data)
      return e.response.data
    } else {
      return {
        success: false,
        err_code: '服务器开小差了，请稍后再试',
      }
    }
  }
}
