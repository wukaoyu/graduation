import React from 'react'
import { Card, Checkbox, InputNumber } from 'antd'
import '../index.less'

class MultipleChoice extends React.Component {
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
          <Checkbox.Group defaultValue={questionData.studentAnswer} disabled>
            {
              questionData.answerJson.map((item, index) => {
                return (
                <Checkbox key={index} value={index}>{String.fromCharCode(index + 65)}、{item.answer}</Checkbox>
                )
              })
            }
          </Checkbox.Group>
          </div>
          <div className='correction-handle'>
            <div className='editor-handle-score'>
              <div className='editor-handle-score-label'>得分：</div>
              <InputNumber disabled={this.state.otherProps.isEnd} min={0} max={parseInt(questionData.score)} size='small' className='getMark-input' defaultValue={questionData.correctionScore} onBlur={(e) => this.changeMarks(e)}/>
            </div>
            <div className='getMark-max'>
              分值：{questionData.score}
            </div>
            {
              this.state.otherProps.isEnd ?
              <div className='card-showAnswer' style={{margin: '0 0 0 10px'}}>
                <div className='card-showAnswer-text' >
                  正确答案：
                  {
                    questionData.answerTrue.map(item => {
                      return String.fromCharCode(item + 65)
                    })
                  }
                </div>
              </div> : ''
            }
          </div>
        </Card>
      </div>
    )
  }
}

export default MultipleChoice