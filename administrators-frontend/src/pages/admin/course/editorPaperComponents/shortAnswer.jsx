import React from 'react'
import { Card, Input } from 'antd'

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
              {questionData.index + 1}.{questionData.questionJson.questionTitle}
            </div>
          </div>
          {
            questionData.imgUrl ? 
            <img src={questionData.imgUrl} alt="avatar" style={{marginBottom:'10px'}} /> : ''
          }
          <div className='shortAnswer-answer'>
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 4 }} />
          </div>
          <div className='editor-handle'>
            <div className='single-label-diff' 
            style={{backgroundColor: questionData.difficultyArray[questionData.difficulty].color, marginRight:'10px'}}>
              {questionData.difficultyArray[questionData.difficulty].text}
            </div>
            <div className='editor-handle-score'>
              <div className='editor-handle-score-label'>得分：{questionData.score}</div>
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
  // 上移题目
  upQuestion = () => {
    this.props.upQuestion()
  }
  // 下移题目
  downQuestion = () => {
    this.props.downQuestion()
  }
  // 改变题目分数
  changeMarks = (e) => {
    this.props.changeMarks(e.target.value)
  }
}

export default ShortAnswer