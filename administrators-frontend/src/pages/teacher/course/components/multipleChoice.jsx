import React from 'react'
import { Card, Button, Checkbox } from 'antd'

class MultipleChoice extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: props.questionData
    }
  }
  
  render () {
    const questionData = this.state.questionData
    return (
      // 多选题
      <div>
        <Card>
          <div className='single-head'>
            <div className='single-head-title'>
              {questionData.quetionJson.questionTitle}
            </div>
            <div className='single-head-handle'>
              <Button className='single-head-handle-btn' size='small'>编辑</Button>
              <Button className='single-head-handle-btn' size='small'>删除</Button>
            </div>
          </div>
          <div>
            <Checkbox.Group  defaultValue={questionData.answerTrue}>
            {
                questionData.answerJson.map((item, index) => {
                  return (
                    <Checkbox key={index} value={index}>{item.option}、{item.answer}</Checkbox>
                  )
                })
              }
            </Checkbox.Group>
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
            <div className='single-label-answer'>
              参考答案：
              {
                questionData.answerTrue.map(item => {
                  return questionData.answerJson[item].option
                })
              }
            </div>
          </div>
        </Card>
      </div>
    )
  }
}

export default MultipleChoice