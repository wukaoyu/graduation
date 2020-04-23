import React from 'react'
import { queryStudentCourse } from 'api/course'
import { Card, Button } from 'antd' 
import QueueAnim from 'rc-queue-anim';
import './index.less'

class courseMain extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      courseList: []
    }
  }

  componentDidMount() {
    this.funQueryStudentCourse()
  }

  render () {
    return (
      <div>
        <QueueAnim
          style={{ display: 'flex', flexWrap: 'wrap' }}
          duration={600}
          animConfig={[
            { opacity: [1, 0], translateX: [0, 100] }
          ]}>
            {
              this.state.courseList.map((item, index) => {
                return (
                  <div key={item.id}>
                    <Card style={{ width: 280, marginTop: 16, marginRight: 16 }} hoverable 
                      cover={
                        <div style={{height:'200px', overflow:'hidden'}}>
                          <img style={{width: '100%', minHeight:'200px'}} alt="example" src={item.coverImage || "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"} />
                        </div>
                      }
                      title={item.name}>
                        <div className='courseCount'>
                          <Button size='small' className='courseCount-handle-btn' onClick={() => this.toExamtion(item)}>考试安排</Button>
                          <Button size='small' className='courseCount-handle-btn' onClick={() => this.toPractice(item)}>开始练习</Button>
                        </div>
                        <div className='courseIntroduce'>
                          {item.introduce}
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
  // 查询学生所上课程
  funQueryStudentCourse = () => {
    queryStudentCourse().then(res => {
      if (res.errno === 0) {
        this.setState({
          courseList: res.data
        })
      }
    })
  }
  // 跳转到练习页面
  toPractice = (item) => {
    this.props.history.push('/student/course/practice?id='+ item.id)
  }
  // 跳转到考试计划页
  toExamtion = (item) => {
    this.props.history.push('/student/course/courseExamation?id='+ item.id)
  }
}

export default courseMain