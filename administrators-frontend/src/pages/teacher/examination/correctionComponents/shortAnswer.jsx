import React from 'react'
import { Card, InputNumber, Input } from 'antd'

class ShortAnswer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: props.questionData,
      questionLength: props.questionLength
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
          </div>
          {
            questionData.imgUrl ? 
            <img src={questionData.imgUrl} alt="avatar" style={{marginBottom:'10px'}} /> : ''
          }
          <div className='correction-answer'>
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} defaultValue={questionData.studentAnswer[0]} disabled 
            style={{color: '#000'}}/>
          </div>
          <div className='shortAnswer-answer'>
            <div>参考答案：</div>
            {
              questionData.answerTrue.map((item, index) => {
                return (
                  <div key={index}>
                    {`答案${index + 1}： ${item.answer}`}
                  </div>
                )
              })
            }
          </div>
          <div className='correction-handle'>
            <div className='editor-handle-score'>
              <div className='editor-handle-score-label'>得分：</div>
              <InputNumber min={0} max={parseInt(questionData.score)} size='small' className='getMark-input' defaultValue={questionData.correctionScore} onBlur={(e) => this.changeMarks(e)}/>
            </div>
            <div className='getMark-max'>
              分值：{questionData.score}
            </div>
          </div>
        </Card>
      </div>
    )
  }
  // 改变题目分数
  changeMarks = (e) => {
    this.props.changeMarks(e.target.value)
  }
}

export default ShortAnswer