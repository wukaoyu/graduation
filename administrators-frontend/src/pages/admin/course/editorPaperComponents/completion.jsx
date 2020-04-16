import React from 'react'
import { Card } from 'antd'

class Completion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: props.questionData
    }
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
                          textAlign: 'center'}}/>
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


export default Completion