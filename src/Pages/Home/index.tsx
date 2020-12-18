import React, {useState, ReactNode, useLayoutEffect} from 'react'
import {Link, Redirect, useLocation} from 'react-router-dom'
import {Layout, Menu, Button, Modal, Tabs} from 'antd'
import {MenuUnfoldOutlined, MenuFoldOutlined} from '@ant-design/icons'
import useStores from 'Stores'
import {observer} from 'mobx-react'
import Spinner from 'Components/Spinner'
// import Role from 'Models/role'
import routes from './route'
import {getTabsComponent} from './tabsConfig'

import './index.scss'

const {TabPane} = Tabs
const {Content, Sider, Header} = Layout
const {SubMenu} = Menu

const Home = () => {
  const {root} = useStores()
  const location = useLocation()
  const [collapsed, changeCollapsed] = useState(false)
  const [breakCollapsed, changeBreakCollapsed] = useState(true)
  const [isBreak, changeIsBreak] = useState(true)

  const paths = location.pathname.split('/').filter(item => item)

  const keysArray: string[] = []
  paths.reduce((res, value, index) => {
    if (index < paths.length - 1) {
      if (index > 0) {
        keysArray.push(res + '/' + value)
      }
      return res + '/' + value
    } else {
      return res
    }
  }, '')

  const [openKeys, changeOpenKeys] = useState<any>(keysArray)

  const onLogout = () => {
    Modal.confirm({
      title: '确定注销？',
      onOk: root.logout,
    })
  }

  const toggle = () => {
    if (isBreak) {
      changeBreakCollapsed(!breakCollapsed)
    } else {
      changeCollapsed(!collapsed)
    }
  }

  useLayoutEffect(() => {
    const firstPathKey = location.pathname
    root.panes = [
      {
        title: getTabsComponent(firstPathKey).title,
        key: firstPathKey,
        visible: true,
      },
    ]
    root.activePath = firstPathKey
    // eslint-disable-next-line
  }, [])

  if (!root.isLogin) {
    return <Redirect to="/" />
  }

  const onChange = (activeKey: string) => {
    root.activePath = activeKey
  }

  const onEdit = (
    targetKey: React.MouseEvent | React.KeyboardEvent | string,
    action: 'add' | 'remove',
  ) => {
    if (action === 'remove') {
      root.remove(targetKey as string)
    }
  }

  const clickMenuItem = (childRoute: {
    path: string
    title: string
    Icon: React.ForwardRefExoticComponent<
      React.HTMLProps<HTMLSpanElement> & React.RefAttributes<HTMLSpanElement>
    >
  }) => {
    root.activePath = childRoute.path
    let removeIndex = -1
    const isExist = root.panes.find((pane, index) => {
      if (pane.key === childRoute.path) {
        removeIndex = index
        pane.visible = false
        return true
      }

      return false
    })

    if (isExist) {
      if (removeIndex !== -1) {
        setTimeout(() => {
          root.panes[removeIndex].visible = true
        }, 0)
      }
      return
    }
    root.add(childRoute.title, childRoute.path)
  }

  const recursionRoute = (routes: any): ReactNode => {
    if (!routes) {
      return null
    }
    return routes.map((route: any) => {
      if (route.roles && route.roles.every((rule: any) => rule !== root.role)) {
        return null
      }
      if (route.children) {
        return (
          <SubMenu key={route.path} title={route.title} icon={<route.Icon />}>
            {recursionRoute(route.children)}
          </SubMenu>
        )
      } else {
        return (
          <Menu.Item
            onClick={() => clickMenuItem(route)}
            key={route.path}
            title={route.title}
            icon={<route.Icon />}>
            <span>{route.title}</span>
            <Link to={route.path} />
          </Menu.Item>
        )
      }
    })
  }

  return (
    <Layout style={{minHeight: '100vh'}} className="layout">
      {root.isSpinner && <Spinner />}
      <Sider
        trigger={null}
        collapsed={isBreak ? true : collapsed}
        collapsedWidth={isBreak ? (breakCollapsed ? 0 : 80) : 80}
        onBreakpoint={changeIsBreak}
        onCollapse={changeCollapsed}
        breakpoint="sm">
        <Menu
          theme="dark"
          selectedKeys={[location.pathname + location.search]}
          onOpenChange={changeOpenKeys}
          openKeys={openKeys}
          mode="inline">
          {recursionRoute(routes)}
        </Menu>
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={{padding: 0}}>
          {React.createElement(
            (isBreak
            ? breakCollapsed
            : collapsed)
              ? MenuUnfoldOutlined
              : MenuFoldOutlined,
            {
              className: 'trigger',
              onClick: toggle,
            },
          )}
          <Button
            danger
            type="primary"
            className="logout-button"
            onClick={onLogout}>
            注销
          </Button>
        </Header>
        <Content style={{margin: '16px'}}>
          <Tabs
            type="editable-card"
            onChange={onChange}
            activeKey={root.activePath}
            onEdit={onEdit}
            hideAdd>
            {root.panes &&
              root.panes.map((pane, index) => (
                <TabPane
                  tab={pane.title}
                  key={pane.key}
                  closable={index !== root.panes.length - 1}>
                  {pane.visible ? getTabsComponent(pane.key).component : null}
                </TabPane>
              ))}
          </Tabs>
        </Content>
      </Layout>
    </Layout>
  )
}

export default observer(Home)
