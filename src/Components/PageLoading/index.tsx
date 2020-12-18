import React from 'react'
import {Spin} from 'antd'
import {LoadingOutlined} from '@ant-design/icons'
const antIcon = <LoadingOutlined style={{fontSize: 24}} spin />

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
const PageLoading = () => (
  <div style={{paddingTop: 100, textAlign: 'center'}}>
    <Spin size="large" indicator={antIcon} />
  </div>
)

export default PageLoading
