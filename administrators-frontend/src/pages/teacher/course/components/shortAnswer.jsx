import React from 'react'
import { Card } from 'antd'

class ShortAnswer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  render () {
    return (
      // 简答题
      <div>
        <Card>
          <div className='single-title'>
            一段很长很长很长很长很长长很长的题目（简答）
          </div>
        </Card>
      </div>
    )
  }
}

export default ShortAnswer