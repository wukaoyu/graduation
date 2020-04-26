import React from 'react'
import { Card, Radio, InputNumber } from 'antd'
import '../index.less'

class SingleElection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: props.questionData,
      otherProps: props.otherProps
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
      // 单选题
      <div>
        <Card>
          <div className='single-head'>
            <div className='single-head-title'>
              {questionData.index + 1}. {questionData.questionJson.questionTitle}
            </div>
            {
              this.state.otherProps.isEnd ? 
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
          <Radio.Group defaultValue={questionData.studentAnswer[0]} disabled>
            {
              questionData.answerJson.map((item, index) => {
                return (
                <Radio key={index} value={index}>{String.fromCharCode(index + 65)}、{item.answer}</Radio>
                )
              })
            }
          </Radio.Group>
          </div>
          <div className='correction-handle'>
            <div className='editor-handle-score'>
              <div className='editor-handle-score-label'>得分：</div>
              <InputNumber disabled={this.state.otherProps.isEnd} min={0} max={parseInt(questionData.score)} size='small' className='getMark-input' defaultValue={questionData.correctionScore} />
            </div>
            <div className='getMark-max'>
              分值：{questionData.score}
            </div>
            {
              this.state.otherProps.isEnd ?
              <div className='card-showAnswer'>
                <div className='card-showAnswer-text'>
                  正确答案：{String.fromCharCode(questionData.answerTrue[0] + 65)}
                </div>
              </div> : ''
            }
          </div>
        </Card>
      </div>
    )
  }
}

export default SingleElection