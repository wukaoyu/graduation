import React from 'react'
import {  deleteExamination} from 'api/teacher/examination'
import { queryExamintionPage, queryAllTestPaper } from 'api/admin/examination'
import { queryAllClass } from 'api/admin/classes'
import { queryAllCourse } from 'api/admin/course'
import { Pagination, Card, Button, Input, Select, Popover, message } from 'antd'
import { nowDate }  from 'util/main'
import QueueAnim from 'rc-queue-anim';
import './index.less'

const { Search } = Input
const { Option } = Select

class ExaminationMain extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      examList: [],
      courseList:[],
      classList:[],
      testPaperList:[],
      pageData:{
        pageSize:10,// 每页条数
        current: 1,// 当前页数
        total: 0,// 数据总数
      },
      searchData: {},
      examinationData: {},
      editorExaminationModel: false
    }
  }

  componentDidMount() {
    this.funQueryExamintionPage()
    this.funQueryCoursePage()
    this.funQueryAllTeacherTestPaper()
    this.funQueryAllTeacherClass()
  }

  render() {
    const nowTime = nowDate()
    const paginationProps = {
      showSizeChanger: true,
      showQuickJumper: false,
      showTotal: () => `共${this.state.pageData.total}条`,
      onShowSizeChange: (current,pageSize) => this.changePageSize(pageSize,current),
      onChange: (current) => this.changePage(current),
      ...this.state.pageData
    };
    return (
      <div>
        <div style={{minHeight:'calc(100vh - 160px)'}}>
          <div className='search'>
            <Search
              className='search-item'
              placeholder="搜索考试名称"
              onChange={e => this.changeValSearch(e)}
              onSearch={value => this.searchExam(value)}
              style={{ width: 200 }}
            />
            <div className='search-item'>
              <div>班级：</div>
              <Select
              showSearch
              allowClear
              onChange={value => this.changeClass(value)}
              filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 150 }}>
                {
                  this.state.classList.map((item, index) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.className}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className='search-item'>
              <div>课程：</div>
              <Select
              showSearch
              allowClear
              onChange={value => this.changeCourse(value)}
              filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 150 }}>
                {
                  this.state.courseList.map((item, index) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className='search-item'>
              <div>试卷：</div>
              <Select
              showSearch
              allowClear
              onChange={(value) => this.changeTestPaper(value)}
              filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 150 }}>
                {
                  this.state.testPaperList.map((item, index) => {
                    return (
                      <Option key={item.id} value={item.id}>{item.name}</Option>
                    )
                  })
                }
              </Select>
            </div>
            <div className='search-item'>
              <div>状态：</div>
              <Select
              showSearch
              allowClear
              onChange={value => this.changeisEnd(value)}
              style={{ width: 150 }}>
                <Option key={0} value={0}>未结束</Option>
                <Option key={1} value={1}>已结束</Option>
              </Select>
            </div>
          </div>
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
                            {item.testName}
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
                      <div className='exam-card-list'>
                        <div className='exam-card-list-handle'>
                          <div className='exam-card-list-inform-label'>
                            操作：
                          </div>
                          <div>
                            {
                              item.isEnd ? 
                              <Button size='small' className='exam-card-list-handle-result'>查看结果</Button> :
                              nowTime < item.startTime ? 
                              <div>
                                <Popover placement="top" trigger='click' content = {
                                    <div>
                                        <p>删除后数据将无法复原<br/>确认删除该考试记录吗？</p>
                                        <div className='teacher-delete-btn'>
                                            <Button type="danger" size={'small'} onClick={() => this.funDeleteExamination(item.id)}>确认</Button>
                                        </div>
                                    </div>
                                  }>            
                                  <Button size='small' className='exam-card-list-handle-delete'>删除</Button>
                                </Popover>
                              </div> : 
                              nowTime > item.maxEndTime ?
                              <div>试卷批改中...</div> : 
                              <div>考试进行中，无法操作...</div>
                            }
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
        <div className='bottom'>  
          <Pagination {...paginationProps}></Pagination>
        </div>
      </div>
    )
  }
  // 查询考试计划分页信息
  funQueryExamintionPage = () => {
    let data = {
      ...this.state.searchData,
      ...this.state.pageData
    }
    queryExamintionPage(data).then(res => {
      if (res.errno === 0) {
        let newPageData = Object.assign(this.state.pageData, {total: res.data.count})
        res.data.row.forEach(item => {
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
        })
        this.setState({
          examList: res.data.row,
          pageData: newPageData
        })
      }
    })
  }
  // 查询全部课程
  funQueryCoursePage = () => {
    queryAllCourse().then(res => {
      if (res.errno === 0) {
        this.setState({
          courseList: res.data,
        })
      }
    })
  }
  // 查询全部试卷
  funQueryAllTeacherTestPaper = () => {
    queryAllTestPaper().then(res => {
      if (res.errno === 0) {
        this.setState({
          testPaperList: res.data,
        })
      }
    })
  }
  // 查询全部班级
  funQueryAllTeacherClass = () => {
    queryAllClass().then(res => {
      if (res.errno === 0) {
        this.setState({
          classList: res.data,
        })
      }
    })
  }
  // 删除考试计划
  funDeleteExamination = id => {
    deleteExamination({id}).then(res => {
      if (res.errno === 0) {
        this.funQueryExamintionPage()
        message.success('删除成功')
      }
    })
  }
  conver = (s) => {
    return s < 10 ? '0' + s : s;
  }
  // 试卷名查询
  searchExam = value => {
    this.setState({
      searchData: {
        ...this.state.searchData,
        name: value
      }
    },() => {
      this.funQueryExamintionPage()
    })
  }
  // 搜索框清空时查询全部
  changeValSearch = e => {
    if (e.target.value === '') {
      this.setState({
        searchData: {
          ...this.state.searchData,
          name: ''
        }
      },() => {
        this.funQueryExamintionPage()
      })
    }
  }
  // 班级查询
  changeClass = val => {
    this.setState({
      searchData: {
        ...this.state.searchData,
        classId: val
      }
    },() => {
      this.funQueryExamintionPage()
    })
  }
  // 课程查询
  changeCourse = val => {
    this.setState({
      searchData: {
        ...this.state.searchData,
        courseId: val
      }
    },() => {
      this.funQueryExamintionPage()
    })
  }
  // 课程查询
  changeTestPaper = val => {
    this.setState({
      searchData: {
        ...this.state.searchData,
        testPaperId: val
      }
    },() => {
      this.funQueryExamintionPage()
    })
  }
  // 状态查询
  changeisEnd = val => {
    this.setState({
      searchData: {
        ...this.state.searchData,
        isEnd: val
      }
    },() => {
      this.funQueryExamintionPage()
    })
  }
  /**
   * 改变每页显示条数
   * @param {*} pageSize 选择的每页显示条数
   * @param {*} current 当前第几页
   */
  changePageSize = (pageSize,current) => {
    let newPageData = Object.assign(this.state.pageData, {pageSize, current})
    this.setState({
        pageData: newPageData
    },() => {
        this.funQueryExamintionPage()
    })
  }
  /**
   * 改变当前第几页
   * @param {*} current 当前页数
   */
  changePage = (current) => {
      let newPageData = Object.assign(this.state.pageData, {current})
      this.setState({
          pageData: newPageData
      },() => {
          this.funQueryExamintionPage()
      })
  }
  /**
   * @param {*} name 弹窗名
   * @param {*} flag 是否打开
   */
  handOpenOrCloseModel = (name, flag) => {
    this.setState({
      [name]: flag
    })
  }
  // 打开编辑考试计划弹窗
  openEditroModel = (item) => {
    item.startTimeDate = item.startTime.split(' ')[0]
    item.startTimeHour = item.startTime.split(' ')[1]
    item.endTimeDate = item.endTime.split(' ')[0]
    item.endTimeHour = item.endTime.split(' ')[1]
    console.log(item)
    this.setState({
      examinationData: item
    },() => {
      this.handOpenOrCloseModel('editorExaminationModel', true)
    })
  }
  toAddExamination = () => {
    this.props.history.push('/teacher/class/courseClass')
  }
}

export default ExaminationMain