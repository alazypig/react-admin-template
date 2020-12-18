import RootStore from './../Stores/root'
import Common from 'Stores/common'

const mockStoresBuilder = (root?: RootStore, autoInit?: boolean) => {
  const mockRoot = root ? root : new RootStore()
  const mockCommon = new Common()
  const stores = {
    root: mockRoot,
    common: mockCommon,
  }

  if (autoInit) {
    mockRoot.initStores(stores)
  }
  return stores
}

export default mockStoresBuilder
