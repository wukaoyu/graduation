import React from 'react'
import { Card } from 'antd'

class Completion extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      questionData: props.questionData,
      answerData: props.answerData || []
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
                          onBlur={(e) => this.chanegAnswer(e, (index - 1) / 2)}
                          defaultValue={this.state.answerData[(index - 1) / 2]}/>
                      </div>
                    )
                  }
                })
              }
            </div>
            <div className='exam-score'>
              分值：{questionData.score}
            </div>
          </div>
          {
            questionData.imgUrl ? 
            <img src={questionData.imgUrl} alt="avatar" style={{marginBottom:'10px'}} /> : ''
          }
        </Card>
      </div>
    )
  }
  chanegAnswer = (e, index) => {
    let answerList = this.state.answerData
    answerList[index] = e.target.value 
    let newData = {
      key: this.state.questionData.index,
      val: answerList
    } 
    this.props.chanegAnswer(newData)
  }
}


export default Completion