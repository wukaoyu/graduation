import React from 'react'
import { queryPracticeQuestion, queryQuestionLength } from 'api/course'
import SingleElection from './editorPaperComponents/singleElection'
import MultipleChoice from './editorPaperComponents/multipleChoice'
import './index.less'
import { Button, notification, Card, InputNumber, message } from 'antd';

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
      isShowBtn: true,
      isChooseQuestion: true,
      questionRule: {},
      questionMax: {
        singLength: 0,
        multipleLength: 0
      }
    }
  }

  componentDidMount() {
    this.funQueryQuestionLength()
  }

  render() {
    return (
      <div>
        {
          this.state.isChooseQuestion ? 
          <div>
            <Card title="题目数量选择">
              <div className='chooseBox'>
                <div className='chooseNum'>
                  <div>
                    单选题数量：
                  </div>
                  <InputNumber 
                  onBlur={(e) => this.changeQuestion(e, 'singleNum')}
                  min={this.state.questionMax.singLength > 5 ? 5 : this.state.questionMax.singLength} 
                  max={this.state.questionMax.singLength} ></InputNumber>
                </div>
                <div className='chooseNum'>
                  <div>
                    多选题数量：
                  </div>
                  <InputNumber 
                  onBlur={(e) => this.changeQuestion(e, 'multipleNum')}
                  min={this.state.questionMax.multipleLength > 5 ? 5 : this.state.questionMax.multipleLength} 
                  max={this.state.questionMax.multipleLength} ></InputNumber>
                </div>
                <Button onClick={() => this.goBack()}>返回</Button>
                <Button type='primary' style={{marginLeft: '10px'}} onClick={() => this.sureQuestionLength()}>确认</Button>
              </div>
            </Card>
          </div> : 
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
          </div>
        }
      </div>
    )
  }
  funQueryQuestionLength = () => {
    let data = { courseId: this.state.params.id }
    queryQuestionLength(data).then(res => {
      if (res.errno === 0) {
        this.setState({
          questionMax: res.data
        })
      }
    })
  }
  funQueryPracticeQuestion = () => {
    let data = {
      ...this.state.questionRule,
      courseId: this.state.params.id
    }
    queryPracticeQuestion(data).then(res => {
      if (res.errno === 0) {
        let questionData = res.data.row
        questionData.forEach(item => {
          item.answerJson = JSON.parse(item.answerJson)
          item.answerTrue = JSON.parse(item.answerTrue)
          item.questionJson = JSON.parse(item.questionJson)
          item.questionTitle = item.questionTitle.replace(/&quot;/g,`"`)
          switch (item.type) {
            case 1:
            case 2: 
              item.questionJson.questionTitle = item.questionJson.questionTitle.replace(/&quot;/g,`"`)
              item.answerJson.forEach(answerJsonItem => {
                answerJsonItem.answer = answerJsonItem.answer.replace(/&quot;/g,`"`)
              })
              break;
            case 3:
              item.questionJson.forEach(questionJsonItem => {
                questionJsonItem.title = questionJsonItem.title.replace(/&quot;/g,`"`)
              })
              item.answerTrue.forEach(answerTrueItem => {
                answerTrueItem.forEach(answerTrueSecondItem => {
                  answerTrueSecondItem = answerTrueSecondItem.text.replace(/&quot;/g,`"`)
                })
              })
              break;
            case 4:
              item.questionJson.questionTitle = item.questionJson.questionTitle.replace(/&quot;/g,`"`)
              item.answerTrue.forEach(answerTrueItem => {
                answerTrueItem.answer = answerTrueItem.answer.replace(/&quot;/g,`"`)
              })
              break;
            default:
              break;
          }
        })
        this.setState({
          questionDataList: questionData,
          courseName: res.data.courseName,
          isShowBtn: true
        })
      }
    })
  }
  sureQuestionLength = () => {
    if (this.state.questionRule.singleNum && this.state.questionRule.multipleNum) {
      this.setState({
        isChooseQuestion: false
      },() => {
        this.funQueryPracticeQuestion()
      })
    }else {
      message.warning('请输入题目数量')
    }
  }
  changeQuestion = (e, name) => {
    let newData = {
      ...this.state.questionRule,
      [name]: parseInt(e.target.value)
    }
    this.setState({
      questionRule: newData
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
      this.setState({
        isEnd: false,
      },() => {
        this.funQueryPracticeQuestion()
      })
    }else {
      let oneMarks = 100 / (this.state.questionRule.singleNum + this.state.questionRule.multipleNum * 2)
      let myAnswer = this.state.answerList
      let myAnswerTrueSingleLength = 0
      let myAnswerTrueMultipleLength = 0
      let myMarks = 0
      let questionDataList = this.state.questionDataList
      questionDataList.forEach((item, index) => {
        if (JSON.stringify(item.answerTrue) === JSON.stringify(myAnswer[index])) {
          if (item.type === 1) {
            myAnswerTrueSingleLength++
          }else {
            myAnswerTrueMultipleLength++
          }
          item.isTrue = true
        }else {
          item.isTrue = false
        }
      })
      if (this.state.questionDataList.length) {
        myMarks = myAnswerTrueSingleLength * oneMarks + myAnswerTrueMultipleLength * oneMarks * 2
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

