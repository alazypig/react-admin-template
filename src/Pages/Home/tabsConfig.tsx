import PageLoading from 'Components/PageLoading'
import React from 'react'
import Loadable from 'react-loadable'

const Loading = () => <PageLoading />
const reactLoadable = (
  loader: () => Promise<
    React.ComponentType<object> | {default: React.ComponentType<object>}
  >,
) => {
  return Loadable({
    loader: loader,
    loading: Loading,
    delay: 150,
  })
}

const HomePage = reactLoadable(() => import('Pages/Homepage'))

export interface TabModel {
  title: string
  tabKey?: string
  component: JSX.Element
}

export const getTabsComponent = (key: string) => {
  let newKey = key
  if (key.includes('?')) {
    newKey = key.split('?')[0]
  }

  const tab: TabModel = {
    title: '没有找到',
    component: <></>,
  }
  switch (newKey) {
    case '/home/homepage':
      tab.title = 'Homepage'
      tab.component = <HomePage />
      break
    default:
      break
  }
  return tab
}
