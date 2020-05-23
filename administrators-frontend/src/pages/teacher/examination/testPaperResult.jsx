import React from 'react'
import { queryEndExaminationResult } from 'api/teacher/examination'
import QueueAnim from 'rc-queue-anim';
import { Card, Button } from "antd";

const createHistory = require("history").createHashHistory

const history = createHistory()
class TestPapeResult extends React.Component {
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
      releaseVisible: false,
      baseUrl: window.baseUrl
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
          <Button style={{marginLeft: '10px', height: '30px'}} onClick={() => this.goBack()}>返回</Button>
        </div>
        <QueueAnim
          duration={600}
          animConfig={[
            { opacity: [1, 0], translateX: [0, 100] }
          ]}>
            {
              this.state.studentList.map((item, index) => {
                return (
                  <div key={item.id}>
                    <Card style={{ marginTop: 16}} hoverable 
                      title={item.username}
                      extra={
                      item.isStart ? 
                      <Button className='exam-card-list-handle-correction' size='small' onClick={() => this.toGetMarks(item.id)}>查看试卷</Button> :
                      <Button size='small' style={{fontSize: '12px'}} disabled={true} onClick={() => this.toGetMarks(item.id)}>未作答</Button>
                      }>
                        <div className="studentMain">
                          <div className='studentResult-headList'>
                            <img className='studentMain-head-img' src={item.headPortraitUrl || `${this.state.baseUrl}/public/image/headPortraitUrl.png`} alt="head"/>
                          </div>
                          <div className='studentResult-sort'>
                            <div className='studentResult-list-key'>排名：</div>
                            <div className='studentResult-describe-val'>{index + 1}</div>
                          </div>
                          <div className='studentResult-list'>
                            <div className='studentResult-list-key'>开始时间：</div>
                            <div className='studentResult-describe-val'>{item.startTime || '未参与'}</div>
                          </div>
                          <div className='studentResult-list'>
                            <div className='studentResult-list-key'>提交时间：</div>
                            <div className='studentResult-describe-val'>{item.endTime || '未提交'}</div>
                          </div>
                          <div className='studentResult-marks' style={{marginTop:'3px'}}>
                            <div className='studentResult-describe-key'>得分：</div>
                            <div className='paper-list-fullText' style={{backgroundColor: item.markColor}}>
                              {item.fullMarks || 0}
                            </div>
                          </div>
                        </div>
                      </Card>
                  </div>
                )
              })
            }
          </QueueAnim>
      </div>
    )
  }

  funQueryStudentResult = () => {
    let data = {
      id: this.state.params.id
    }
    queryEndExaminationResult(data).then(res => {
      if (res.errno === 0) {
        res.data.row.forEach(item => {
          if (item.id) {
            let marks = 0
            item.result = item.result.allResultArray ? item.result : {
              subjective: 0,
              allResultArray: []
            }
            item.result.allResultArray.forEach(resultItem => {
              marks += resultItem || 0
            })
            item.fullMarks = marks
            if (res.data.examData.fullMarks === marks) {
              item.markColor = '#48A9A6'
            }else if ((marks / res.data.examData.fullMarks) < 0.6) {
              item.markColor = '#F40000'
            }else {
              item.markColor = '#F58A07'
            }
            item.isStart = true
          }else {
            item.markColor = '#F40000'
            item.isStart = false
            item.fullMarks = 0
          }
        })
        let studentList = res.data.row.sort((a, b) => {
          return a.fullMarks - b.fullMarks
        }).reverse()
        this.setState({
          studentList,
          examData: res.data.examData
        })
      }
    })
  }

  toGetMarks = (id) => {
    if (window.userInfo.identity === 1) {
      this.props.history.push('/admin/examinationRecord/testPapergetMarks?id=' + id)
    }else if (window.userInfo.identity === 2) {
      this.props.history.push('/teacher/examinationRecord/testPapergetMarks?id=' + id)
    }
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

export default TestPapeResult