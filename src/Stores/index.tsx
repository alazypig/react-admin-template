import React from 'react'
import {useLocalStore} from 'mobx-react'

import createStores from './createStores'

export type Stores = ReturnType<typeof createStores>

const storeContext = React.createContext<Stores | null>(null)

export const StoreProvider = ({children}: {children: any}) => {
  const store = useLocalStore(createStores)
  return <storeContext.Provider value={store}>{children}</storeContext.Provider>
}

const useStores = () => {
  const store = React.useContext(storeContext)
  if (!store) {
    // this is especially useful in TypeScript so you don't need to be checking for null all the time
    throw new Error('useStore must be used within a StoreProvider.')
  }
  return store
}

export default useStores
