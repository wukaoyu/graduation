import React from 'react'
import { queryMyResult } from 'api/examination';
import QueueAnim from 'rc-queue-anim';
import { Button } from 'antd'
import SingleElection from './correctionComponents/singleElection'
import MultipleChoice from './correctionComponents/multipleChoice'
import Completion from './correctionComponents/completion'
import ShortAnswer from './correctionComponents/shortAnswer'

const createHistory = require("history").createHashHistory

const history = createHistory()

class TestPapergetMarks extends React.Component {
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
        questionJson: [],
        result: {
          subjective: 0
        }
      },
      fullMarks: 0,
      otherProps: {}
    }
  }

  componentDidMount() {
    this.funQueryMyResult()
  }

  render() {
    return (
      <div>
        {
          this.state.otherProps.isEnd ? 
          <div>
            <div className='paper-head'>
              {this.state.testPaperData.name}
            </div>
            <div className='getMark-marks'>
              <div className='getMark-subjective'>
                主观题得分：{this.state.testPaperData.result.subjective}
              </div>
              <div className='getMark-fullMarks'>
                总分：{this.state.fullMarks}
              </div>
            </div>
            <QueueAnim
              style={{marginBottom:'20px'}}
              duration={600}
              animConfig={[
                { opacity: [1, 0], translateX: [0, 100] }
              ]}>
              {
                this.state.testPaperData.questionJson.map((item, index) => {
                  let comp = ''
                  item.index = index
                  switch (item.type) {
                    case 3:
                      comp = <Completion questionData={item} otherProps={this.state.otherProps} />
                      break;
                    case 4:
                      comp = <ShortAnswer questionData={item} otherProps={this.state.otherProps} />
                      break;
                    default:
                      break;
                  }
                  if (this.state.otherProps.isEnd) {
                    switch (item.type) {
                      case 1:
                        comp = <SingleElection questionData={item} otherProps={this.state.otherProps} />
                        break;
                      case 2:
                        comp = <MultipleChoice questionData={item} otherProps={this.state.otherProps} />
                        break;
                      default:
                        break;
                    }
                  }
                  return (
                    <div key={index} style={{marginTop:'10px'}}>
                      { comp }
                    </div>
                  )
                })
              }
              <div key={this.state.testPaperData.questionJson.length}>
                <Button style={{marginTop: '10px'}} onClick={() => this.goBack()}>返回</Button>
              </div>
            </QueueAnim>
          </div> : 
          <div>
            考试成绩尚未发布不可查看，请耐心等待...
          </div>
        }
      </div>
    )
  }
  // 查询试卷信息
  funQueryMyResult = () => {
    queryMyResult({examinationId: this.state.params.id}).then(res => {
      if (res.errno === 0) {
        let testPaperData = res.data

        res.data.result = res.data.result.allResultArray ? res.data.result : {
          subjective: 0,
          allResultArray: []
        }
        res.data.questionJson.forEach((item, index) => {
          item.correctionScore = res.data.result.allResultArray[index] || 0
          item.studentAnswer = res.data.answerJson[index] || []
        })
        let fullMarks = 0
        res.data.result.allResultArray.forEach(item => {
          fullMarks += item || 0
        })
        let otherProps = {
          isEnd : res.data.examIsEnd ? true : false
        }
        this.setState({
          testPaperData,
          fullMarks,
          otherProps
        })
      }
    })
  }

   // 返回上一页
  goBack = () => {
    history.goBack(); 
  }
}

export default TestPapergetMarks