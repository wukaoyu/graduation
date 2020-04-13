import React from 'react'
import { Card, Radio } from 'antd'
import '../index.less'

class SingleElection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: props.questionData
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
      // 单选题
      <div>
        <Card>
          <div className='single-head'>
            <div className='single-head-title'>
              {questionData.questionTitle}
            </div>
            <div className='single-label-diff' 
            style={{backgroundColor: questionData.difficultyArray[questionData.difficulty].color}}>
              {questionData.difficultyArray[questionData.difficulty].text}
            </div>
          </div>
          {
            questionData.imgUrl ? 
            <img src={questionData.imgUrl} alt="avatar" style={{marginBottom:'10px'}} /> : ''
          }
          <div>
            <Radio.Group value={questionData.answerTrue[0]}>
              {
                questionData.answerJson.map((item, index) => {
                  return (
                  <Radio key={index} value={index}>{String.fromCharCode(index + 65)}、{item.answer}</Radio>
                  )
                })
              }
            </Radio.Group>
          </div>
          <div className='single-label-answerChoose'>参考答案：{String.fromCharCode(questionData.answerTrue[0] + 65)}</div>
        </Card>
      </div>
    )
  }
}

export default SingleElection