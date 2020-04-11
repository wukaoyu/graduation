import React from 'react'
import { Card, Radio, Button, Popover } from 'antd'
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
              {questionData.questionJson.questionTitle}
            </div>
            <div className='single-head-handle'>
              <Button className='single-head-handle-btn' size='small' onClick={() => this.editorQuestion()}>编辑</Button>
              <Popover placement="top" trigger='click' content = {
                  <div>
                      <p>删除后将无法复原数据，<br/>确认删除改题目吗？</p>
                      <div className='teacher-delete-btn'>
                          <Button type="danger" size={'small'} onClick={() => this.deleteQuestion()}>确认</Button>
                      </div>
                  </div>
                }>            
                <Button className='single-head-handle-btn' size='small'>删除</Button>
              </Popover>
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
          <div className='single-label'>
            <div className='single-label-diff' 
            style={{backgroundColor: questionData.difficultyArray[questionData.difficulty].color}}>
              {questionData.difficultyArray[questionData.difficulty].text}
            </div>
            <div className='single-label-test'
            style={{backgroundColor: questionData.isTestArray[questionData.isTest].color}}>
              {questionData.isTestArray[questionData.isTest].text}
            </div>
            <div className='single-label-answer'>参考答案：{String.fromCharCode(questionData.answerTrue[0] + 65)}</div>
          </div>
        </Card>
      </div>
    )
  }
  //编辑题目
  editorQuestion = () => {
    this.props.openEditorModel()
  }

  // 删除题目
  deleteQuestion = () => {
    this.props.deleteQuestion()
  }
}

export default SingleElection