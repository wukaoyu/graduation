import React from 'react'
import { Card } from 'antd'

class MultipleChoice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  render () {
    return (
      // 多选题
      <div>
        <Card>
          <div className='single-title'>
            一段很长很长很长很长很长长很长的题目（多选）
          </div>
        </Card>
      </div>
    )
  }
}

export default MultipleChoice