import React from 'react'
import { Card, Input } from 'antd'

class ShortAnswer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: props.questionData,
      answerData: props.answerData || []
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const newData = JSON.stringify(nextProps)
    const oldData = JSON.stringify(preState)
    if (newData !== oldData) {
      return {questionData: nextProps.questionData}
    }
    return null
  }

  render () {
    const questionData = this.state.questionData
    return (
      // 简答题
      <div>
        <Card>
          <div className='single-head'>
            <div className='single-head-title'>
              {questionData.index + 1}.{questionData.questionJson.questionTitle}
            </div>
            <div className='exam-score'>
              分值：{questionData.score}
            </div>
          </div>
          {
            questionData.imgUrl ? 
            <img src={questionData.imgUrl} alt="avatar" style={{marginBottom:'10px'}} /> : ''
          }
          <div className='shortAnswer-answer'>
            <Input.TextArea defaultValue={this.state.answerData[0]} autoSize={{ minRows: 2, maxRows: 4 }} onBlur={(e) => this.changeVal(e)}/>
          </div>
        </Card>
      </div>
    )
  }
  changeVal = e => {
    let newData = {
      key: this.state.questionData.index,
      val: [e.target.value]
    }
    this.props.chanegAnswer(newData)
  }
}

export default ShortAnswer