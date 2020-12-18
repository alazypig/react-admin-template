import {Stores} from './index'
import {apiOptions} from '../Api'
import {observable} from 'mobx'
import {common} from 'Api'
import Role from 'Models/role'

const TOKEN = 'token'
const USER_ID = 'userID'
const ROLE = 'role'

interface PanesProps {
  title: string
  key: string
  visible: boolean
}

class RootStore {
  @observable
  private _isLogin = false

  private showSpinner = () => {
    this._isSpinner = true
  }

  private hiddenSpinner = () => {
    this._isSpinner = false
  }

  private _role?: Role

  @observable
  private _panes: PanesProps[] = []

  @observable
  private _activePath = ''

  errorHandle = (status: number) => {
    if (status === 403 && this._isLogin) {
      window.alert('登录已超时，请重新登录')
      // this.logout()
    }
  }

  private _stores?: Stores

  @observable
  private _isSpinner = false

  @observable
  private _isLoading = false

  initStores(stores: Stores) {
    this._stores = stores
  }

  async init() {
    const token = sessionStorage.getItem(TOKEN)
    const userID = sessionStorage.getItem(USER_ID)
    const role = sessionStorage.getItem(ROLE)
    const metas = document.getElementsByTagName('meta')
    for (let i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute('name') === 'env') {
        apiOptions.setEnv(metas[i].getAttribute('content') as string)
      }
    }
    if (token && userID) {
      apiOptions.setOnError(this.errorHandle)
      apiOptions.setCredentials(token, parseInt(userID, 10))
      apiOptions.setOnBeforeSend(this.showSpinner)
      apiOptions.setOnAfterSend(this.hiddenSpinner)
      this._role = role as Role
      this._isLogin = true
    }
    this._isLoading = true
  }

  async login(username: string, password: string) {
    const res = await common.login({username, password})
    if (res.success && res.data) {
      await this.saveSession(res.data.token, res.data.user_id, res.data.role_id)
      await this.init()
    }
    return res
  }

  logout = () => {
    this.removeSession()
    this.panes = []
    this._isLogin = false
  }

  saveSession(token: string, userID: number, role: Role) {
    sessionStorage.setItem(TOKEN, token)
    sessionStorage.setItem(USER_ID, userID.toString())
    sessionStorage.setItem(ROLE, role.toString())
  }

  removeSession() {
    sessionStorage.removeItem(TOKEN)
    sessionStorage.removeItem(USER_ID)
    sessionStorage.removeItem(ROLE)
  }

  add = (routeTitle: string, routePath: string) => {
    const newPanes = [...this._panes!]
    this._activePath = routePath
    newPanes.push({
      title: routeTitle,
      key: routePath,
      visible: true,
    })
    this._panes = newPanes
  }

  remove = (targetKey: string | React.MouseEvent<HTMLElement>) => {
    if (!this._panes) {
      return
    }
    let newActiveKey = this._activePath
    let lastIndex: any
    this._panes.forEach((pane, i) => {
      if (pane.key === targetKey) {
        lastIndex = i - 1
      }
    })
    const newPanes = this._panes.filter(pane => pane.key !== targetKey)
    if (newPanes.length && newActiveKey === targetKey) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key
      } else {
        newActiveKey = newPanes[0].key
      }
    }
    this._panes = newPanes
    this._activePath = newActiveKey
  }

  get stores() {
    return this._stores
  }

  get isSpinner() {
    return this._isSpinner
  }

  get isLogin() {
    return this._isLogin
  }

  get isLoading() {
    return this._isLoading
  }

  get role() {
    return this._role
  }

  get panes() {
    return this._panes
  }

  set panes(value: PanesProps[]) {
    this._panes = value
  }

  get activePath() {
    return this._activePath
  }

  set activePath(value: string) {
    this._activePath = value
  }
}

export default RootStore
