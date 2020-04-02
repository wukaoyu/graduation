import React from 'react'
import { Card ,Input, Button } from "antd";
import QueueAnim from 'rc-queue-anim';
import { queryCoursePage } from 'api/teacher/course';

const { Search } = Input;

class TeacherCourse extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      mainCourseList: [],
      hasMore: false,
      searchData: {}
    }
  }

  componentDidMount() {
    this.funQueryCoursePage()
  }
  render() {
    return (
      <div>
        <Search
          placeholder="搜索课程名"
          onChange={value => this.changeValSearch(value)}
          onSearch={value => this.searchClass(value)}
          style={{ width: 200 }}
        />
        <QueueAnim
          style={{ display: 'flex', flexWrap: 'wrap' }}
          duration={600}
          animConfig={[
            { opacity: [1, 0], translateX: [0, 100] }
          ]}>
            {
              this.state.mainCourseList.map((item) => {
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
                          <div className='courseCount-text'>
                            题目数量：{item.questionCount || 0}
                          </div>
                          <div className='courseCount-handle'>
                            <Button size='small' className='courseCount-handle-btn' onClick={() => this.toCourseInformaition(item.id)}>详细信息</Button>
                          </div>
                        </div>
                        <div>
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
  // 查看我的班级分页信息
  funQueryCoursePage = () => {
    queryCoursePage(this.state.searchData).then(res => {
      if (res.errno === 0) {
        let data = res.data.row
        this.setState({
          mainCourseList: data,
        })
      }
    })
  }
  // 根据名称搜索班级
  searchClass = (val) => {
    let data = {
      ...this.state.searchData,
      courseName: val
    }
    this.setState({
      searchData: data
    },() => {
      this.funQueryCoursePage()
    })
  }
  // 情况搜索条件时显示全部
  changeValSearch = e => {
    let val = e.target.value
    if (val === '') {
      this.setState({
        searchData: {
          ...this.state.searchData,
          courseName: ''
        }
      },() => {
        this.funQueryCoursePage()
      })
    }
  }
  // 跳转到课程信息页
  toCourseInformaition = id => {
    this.props.history.push('/teacher/course/courseInformation?id=' + id)
  }
}

export default TeacherCourse