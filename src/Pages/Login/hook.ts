import {message} from 'antd'
import {Store} from 'antd/lib/form/interface'
import useStores from 'Stores'

const useLogin = () => {
  const {root} = useStores()
  const onFinish = async (values: Store) => {
    const res = await root.login(values.username, values.password)
    if (res.success) {
      message.success('登录成功', 2)
    } else {
      message.error(res.err_code!, 5)
    }
  }
  return {onFinish}
}

export default useLogin
