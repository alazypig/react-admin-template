import React from 'react'
import {Modal} from 'antd'
import Loader from 'react-loader-spinner'

import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'
import './index.scss'

const Spinner = () => {
  return (
    <Modal
      className="spinner"
      visible={true}
      closable={false}
      centered={true}
      maskClosable={false}
      width={150}
      footer={null}>
      <Loader type="Oval" color="#333" height={150} width={150} />
    </Modal>
  )
}

export default Spinner
