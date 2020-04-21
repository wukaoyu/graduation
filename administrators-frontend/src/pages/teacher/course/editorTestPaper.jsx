import React from 'react'
import { queryTestPaperId, upDataTestPaper } from 'api/teacher/course'
import QueueAnim from 'rc-queue-anim';
import { Button, message } from 'antd'
import SingleElection from './editorPaperComponents/singleElection'
import MultipleChoice from './editorPaperComponents/multipleChoice'
import Completion from './editorPaperComponents/completion'
import ShortAnswer from './editorPaperComponents/shortAnswer'

const createHistory = require("history").createHashHistory

const history = createHistory()

class EditorTestPaper extends React.Component {
  constructor(props) {
    super(props)
    let paramData = {}, searchArray = this.props.location.search.substr(1).split('&')
    searchArray.forEach(item => {
    let newArray = item.split('=')
        paramData[newArray[0]] = parseInt(newArray[1])
    })
    this.state = {
      params: paramData,
      testPaperData: {
        rules: []
      },
      fullMarks: 0
    }
  }

  componentDidMount() {
    this.funQueryTestId()
  }

  render() {
    return (
      <div>
        <Button type='primary' style={{marginRight:'10px'}} onClick={() => this.toChooseQuestion()}>选择题目</Button>
        <Button onClick={() => this.goBack()}>返回</Button>
        <div className='paper-head'>
          {this.state.testPaperData.name}
        </div>
        <div className='paper-fullMarks'>
          满分：{this.state.fullMarks}
        </div>
        <QueueAnim
          style={{marginBottom:'20px'}}
          duration={600}
          animConfig={[
            { opacity: [1, 0], translateX: [0, 100] }
          ]}>
          {
            this.state.testPaperData.rules.map((item, index) => {
              let comp = ''
              item.difficultyArray = [
                {
                  color: '#48A9A6',
                  text: '简单'
                },
                {
                  color: '#F58A07',
                  text: '一般'
                },
                {
                  color: '#D45113',
                  text: '困难'
                },
                {
                  color: '#F40000',
                  text: '非常困难'
                }
              ]
              item.index = index
              switch (item.type) {
                case 1:
                  comp = <SingleElection questionData={item} questionLength={this.state.testPaperData.rules.length}
                        upQuestion={() => this.upQuestion(index)}
                        deleteQuestion={() => this.deleteQuestion(index)}
                        downQuestion={() => this.downQuestion(index)}
                        changeMarks={(value) => this.changeMarks(index, value)}/>
                  break;
                case 2:
                  comp = <MultipleChoice questionData={item} questionLength={this.state.testPaperData.rules.length}
                        upQuestion={() => this.upQuestion(index)}
                        deleteQuestion={() => this.deleteQuestion(index)}
                        downQuestion={() => this.downQuestion(index)}
                        changeMarks={(value) => this.changeMarks(index, value)}/>
                  break;
                case 3:
                  comp = <Completion questionData={item} questionLength={this.state.testPaperData.rules.length}
                        upQuestion={() => this.upQuestion(index)}
                        deleteQuestion={() => this.deleteQuestion(index)}
                        downQuestion={() => this.downQuestion(index)}
                        changeMarks={(value) => this.changeMarks(index, value)}/>
                  break;
                case 4:
                  comp = <ShortAnswer questionData={item} questionLength={this.state.testPaperData.rules.length}
                        upQuestion={() => this.upQuestion(index)}
                        deleteQuestion={() => this.deleteQuestion(index)}
                        downQuestion={() => this.downQuestion(index)}
                        changeMarks={(value) => this.changeMarks(index, value)}/>
                  break;
                default:
                  break;
              }
              return (
                <div key={item.key} style={{marginTop:'10px'}}>
                  { comp }
                </div>
              )
            })
          }
        </QueueAnim>
      </div>
    )
  }
  // 查询试卷信息
  funQueryTestId = () => {
    queryTestPaperId({id: this.state.params.id, curriculumId: this.state.params.courseId}).then(res => {
      if (res.errno === 0) {
        let testPaperData = res.data
        let fullMarks = 0
        testPaperData.rules = JSON.parse(testPaperData.rules)
        testPaperData.rules.forEach((item, index) => {
          item.key = index
          fullMarks += parseInt(item.score)
        })
        this.setState({
          testPaperData,
          fullMarks
        })
      }
    })
  }

   // 返回上一页
  goBack = () => {
    history.goBack(); 
  }
  // 跳转到题目选择页
  toChooseQuestion = () => {
    this.props.history.push('/teacher/course/chooseQuestion?paperId=' + this.state.params.id + '&courseId=' + this.state.params.courseId)
  }
  // 题目上移
  upQuestion = index => {
    let rules = JSON.parse(JSON.stringify(this.state.testPaperData.rules)) 
    let nowRules = {} 
    nowRules = rules[index]
    rules[index] = rules[index - 1]
    rules[index - 1] = nowRules
    let data = {
      rules: JSON.stringify(rules),
      id: this.state.params.id 
    }
    upDataTestPaper(data).then(res => {
      if (res.errno === 0) {
        this.funQueryTestId()
      }else {
        message.error('修改失败')
      }
    })
  }
  // 题目下移
  downQuestion = index => {
    let rules = JSON.parse(JSON.stringify(this.state.testPaperData.rules)) 
    let nowRules = {} 
    nowRules = rules[index]
    rules[index] = rules[index + 1]
    rules[index + 1] = nowRules
    let data = {
      rules: JSON.stringify(rules),
      id: this.state.params.id 
    }
    upDataTestPaper(data).then(res => {
      if (res.errno === 0) {
        this.funQueryTestId()
      }else {
        message.error('修改失败')
      }
    })
  }
  // 删除题目
  deleteQuestion = index => {
    let rules = JSON.parse(JSON.stringify(this.state.testPaperData.rules)) 
    let fullMarks = parseInt(this.state.testPaperData.fullMarks) - parseInt(rules[index].score)
    rules.splice(index, 1)
    let data = {
      rules: JSON.stringify(rules),
      id: this.state.params.id,
      fullMarks
    }
    upDataTestPaper(data).then(res => {
      if (res.errno === 0) {
        this.funQueryTestId()
      }else {
        message.error('修改失败')
      }
    })
  }
  // 修改题目分数
  changeMarks = (index, value) => {
    let rules = JSON.parse(JSON.stringify(this.state.testPaperData.rules))
    let oldScore = parseInt(JSON.parse(JSON.stringify(rules[index].score)))
    let fullMarks = parseInt(this.state.testPaperData.fullMarks) + parseInt(value) - oldScore
    rules[index].score = value
    let data = {
      rules: JSON.stringify(rules),
      id: this.state.params.id,
      fullMarks
    }
    upDataTestPaper(data).then(res => {
      if (res.errno === 0) {
        this.funQueryTestId()
      }else {
        message.error('修改失败')
      }
    })
  }
}

export default EditorTestPaper