import React, {useState} from 'react'
import {LeftOutlined, RightOutlined} from '@ant-design/icons'
import './index.scss'
interface SProps {
  width: number
  children: any
}

const SlideContainer = (props: SProps) => {
  const [left, setLeft] = useState(0)
  const itemWidth = props.children.props.children[0].props.width
  const itemHeight = props.children.props.children[0].props.height
  const itemsWidth = itemWidth * props.children.props.children.length
  return (
    <div className="slider-box" style={{width: props.width + 40 + 'px'}}>
      {itemsWidth > props.width && left < 0 ? (
        <div onClick={() => setLeft(left + itemWidth)}>
          <LeftOutlined />
        </div>
      ) : (
        ''
      )}
      <div
        className="slide-container"
        style={{width: props.width + 'px', height: itemHeight + 'px'}}>
        <div className="slide-block" style={{left: left + 'px'}}>
          {props.children}
        </div>
      </div>
      {itemsWidth > props.width && itemsWidth + left > props.width ? (
        <div onClick={() => setLeft(left - itemWidth)}>
          <RightOutlined />
        </div>
      ) : (
        ''
      )}
    </div>
  )
}
export default SlideContainer
