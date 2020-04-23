import React from 'react'
import { queryStudentTestPaper, insertStudentResult, updataResult, examCorrection } from 'api/examination'
import SingleElection from './components/singleElection'
import MultipleChoice from './components/multipleChoice'
import Completion from './components/completion'
import ShortAnswer from './components/shortAnswer'
import QueueAnim from 'rc-queue-anim';
import './index.less'
import { Button, message, notification, Modal } from 'antd';

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
      examinationName: '',
      allMarks: 0,
      isShowBtn: true,
      timeRemaining: '',
      timeRemainingText: '',
      allData: {},
      submitModel: false
    }
  }

  componentDidMount() {
    this.funQueryStudentTestPaper()
  }
  //卸载组件取消倒计时
  componentWillUnmount(){
    clearTimeout(this.timeInter)
  }

  render() {
    return (
      <div className='examination-box'>
        {
          !this.state.allData.isEnd ? 
          <div>
            <div className='examination-head'>
              <div className='examination-head-title'>
                {this.state.examinationName}
              </div>
              <div className='examination-head-time'>
                剩余时间：{this.state.timeRemainingText}
              </div>
            </div>
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
                      comp = <SingleElection 
                              questionData={item} 
                              answerData={this.state.allData.answerJson[index]}
                              chanegAnswer={(val) => this.changeAnswer(val)}/>
                      break;
                    case 2:
                      comp = <MultipleChoice 
                              questionData={item} 
                              answerData={this.state.allData.answerJson[index]}
                              chanegAnswer={(val) => this.changeAnswer(val)}/>
                      break;
                    case 3:
                      comp = <Completion 
                              questionData={item} 
                              answerData={this.state.allData.answerJson[index]}
                              chanegAnswer={(val) => this.changeAnswer(val)}/>
                      break;
                    case 4:
                      comp = <ShortAnswer 
                              questionData={item} 
                              answerData={this.state.allData.answerJson[index]}
                              chanegAnswer={(val) => this.changeAnswer(val)}/>
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
                <Button type='primary' onClick={() => this.handOpenOrCloseModel('submitModel', true)} style={{marginRight: '10px'}}>
                  提交
                </Button>
                <Button onClick={() => this.goBack()}>返回</Button>
              </div>
            </QueueAnim>
            <Modal
              title="提示！"
              visible={this.state.submitModel}
              onOk={() => this.handleSubmit()}
              onCancel={() => this.handOpenOrCloseModel('submitModel', false)}
            >
              <p>提交后答案将不可再修改，确认提交吗？</p>
            </Modal>
          </div> :
          <div className='examination-nowEnd'>
            主观题得分为：{this.state.allData.result.subjective}分，客观题得分请等待批改结果...
          </div>
        }
      </div>
    )
  }

  /**
   * 打开或关闭弹窗
   * @param {*} name 弹窗名称
   * @param {*} flag 开启或关闭
   */
  handOpenOrCloseModel = (name, flag) => {
    this.setState({
      [name]: flag
    })
  }
  // 查询考试信息
  funQueryStudentTestPaper = () => {
    queryStudentTestPaper({examinationId: this.state.params.id}).then(res => {
      if (res.errno === 0) {
        let questionData =  res.data.questionJson
        let startTime = res.data.startTime;
        startTime = new Date(startTime.replace(/-/g, '/')).getTime();
        let nowTime = new Date().getTime()
        let timeRemaining = Math.round(((startTime + res.data.testTime * 60 * 1000) - nowTime) / 1000)
        let min = parseInt(timeRemaining / 60)
        let second = parseInt(timeRemaining % 60)
        let timeRemainingText = `${min}分钟${second < 10 ? '0' + second : second}秒`
        this.setState({
          questionDataList: questionData,
          examinationName: res.data.examinationName,
          isShowBtn: true,
          timeRemaining,
          timeRemainingText,
          allData: res.data
        },() => {
          this.getSetInter()
        })
      }else if (res.data === '暂无数据') {
        this.funInsertStudentResult()
      }
    })
  }
  // 第一次进入时添加一条数据
  funInsertStudentResult = () => {
    insertStudentResult({examinationId: this.state.params.id}).then(res => {
      if (res.errno === 0) {
        this.funQueryStudentTestPaper()
      }else {
        message.error(res.data)
      }
    })
  }
  changeAnswer = answer => {
    let newAnswerList = this.state.allData.answerJson
    newAnswerList[answer.key] = answer.val
    let data = {
      answerJson: JSON.stringify(newAnswerList), 
      id: this.state.allData.id
    }
    updataResult(data)
  }
  // 倒计时计算
  getSetInter = () => {
    let time = this.state.timeRemaining - 1
    let min = parseInt(time / 60)
    let second = parseInt(time % 60)
    let timeRemainingText = `${min}分钟${second < 10 ? '0' + second : second}秒`
    if (time < 0) {
      clearTimeout(this.timeInter)
      // this.handleSubmit()
    }else {
      this.timeInter = setTimeout(() => {
        this.setState({
          timeRemainingText,
          timeRemaining: time
        },() => {
          this.getSetInter()
        })
        if (time === 900) {
          notification.warning({
            message: '考试剩余15分钟',
          })
        }
      }, 1000);
    }
  }
  // 提交试卷
  handleSubmit = () => {
    let newData = this.state.allData
    newData.isEnd = 1
    examCorrection({examinationId: this.state.params.id}).then(res => {
      if (res.errno === 0) {
        newData.result.subjective = res.data.fullMarks
        this.setState({
          allData: newData
        })
      }
    })
  }
  // 返回上一页
  goBack = () => {
    history.goBack(); 
  }
}

export default practice

