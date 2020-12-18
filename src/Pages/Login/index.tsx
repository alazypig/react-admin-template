import React from 'react'
import {Form, Input, Button} from 'antd'
import {UserOutlined, LockOutlined} from '@ant-design/icons'
import {observer} from 'mobx-react'
import useLogin from './hook'

import './index.scss'
import useStores from 'Stores'
import {Redirect} from 'react-router-dom'

const Login = () => {
  const {root} = useStores()
  const {onFinish} = useLogin()
  if (root.isLogin) {
    return <Redirect to="/home/homepage" />
  }

  return (
    <div className="login">
      <Form
        className="form"
        name="basic"
        initialValues={{remember: true}}
        onFinish={onFinish}>
        <Form.Item
          name="username"
          rules={[{required: true, message: 'Please input your username!'}]}>
          <Input
            placeholder="用户名"
            data-testid="login username input"
            prefix={<UserOutlined />}
            size="large"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[{required: true, message: 'Please input your password!'}]}>
          <Input.Password
            data-testid="login password input"
            placeholder="密码"
            prefix={<LockOutlined />}
            size="large"
          />
        </Form.Item>
        <Button
          type="primary"
          size="large"
          data-testid="login btn"
          htmlType="submit"
          className="submit-button">
          登录
        </Button>
      </Form>
    </div>
  )
}

export default observer(Login)
