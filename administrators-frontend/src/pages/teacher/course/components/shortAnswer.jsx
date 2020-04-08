import React from 'react'
import { Card, Button } from 'antd'

class ShortAnswer extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: props.questionData
    }
  }
  
  render () {
    const questionData = this.state.questionData
    return (
      // 简答题
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
          <div className='shortAnswer-answer'>
            <div>参考答案：</div>
            {
              questionData.answerTrue.map((item, index) => {
                return (
                  <div key={index}>
                    {`答案${index + 1}： ${item}`}
                  </div>
                )
              })
            }
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
          </div>
        </Card>
      </div>
    )
  }

  editorQuestion = () => {
    this.props.editorQuestion()
  }
}

export default ShortAnswer