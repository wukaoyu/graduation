import React from 'react'
import { 
  queryAllTeacherClass, 
  deleteExamination,
  updataExamination,
  queryAllTeacherTestPaper,
  insertExamination } from 'api/teacher/examination'
import { queryClassExamination, queryClassCourse } from 'api/teacher/classes'
import { Tabs, Card, Button, Popover, message, Modal, InputNumber, DatePicker, TimePicker, Select } from 'antd'
import { nowDate }  from 'util/main'
import CreateForm from 'components/formComponent/index.jsx'
import moment from 'moment';

const { TabPane } = Tabs;
const { Option } = Select

class TeacherCourseClass extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      classList: [],
      classId: '',
      examList: [],
      testPaperList: [],
      couseList: [],
      tabIndex: 0,
      userInfo:window.userInfo,
      editorExaminationModel: false,
      examinationData: {}
    }
  }

  componentDidMount() {
    this.funQueryAllTeacherClass()
    this.funQueryAllTeacherTestPaper()
  }
  render() {
    const nowTime = nowDate()
    return (
      <div>
        <Tabs defaultActiveKey="0" onChange={(val) => this.changeTab(val)}>
          { 
            this.state.classList.map((item, index) => {
              return (
                <TabPane tab={item.className} key={index}>
                  <Button type='primary' onClick={() => this.handOpenOrCloseModel('chooseCourse', true)}>添加考试计划</Button>
                  {
                    this.state.examList.map((item, index) => {
                      return (
                        <div key={item.id}>
                          <Card style={{ marginBottom: 16, marginTop: 16 }} title={item.name}>
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
                            {
                              this.state.userInfo.id !== item.createBy ? '' :
                              <div className='exam-card-list'>
                                <div className='exam-card-list-handle'>
                                  <div className='exam-card-list-inform-label'>
                                    操作：
                                  </div>
                                  <div>
                                    {
                                      nowTime < item.startTime ? 
                                      <div>
                                        <Button size='small' className='exam-card-list-handle-editor' onClick={() => this.openEditroModel(item)}>编辑</Button>
                                        <Popover placement="top" trigger='click' content = {
                                            <div>
                                                <p>确认从试卷中删除该题目吗？</p>
                                                <div className='teacher-delete-btn'>
                                                    <Button type="danger" size={'small'} onClick={() => this.funDeleteExamination(item.id)}>确认</Button>
                                                </div>
                                            </div>
                                          }>            
                                          <Button size='small' className='exam-card-list-handle-delete'>删除</Button>
                                        </Popover>
                                      </div> : 
                                      nowTime > item.maxEndTime ?
                                      <Button size='small' className='exam-card-list-handle-correction'>试卷批改</Button> : 
                                      <div>考试进行中，无法操作...</div>
                                    }
                                  </div>
                                </div>
                              </div>
                            }
                          </Card>
                        </div>
                      )
                    })
                  } 
                </TabPane>
              )
            })
          }
        </Tabs>
        <Modal
        visible={this.state.editorExaminationModel}
        onCancel={() =>this.handOpenOrCloseModel('editorExaminationModel', false)}
        footer={''}>
          {
            this.state.editorExaminationModel ? <CreateForm
            clickCancel={() => this.handOpenOrCloseModel('editorExaminationModel', false)}
            clickOk={(val) => this.funAddOrUpdataExamination(val)}
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
                initialValue: this.state.examinationData.startTimeDate ? moment(this.state.examinationData.startTimeDate, 'YYYY-MM-DD') : null,
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
                initialValue:this.state.examinationData.startTimeHour ? moment(this.state.examinationData.startTimeHour, 'HH:mm:ss') : null,
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
                initialValue:this.state.examinationData.endTimeDate ? moment(this.state.examinationData.endTimeDate, 'YYYY-MM-DD') : null,
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
                initialValue:this.state.examinationData.endTimeHour ? moment(this.state.examinationData.endTimeHour, 'HH:mm:ss') : null,
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
        <Modal
        visible={this.state.chooseCourse}
        onCancel={() =>this.handOpenOrCloseModel('chooseCourse', false)}
        footer={''}>
          {
            this.state.chooseCourse ? <CreateForm
            clickCancel={() => this.handOpenOrCloseModel('chooseCourse', false)}
            clickOk={(val) => this.selectTestPaper(val)}
            fromList={[
              {
                formItemProp:{
                  label: '课程'
                },
                name: 'courseId',
                rules:[
                  {
                      required: true,
                      message: '请选择课程',
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
                    this.state.couseList.map((item, index) => {
                      return <Option key={item.id} value={item.id}>{item.name}</Option>
                    })
                  }
                </Select>
              },
            ]}/> : ''
          }
        </Modal>
      </div>
    )
  }
  // 查询教师上课的所有班级
  funQueryAllTeacherClass = () => {
    queryAllTeacherClass().then(res => {
      if (res.errno === 0) {
        this.setState({
          classList: res.data,
          classId: res.data[0].id
        },() => {
          this.funQueryClassExamination()
          this.funQueryClassCourse()
        })
      }
    })
  }

  // 查询每个班级对应的所有考试安排
  funQueryClassExamination = () => {
    let data = {
      classId: this.state.classId
    }
    queryClassExamination(data).then(res => {
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
        })
        this.setState({
          examList: res.data
        })
      }
    })
  }
  // 查询教师不同班级所教的课程
  funQueryClassCourse = () => {
    let data = {
      classId: this.state.classId
    }
    queryClassCourse(data).then(res => {
      if (res.errno === 0) {
        this.setState({
          couseList: res.data
        })
      }
    })
  }
  conver = (s) => {
    return s < 10 ? '0' + s : s;
  }
  // 切换班级
  changeTab = val => {
    this.setState({
      classId: this.state.classList[val].id
    },() => {
      this.funQueryClassExamination()
      this.funQueryClassCourse()
    })
  }
  // 删除考试计划
  funDeleteExamination = id => {
    deleteExamination({id}).then(res => {
      if (res.errno === 0) {
        this.funQueryClassExamination()
        message.success('删除成功')
      }
    })
  }
  // 修改考试计划
  funAddOrUpdataExamination = val => {
    let newData = Object.assign({id: this.state.examinationData.id || ''}, val)
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
    if (this.state.examinationData.id) {
      updataExamination(newData).then(res => {
        if (res.errno === 0) {
          message.success('修改成功')
          this.funQueryClassExamination()
          this.handOpenOrCloseModel('editorExaminationModel', false)
        }
      })
    }else {
      delete newData.id
      newData.courseId = this.state.examinationData.curriculumId
      newData.classId = this.state.classId
      insertExamination(newData).then(res => {
        if (res.errno === 0) {
          message.success('添加成功')
          this.funQueryClassExamination()
          this.handOpenOrCloseModel('editorExaminationModel', false)
          this.handOpenOrCloseModel('chooseCourse', false)
        }
      })
    }
  }
  /**
   * @param {*} name 弹窗名
   * @param {*} flag 是否打开
   */
  handOpenOrCloseModel = (name, flag) => {
    this.setState({
      [name]: flag
    })
    if (!flag) {
      this.setState({
        examinationData: {}
      })
    }
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
  selectTestPaper = val => {
    this.setState({
      examinationData: {
        ...this.state.examinationData,
        curriculumId: val.courseId,
        ...val
      }
    },() => {
      this.handOpenOrCloseModel('editorExaminationModel', true)
    })
  }
}

export default TeacherCourseClass