import React from 'react'
import { Card, Radio, Button } from 'antd'
import '../index.less'

class SingleElection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  render () {
    return (
      // 单选题
      <div>
        <Card>
          <div className='single-head'>
            <div className='single-head-title'>
              一段很长很长很长很长很长长很长的题目（单选）
            </div>
            <div className='single-head-handle'>
              <Button className='single-head-handle-btn' size='small'>编辑</Button>
              <Button className='single-head-handle-btn' size='small'>删除</Button>
            </div>
          </div>
          <div>
          <Radio.Group >
            <Radio value={1}>A</Radio>
            <Radio value={2}>B</Radio>
            <Radio value={3}>C</Radio>
            <Radio value={4}>D</Radio>
          </Radio.Group>
          </div>
        </Card>
      </div>
    )
  }
}

export default SingleElection