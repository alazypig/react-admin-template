import RootStore from './root'

const createStores = () => {
  const root = new RootStore()

  const stores = {
    root,
  }

  root.initStores(stores)
  return stores
}

export default createStores
