import React from 'react'
import { queryStudentResult, updataExamination } from 'api/teacher/examination'
import QueueAnim from 'rc-queue-anim';
import { Card, Button, Progress, Modal } from "antd";

const createHistory = require("history").createHashHistory

const history = createHistory()
class TestPaperCorrection extends React.Component {
  constructor(props) {
    super(props)
    let paramData = {}, searchArray = this.props.location.search.substr(1).split('&')
    searchArray.forEach(item => {
    let newArray = item.split('=')
        paramData[newArray[0]] = parseInt(newArray[1])
    })
    this.state = {
      params: paramData,
      pageData:{
        pageSize:10,// 每页条数
        current: 1,// 当前页数
        total: 0,// 数据总数
      },
      studentList: [],
      examData: {},
      releaseVisible: false
    }
  }

  componentDidMount() {
    this.funQueryStudentResult()
  }

  render() {
    return (
      <div>
        <div className='result-inform'>
          <div className='result-inform-class'>
            班级：{this.state.examData.className}
          </div>
          <div className='result-inform-name'>
            考试名：{this.state.examData.name}
          </div>
          <Button type='primary' style={{marginLeft: '10px', height: '30px'}} onClick={() => this.openOrCloseModal('releaseVisible', true)}>发布成绩</Button>
          <Button style={{marginLeft: '10px', height: '30px'}} onClick={() => this.goBack()}>返回</Button>
        </div>
        <QueueAnim
          style={{ display: 'flex', flexWrap: 'wrap' }}
          duration={600}
          animConfig={[
            { opacity: [1, 0], translateX: [0, 100] }
          ]}>
            {
              this.state.studentList.map((item, index) => {
                return (
                  <div key={item.id}>
                    <Card style={{ width: 350, marginTop: 16, marginRight: 16 }} hoverable 
                      title={item.username}
                      extra={<Button className='exam-card-list-handle-correction' size='small' onClick={() => this.toGetMarks(item.id)}>继续批改</Button>}>
                        <div className="studentMain">
                          <div className='studentResult-head'>
                            <img className='studentMain-head-img' src={item.headPortraitUrl || "http://wkydegraduation.oss-cn-beijing.aliyuncs.com/image/headPortraitUrl.png"} alt="head"/>
                          </div>
                          <div>
                            <div className='studentResult-describe'>
                              <div className='studentResult-describe-key'>开始时间：</div>
                              <div className='studentResult-describe-val'>{item.startTime}</div>
                            </div>
                            <div className='studentResult-describe'>
                              <div className='studentResult-describe-key'>提交时间：</div>
                              <div className='studentResult-describe-val'>{item.endTime}</div>
                            </div>
                            <div className='studentResult-describe'>
                              <div className='studentResult-describe-key'>批改进度：</div>
                              <div className='result-list-progress'>
                                <Progress percent={item.corrPre || 0} size="small" />
                              </div>
                            </div>
                            <div className='studentResult-describe' style={{marginTop:'3px'}}>
                              <div className='studentResult-describe-key'>得分：</div>
                              <div className='paper-list-fullText'>
                                {item.fullMarks}
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                  </div>
                )
              })
            }
          </QueueAnim>
        <Modal
          title="提醒"
          visible={this.state.releaseVisible}
          onOk={this.releaseResults}
          onCancel={this.handleCancel}
        >
          成绩发布后便不可再修改，确认发布吗？
        </Modal>
      </div>
    )
  }

  funQueryStudentResult = () => {
    let data = {
      ...this.state.searchData,
      id: this.state.params.id
    }
    queryStudentResult(data).then(res => {
      if (res.errno === 0) {
        res.data.row.forEach(item => {
          let count = 0
          let resultLength = 0
          item.questionJson.forEach(questionItem => {
            if (questionItem.type === 1 || questionItem.type === 2) {
              count++
            }
          })
          let marks = 0
          item.result = item.result.allResultArray ? item.result : {
            subjective: 0,
            allResultArray: []
          }
          item.result.allResultArray.forEach(resultItem => {
            marks += resultItem || 0
            if (resultItem !== null && resultItem > -1) {
              resultLength++
            }
          })
          item.fullMarks = marks
          if (item.questionJson.length - count === 0) {
            item.corrPre = 100
          }else {
            item.corrPre = Math.round((resultLength - count) / (item.questionJson.length - count) * 100)
          }
        })
        this.setState({
          studentList: res.data.row,
          examData: res.data.examData
        })
      }
    })
  }

  toGetMarks = (id) => {
    this.props.history.push('/teacher/examinationRecord/testPapergetMarks?id=' + id)
  }
  // 发布成绩
  releaseResults = () => {
    let data = {
      isEnd: 1,
      id: this.state.params.id
    }
    updataExamination(data).then(res => {
      if (res.errno === 0) {
        this.goBack()
      } 
    })
  }
  // 打开或关闭弹窗
  openOrCloseModal = (name, flag) => {
    this.setState({
      [name]: flag
    })
  }
   // 返回上一页
   goBack = () => {
    history.goBack(); 
  }
}

export default TestPaperCorrection