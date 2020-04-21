import React from 'react'
import { queryPracticeQuestion } from 'api/course'
import SingleElection from './editorPaperComponents/singleElection'
import MultipleChoice from './editorPaperComponents/multipleChoice'
import QueueAnim from 'rc-queue-anim';
import './index.less'
import { Button, notification } from 'antd';
const createHistory = require("history").createHashHistory

const history = createHistory()
class practice extends React.Component {
  constructor (props) {
    super(props)
    let paramData = {}, searchArray = this.props.location.search.substr(1).split('&')
    searchArray.forEach(item => {
    let newArray = item.split('=')
        paramData[newArray[0]] = parseInt(newArray[1])
    })
    this.state = {
      params: paramData,
      questionDataList: [],
      courseName: '',
      answerList: [],
      isEnd: false,
      allMarks: 0,
      isShowBtn: true
    }
  }

  componentDidMount() {
    this.funQueryPracticeQuestion()
  }

  render() {
    return (
      <div>
        <div className='paper-head'>
          {this.state.courseName}
        </div>
        {
          this.state.isEnd ? 
          <div className='paper-marks'>
            得分：{this.state.allMarks}
          </div> : ''
        }
        <QueueAnim
          style={{marginBottom:'20px'}}
          duration={600}
          animConfig={[
            { opacity: [1, 0], translateX: [0, 100] }
          ]}>
          {
            this.state.questionDataList.map((item, index) => {
              let comp = ''
              item.index = index
              switch (item.type) {
                case 1:
                  comp = <SingleElection questionData={item} isEnd={this.state.isEnd} chanegAnswer={(val) => this.changeAnswer(val)}/>
                  break;
                case 2:
                  comp = <MultipleChoice questionData={item} isEnd={this.state.isEnd} chanegAnswer={(val) => this.changeAnswer(val)}/>
                  break;
                default:
                  break;
              }
              return (
                <div key={index} style={{marginTop:'10px'}}>
                  { comp }
                </div>
              )
            })
          }
          <div key={this.state.questionDataList.length} style={{marginTop: '20px'}}>
            <Button type='primary' onClick={() => this.correction()} style={{marginRight: '10px'}}>
              { this.state.isEnd ? '再练一次' : '提交'} 
            </Button>
            <Button onClick={() => this.goBack()}>返回</Button>
          </div>
        </QueueAnim>
      </div>
    )
  }

  funQueryPracticeQuestion = () => {
    queryPracticeQuestion({courseId: this.state.params.id}).then(res => {
      if (res.errno === 0) {
        let questionData = res.data.row
        questionData.forEach(item => {
          item.answerJson = JSON.parse(item.answerJson)
          item.answerTrue = JSON.parse(item.answerTrue)
          item.questionJson = JSON.parse(item.questionJson)
        })
        this.setState({
          questionDataList: questionData,
          courseName: res.data.courseName,
          isShowBtn: true
        })
      }
    })
  }
  changeAnswer = answer => {
    let newAnswerList = this.state.answerList
    newAnswerList[answer.key] = answer.val
    this.setState({
      answerList: newAnswerList
    })
  }
  correction = () => {
    if (this.state.isEnd) {
      history.go(0)
    }else {
      let oneMarks = 100 / this.state.questionDataList.length
      let myAnswer = this.state.answerList
      let myAnswerTrueLength = 0
      let myMarks = 0
      let questionDataList = this.state.questionDataList
      questionDataList.forEach((item, index) => {
        if (JSON.stringify(item.answerTrue) === JSON.stringify(myAnswer[index])) {
          myAnswerTrueLength++
          item.isTrue = true
        }else {
          item.isTrue = false
        }
      })
      if (this.state.questionDataList.length) {
        myMarks = myAnswerTrueLength * oneMarks
      }
      notification.success({
        message: '本次测试得分：' + myMarks
      });
      this.setState({
        isEnd: true,
        questionDataList,
        allMarks: Math.round(myMarks)
      })
    }
  }
  // 返回上一页
  goBack = () => {
    history.goBack(); 
  }
}

export default practice

