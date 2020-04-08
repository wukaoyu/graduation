import React from 'react'
import { Card, Radio, Button } from 'antd'
import '../index.less'

class SingleElection extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: props.questionData
    }
  }
  
  render () {
    const questionData = this.state.questionData
    return (
      // 单选题
      <div>
        <Card>
          <div className='single-head'>
            <div className='single-head-title'>
              {questionData.questionJson.questionTitle}
            </div>
            <div className='single-head-handle'>
              <Button className='single-head-handle-btn' size='small' onClick={() => this.editorQuestion()}>编辑</Button>
              <Button className='single-head-handle-btn' size='small'>删除</Button>
            </div>
          </div>
          {
            questionData.imgUrl ? 
            <img src={questionData.imgUrl} alt="avatar" style={{marginBottom:'10px'}} /> : ''
          }
          <div>
            <Radio.Group defaultValue={questionData.answerTrue[0]}>
              {
                questionData.answerJson.map((item, index) => {
                  return (
                    <Radio key={index} value={index}>{item.option}、{item.answer}</Radio>
                  )
                })
              }
            </Radio.Group>
          </div>
          <div className='single-label'>
            <div className='single-label-diff' 
            style={{backgroundColor: questionData.difficultyArray[questionData.difficulty].color}}>
              {questionData.difficultyArray[questionData.difficulty].text}
            </div>
            <div className='single-label-test'
            style={{backgroundColor: questionData.isTestArray[questionData.isTest].color}}>
              {questionData.isTestArray[questionData.isTest].text}
            </div>
            <div className='single-label-answer'>参考答案：{questionData.answerJson[questionData.answerTrue[0]].option}</div>
          </div>
        </Card>
      </div>
    )
  }

  editorQuestion = () => {
    this.props.editorQuestion()
  }
}

export default SingleElection