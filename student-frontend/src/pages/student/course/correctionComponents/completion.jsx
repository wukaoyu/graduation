import React from 'react'
import { Card, InputNumber } from 'antd'

class Completion extends React.Component {
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
      return {questionData: nextProps.questionData}
    }
    return null
  }

  render () {
    let questionData = this.state.questionData
    return (
      // 填空题
      <div>
        <Card>
          <div className='single-head'>
            <div className='single-head-title' style={{display: 'flex', alignItems:'center'}}>
              {questionData.index + 1}.
              {
                questionData.questionJson.map((item, index) => {
                  if (item.type) {
                    return (
                      <div key={index}>
                        {item.title}
                      </div>
                    )
                  }else {
                    return (
                      <div key={index}>
                        <input style={{
                          border: 'none', 
                          borderBottom:'1px solid #333', 
                          width: '80px',
                          outline: 'none',
                          margin: '0 5px',
                          textAlign: 'center'}}
                          defaultValue={questionData.studentAnswer[(index - 1) / 2]}
                          disabled/>
                      </div>
                    )
                  }
                })
              }
            </div>
          </div>
          {
            questionData.imgUrl ? 
            <img src={questionData.imgUrl} alt="avatar" style={{marginBottom:'10px'}} /> : ''
          }
          <div className='completion-answer'>
            <div>
              参考答案：
            </div>
            <div>
              {
                questionData.answerTrue.map((item, index) => {
                  return (
                    <div key={index} style={{display: 'flex',flexWrap:'wrap'}}>
                      填空{index + 1}：
                      {
                        item.map((itemText, itemTextIndex) => {
                          return (
                            <div key={itemTextIndex} style={{marginRight:'5px'}}>
                              {`[${itemText.text}]`}
                            </div>
                          )
                        })
                      }
                    </div>
                  )
                })
              }
            </div>
          </div>
          <div className='correction-handle'>
            <div className='editor-handle-score'>
              <div className='editor-handle-score-label'>得分：</div>
              <InputNumber disabled={this.state.otherProps.isEnd} min={0} max={parseInt(questionData.score)} size='small' className='getMark-input' defaultValue={questionData.correctionScore} onBlur={(e) => this.changeMarks(e)}/>
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
    this.props.changeMarks(parseInt(e.target.value))
  }
}


export default Completion