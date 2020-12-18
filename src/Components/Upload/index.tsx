import React, {useState} from 'react'
import {Upload, message} from 'antd'
import {LoadingOutlined, PlusOutlined} from '@ant-design/icons'
import {RcFile} from 'antd/lib/upload'
import {File} from 'Api'
import {
  UploadChangeParam,
  RcCustomRequestOptions,
} from 'antd/lib/upload/interface'

export const getBase64 = (
  img: Blob,
  callback: (res: string | ArrayBuffer | null) => void,
) => {
  const reader = new FileReader()
  reader.addEventListener('load', () => callback(reader.result))
  reader.readAsDataURL(img)
}

interface UProps {
  onChange: (imgUrl: string) => void
}

const UploadButton = (props: UProps) => {
  const [isLoading, setIsLoading] = useState(false)
  const [imgUrl, setImgUrl] = useState<string | ArrayBuffer | null>()
  const uploadButton = (
    <div>
      {isLoading ? <LoadingOutlined /> : <PlusOutlined />}
      <div style={{marginTop: 8}}>Upload</div>
    </div>
  )
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('只能上传JPG/PNG格式的图片!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('图片大小不能大于2MB!')
    }
    return isJpgOrPng && isLt2M
  }
  const handleChange = (info: UploadChangeParam) => {
    if (info.file.status === 'uploading') {
      setIsLoading(true)
      return
    }
    if (info.file.status === 'done' && info.file.originFileObj) {
      // Get this url from response in real world.
      getBase64(info.file.originFileObj, imageUrl => {
        setIsLoading(false)
        setImgUrl(imageUrl)
      })
    }
  }

  const customUpload = async (file: RcCustomRequestOptions) => {
    const res = await File.uploadFiles(file.file)
    console.log(res, '====')
    if (!res.url) {
      message.error('上传失败，请重试')
      return
    }
    props.onChange(res.url)
  }

  return (
    <>
      <Upload
        // action="http://172.30.9.75:8080/group1/upload"
        name="file"
        listType="picture-card"
        className="avatar-uploader"
        showUploadList={false}
        beforeUpload={beforeUpload}
        // data={{
        //   output: 'json',
        //   // auth_token: JSON.stringify({
        //   //   token: account.token,
        //   //   id: account.id,
        //   // }),
        // }}
        //   onPreview={this.handlePreview}
        onChange={handleChange}
        customRequest={customUpload}>
        {imgUrl ? (
          <img src={imgUrl as string} alt="avatar" style={{width: '100%'}} />
        ) : (
          uploadButton
        )}
      </Upload>
      {/* <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal> */}
    </>
  )
}
export default UploadButton
