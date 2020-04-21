import React from 'react'
import { Card, Radio } from 'antd'
import '../index.less'

class SingleElection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: props.questionData,
      isEnd: props.isEnd
    }
  }

  static getDerivedStateFromProps(nextProps, preState) {
    const newData = JSON.stringify(nextProps)
    const oldData = JSON.stringify(preState)
    if (newData !== oldData) {
      return {
        questionData: nextProps.questionData,
        isEnd: nextProps.isEnd
      }
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
              {questionData.index + 1}. {questionData.questionJson.questionTitle}
            </div>
            {
              this.state.isEnd ? 
                questionData.isTrue ? 
                <div className='card-showTrue'>
                  正确
                </div> : 
                <div className='card-showFalse'>
                  错误
                </div>
              : ''
            }
          </div>
          {
            questionData.imgUrl ? 
            <img src={questionData.imgUrl} alt="avatar" style={{marginBottom:'10px'}} /> : ''
          }
          <div>
          <Radio.Group onChange={(e) => this.changeVal(e)}>
            {
              questionData.answerJson.map((item, index) => {
                return (
                <Radio key={index} value={index}>{String.fromCharCode(index + 65)}、{item.answer}</Radio>
                )
              })
            }
          </Radio.Group>
          </div>
          {
            this.state.isEnd && !questionData.isTrue ?
            <div className='card-showAnswer'>
              <div className='card-showAnswer-text'>
                正确答案：{String.fromCharCode(questionData.answerTrue[0] + 65)}
              </div>
            </div> : ''
          }
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

export default SingleElection