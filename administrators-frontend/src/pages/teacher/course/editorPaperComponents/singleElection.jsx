import React from 'react'
import { Card, Radio, Button, Popover, Input } from 'antd'
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
    console.log(questionData)
    return (
      // 单选题
      <div>
        <Card>
          <div className='single-head'>
            <div className='single-head-title'>
              {questionData.index + 1}. {questionData.questionJson.questionTitle}
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
          <div>
          <Radio.Group>
            {
              questionData.answerJson.map((item, index) => {
                return (
                <Radio key={index} value={index}>{String.fromCharCode(index + 65)}、{item.answer}</Radio>
                )
              })
            }
          </Radio.Group>
          </div>
          <div className='editor-handle'>
            <Button size='small' className='editor-handle-btn'>上移</Button>
            <Button size='small' className='editor-handle-btn'>下移</Button>
            <Popover placement="top" trigger='click' content = {
                <div>
                    <p>确认从试卷中删除该题目吗？</p>
                    <div className='teacher-delete-btn'>
                        <Button type="danger" size={'small'} onClick={() => this.deletePaperQuestion()}>确认</Button>
                    </div>
                </div>
              }>            
              <Button size='small' className='editor-handle-btn'>删除</Button>
            </Popover>
            <div className='editor-handle-score'>
              <div className='editor-handle-score-label'>得分：</div>
              <Input className='editor-handle-score-input' defaultValue={questionData.score}/>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  deletePaperQuestion = () => {
    console.log('todo删除题目')
  }
}

export default SingleElection