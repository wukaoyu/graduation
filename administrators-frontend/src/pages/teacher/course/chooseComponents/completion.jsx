import React from 'react'
import { Card } from 'antd'

class Completion extends React.Component {
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
    let questionData = this.state.questionData
    let compTitle = ''
    questionData.questionJson.forEach((item, index) => {
      if (item.type) {
        compTitle += item.title
      }else {
        compTitle += ' _______ '
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
            <div className='single-label-diff' 
            style={{backgroundColor: questionData.difficultyArray[questionData.difficulty].color}}>
              {questionData.difficultyArray[questionData.difficulty].text}
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
        </Card>
      </div>
    )
  }
  // 编辑题目
  editorQuestion = () => {
    this.props.openEditorModel()
  }
  // 删除题目
  deleteQuestion = () => {
    this.props.deleteQuestion()
  }
}


export default Completion