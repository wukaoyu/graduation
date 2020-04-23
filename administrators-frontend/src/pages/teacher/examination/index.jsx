import React from 'react'
import { 
  queryPersonalExaminationPage, 
  queryAllTeacherClass, 
  queryAllTeacherTestPaper,
  deleteExamination,
  updataExamination } from 'api/teacher/examination'
import { queryCoursePage } from 'api/teacher/course'
import { Pagination, Card, Button, Input, Select, Popover, message, Modal, InputNumber, DatePicker, TimePicker } from 'antd'
import { nowDate }  from 'util/main'
import QueueAnim from 'rc-queue-anim';
import CreateForm from 'components/formComponent/index.jsx'
import moment from 'moment';
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
    this.funQueryPersonalExaminationPage()
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
              <Button type='primary' onClick={() => this.toAddExamination()}>添加考试计划</Button>
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
                                <Button size='small' className='exam-card-list-handle-editor' onClick={() => this.openEditroModel(item)}>编辑</Button>
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
                              <Button size='small' className='exam-card-list-handle-correction' onClick={() => this.toCorrection(item.id)}>试卷批改</Button> : 
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
        <Modal
        visible={this.state.editorExaminationModel}
        onCancel={() =>this.handOpenOrCloseModel('editorExaminationModel', false)}
        footer={''}>
          {
            this.state.editorExaminationModel ? <CreateForm
            clickCancel={() => this.handOpenOrCloseModel('editorExaminationModel', false)}
            clickOk={(val) => this.funUpdataExamination(val)}
            fromList={[
              {
                formItemProp:{
                  label: '考试名称'
                },
                initialValue: this.state.examinationData.name || '',
                name: 'name',
                rules:[
                  {
                      required: true,
                      message: '请输入考试名称',
                  }
                ]
              },
              {
                formItemProp:{
                  label: '试卷'
                },
                initialValue: this.state.examinationData.testPaper || '',
                name: 'testPaper',
                rules:[
                  {
                      required: true,
                      message: '请选择试卷',
                  }
                ],
                component: 
                <Select
                showSearch
                filterOption={(input, option) =>
                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                style={{ width: 200 }}>
                  {
                    this.state.testPaperList.map((item, index) => {
                      let comp = ''
                      if (item.curriculumId === this.state.examinationData.curriculumId) {
                        comp = <Option key={item.id} value={item.id}>{item.name}</Option>
                      }
                      return comp
                    })
                  }
                </Select>
              },
              {
                formItemProp:{
                  label: '考试时长'
                },
                initialValue: this.state.examinationData.testTime || '',
                name: 'testTime',
                rules:[
                  {
                      required: true,
                      message: '请输入考试时长',
                  }
                ],
                component: 
                  <div>
                    <InputNumber defaultValue={this.state.examinationData.testTime} style={{width: '80px', textAlign: 'center'}}/> 分钟
                  </div>
              },
              {
                formItemProp:{
                  label: '最早开始日期：'
                },
                initialValue: moment(this.state.examinationData.startTimeDate, 'YYYY-MM-DD')|| '',
                name: 'startTimeDate',
                rules:[
                  {
                      required: true,
                      message: '请选择时间',
                  }
                ],
                component: <DatePicker/>
              },
              {
                formItemProp:{
                  label: '最早开始时间：'
                },
                initialValue: moment(this.state.examinationData.startTimeHour, 'HH:mm:ss')|| '',
                name: 'startTimeHour',
                rules:[
                  {
                      required: true,
                      message: '请选择时间',
                  }
                ],
                component: <TimePicker/>
              },
              {
                formItemProp:{
                  label: '最晚开始日期：'
                },
                initialValue: moment(this.state.examinationData.endTimeDate, 'YYYY-MM-DD')|| '',
                name: 'endTimeDate',
                rules:[
                  {
                      required: true,
                      message: '请选择时间',
                  }
                ],
                component: <DatePicker/>
              },
              {
                formItemProp:{
                  label: '最晚开始时间：'
                },
                initialValue: moment(this.state.examinationData.endTimeHour, 'HH:mm:ss')|| '',
                name: 'endTimeHour',
                rules:[
                  {
                      required: true,
                      message: '请选择时间',
                  }
                ],
                component: <TimePicker/>
              }
            ]}/> : ''
          }
        </Modal>
        <div className='bottom'>  
          <Pagination {...paginationProps}></Pagination>
        </div>
      </div>
    )
  }
  // 查询考试计划分页信息
  funQueryPersonalExaminationPage = () => {
    let data = {
      ...this.state.searchData,
      ...this.state.pageData
    }
    queryPersonalExaminationPage(data).then(res => {
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
  // 查询教师管理的全部课程
  funQueryCoursePage = () => {
    queryCoursePage().then(res => {
      if (res.errno === 0) {
        this.setState({
          courseList: res.data.row,
        })
      }
    })
  }
  // 查询教师管理的全部试卷
  funQueryAllTeacherTestPaper = () => {
    queryAllTeacherTestPaper().then(res => {
      if (res.errno === 0) {
        this.setState({
          testPaperList: res.data,
        })
      }
    })
  }
  // 查询教师管理的全部班级
  funQueryAllTeacherClass = () => {
    queryAllTeacherClass().then(res => {
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
        this.funQueryPersonalExaminationPage()
        message.success('删除成功')
      }
    })
  }
  // 修改考试计划
  funUpdataExamination = val => {
    let newData = Object.assign({id: this.state.examinationData.id}, val)
    if (val.startTimeDate > val.endTimeDate) {
      newData.endTime = val.startTimeDate.format('YYYY-MM-DD') + ' ' + val.startTimeHour.format('HH:mm:ss')
      newData.startTime = val.endTimeDate.format('YYYY-MM-DD') + ' ' + val.endTimeHour.format('HH:mm:ss')
    }else {
      newData.startTime = val.startTimeDate.format('YYYY-MM-DD') + ' ' + val.startTimeHour.format('HH:mm:ss')
      newData.endTime = val.endTimeDate.format('YYYY-MM-DD') + ' ' + val.endTimeHour.format('HH:mm:ss')
    }
    delete newData.startTimeDate
    delete newData.startTimeHour
    delete newData.endTimeDate
    delete newData.endTimeHour
    updataExamination(newData).then(res => {
      if (res.errno === 0) {
        message.success('修改成功')
        this.funQueryPersonalExaminationPage()
        this.handOpenOrCloseModel('editorExaminationModel', false)
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
      this.funQueryPersonalExaminationPage()
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
        this.funQueryPersonalExaminationPage()
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
      this.funQueryPersonalExaminationPage()
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
      this.funQueryPersonalExaminationPage()
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
      this.funQueryPersonalExaminationPage()
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
        this.funQueryPersonalExaminationPage()
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
          this.funQueryPersonalExaminationPage()
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
  toCorrection = (id) => {
    this.props.history.push('/teacher/examinationRecord/correction?id=' + id)
  }
}

export default ExaminationMain