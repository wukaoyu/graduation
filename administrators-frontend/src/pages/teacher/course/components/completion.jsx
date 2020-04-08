import React from 'react'
import { Card, Button } from 'antd'

class Completion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: props.questionData
    }
  }
  
  render () {
    let questionData = this.state.questionData
    let compTitle = ''
    questionData.quetionJson.forEach((item, index) => {
      if (questionData.quetionJson.length - 1 !== index){
        compTitle += item + ' _______ '
      }
    })
    return (
      // 填空题
      <div>
        <Card>
          <div className='single-head'>
            <div className='single-head-title'>
              {compTitle}
            </div>
            <div className='single-head-handle'>
              <Button className='single-head-handle-btn' size='small'>编辑</Button>
              <Button className='single-head-handle-btn' size='small'>删除</Button>
            </div>
          </div>
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
                              {`[${itemText}]`}
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
}

export default Completion