import RootStore from './root'
import CommonStore from './common'

const createStores = () => {
  const root = new RootStore()
  const common = new CommonStore()

  const stores = {
    root,
    common,
  }

  root.initStores(stores)
  return stores
}

export default createStores
