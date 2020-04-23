import React from 'react'
import { Card, Checkbox } from 'antd'

class MultipleChoice extends React.Component {
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
      return {
        questionData: nextProps.questionData
      }
    }
    return null
  }

  render () {
    const questionData = this.state.questionData
    return (
      // 多选题
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
          <div>
            <Checkbox.Group defaultValue={this.state.answerData} onChange={(val) => this.changeVal(val)}>
            {
                questionData.answerJson.map((item, index) => {
                  return (
                    <Checkbox key={index} value={index}>{String.fromCharCode(index + 65)}、{item.answer}</Checkbox>
                  )
                })
              }
            </Checkbox.Group>
          </div>
        </Card>
      </div>
    )
  }
  changeVal = val => {
    let newVal = val.sort((a, b) => {
      return a - b
    })
    let newData = {
      key: this.state.questionData.index,
      val: newVal
    }
    this.props.chanegAnswer(newData)
  }
}

export default MultipleChoice