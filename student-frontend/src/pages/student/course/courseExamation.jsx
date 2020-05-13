import React from 'react'
import { quertCourseExam } from 'api/course'
import { Card, Button } from 'antd'
import { nowDate }  from 'util/main'
import QueueAnim from 'rc-queue-anim';

const createHistory = require("history").createHashHistory
const history = createHistory()

class courseExamation extends React.Component {
  constructor (props) {
    super(props)
    let paramData = {}, searchArray = this.props.location.search.substr(1).split('&')
    searchArray.forEach(item => {
    let newArray = item.split('=')
        paramData[newArray[0]] = parseInt(newArray[1])
    })
    this.state = {
      params: paramData,
      examList: []
    }
  }
  componentDidMount() {
    this.funQuertCourseExam()
  }
  render() {
    const nowTime = nowDate()
    return (
      <div>
        <Button onClick={() => this.goBack()} style={{marginBottom: '10px'}}>返回</Button>
        <QueueAnim
          duration={600}
          animConfig={[
            { opacity: [1, 0], translateX: [0, 100] }
          ]}>
          {
            this.state.examList.map((item, index) => {
              return (
                <div key={item.id}>
                  <Card style={{ marginBottom: 16 }} title={item.name}>
                    <div className='exam-card-list'>
                      <div className='exam-card-list-inform'>
                        <div className='exam-card-list-inform-label'>
                          班级：
                        </div>
                        <div className='exam-card-list-inform-item'>
                          {item.className}
                        </div>
                      </div>
                      <div className='exam-card-list-inform'>
                        <div className='exam-card-list-inform-label'>
                          课程：
                        </div>
                        <div className='exam-card-list-inform-item'>
                          {item.courseName}
                        </div>
                      </div>
                      <div className='exam-card-list-inform'>
                        <div className='exam-card-list-inform-label'>
                          试卷：
                        </div>
                        <div className='exam-card-list-inform-item'>
                          {item.testPaperName}
                        </div>
                      </div>
                      <div className='exam-card-list-inform'>
                        <div className='exam-card-list-inform-label'>
                          考试时长：
                        </div>
                        <div className='exam-card-list-inform-item'>
                          {item.testTime}分钟
                        </div>
                      </div>
                    </div>
                    <div className='exam-card-list'>
                      <div className='exam-card-list-enterTime'>
                        <div className='exam-card-list-inform-label'>
                          允许进入考试时间：
                        </div>
                        <div className='exam-card-list-inform-item'>
                          {item.startTime} ～ {item.endTime}
                        </div>
                      </div>
                    </div>
                    {
                      nowTime > item.startTime ? 
                      <div className='exam-card-list'>
                        <div className='exam-card-list-handle'>
                          <div className='exam-card-list-inform-label'>
                            操作：
                          </div>
                          <div>
                            {
                              item.isEnd ? 
                              <Button size='small' className='exam-card-list-handle-result' onClick={() => this.toResult(item.id)}>查看结果</Button> :
                              nowTime > item.maxEndTime ?
                              <div>试卷批改中，请等待...</div> : 
                              <Button size='small' className='exam-card-list-handle-correction' onClick={() => this.toExamination(item)}>开始考试</Button>
                            }
                          </div>
                        </div>
                      </div> : ''
                    }
                  </Card>
                </div>
              )
            })
          } 
        </QueueAnim>
      </div>
    )
  }

  funQuertCourseExam = () => {
    quertCourseExam({courseId: this.state.params.id}).then(res => {
      if (res.errno === 0) {
        res.data.forEach(item => {
          let thisTime = item.endTime;
          thisTime = thisTime.replace(/-/g, '/');
          let time = new Date(thisTime);
          time = new Date(time.getTime() + item.testTime * 60 * 1000);
          //获取当前年
          let year = time.getFullYear();
          //获取当前月
          let month = time.getMonth() + 1;
          //获取当前日
          let date = time.getDate();
          let h = time.getHours(); //获取当前小时数(0-23)
          let m = time.getMinutes(); //获取当前分钟数(0-59)
          let s = time.getSeconds();
          item.maxEndTime = year + '-' + this.conver(month) + "-" + this.conver(date) + " " + this.conver(h) + ':' + this.conver(m) + ":" + this.conver(s);
          console.log(item.maxEndTime)
        })
        this.setState({
          examList: res.data
        })
      }
    })
  }

  conver = (s) => {
    return s < 10 ? '0' + s : s;
  }
  toExamination = (item) => {
    this.props.history.push('/examination/main?id=' + item.id)
  }
  toResult = (id) => {
    this.props.history.push('/student/course/testPapergetMarks?id=' + id)
  }
  // 返回上一页
  goBack = () => {
    history.goBack(); 
  }
}

export default courseExamation