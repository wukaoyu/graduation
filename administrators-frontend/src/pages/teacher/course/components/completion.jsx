import React from 'react'
import { Card } from 'antd'

class Completion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  
  render () {
    return (
      // 填空题
      <div>
        <Card>
          <div className='single-title'>
            一段很长很长很长很长很长长很长的题目（填空）
          </div>
        </Card>
      </div>
    )
  }
}

export default Completion