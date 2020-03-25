import React from 'react'
import { Select, Button, Card, Modal, Popover, message } from "antd";
import QueueAnim from 'rc-queue-anim';
import { queryTCCrelationPage, insertTCCrelation, deleteTCCrelation, updataTCCrelation } from 'api/admin/classes';
import { queryAllTeacher } from "api/admin/account";
import { queryAllCourse } from "api/admin/course";
import CreateForm from 'components/formComponent/index.jsx'
import '../index.less'

const createHistory = require("history").createHashHistory
const { Option } = Select;
const history = createHistory()

class ClassesEditorCourse extends React.Component{
  constructor(props) {
    super(props)
    const { params } = this.props
    this.state = {
      courseList:[],
      params,
      searchData: {},
      teacherList: [],
      allCourseList: [],
      addCourseModel: false
    }
  }
  componentDidMount() {
    this.funQueryTCCrelationPage()
    this.funQueyAllTeacher()
    this.funQueryAllCourse()
  }

  render() {
    return (
      <div>
        <div className='classCourseSearch'>
          <div className='classCourseSearch-item'>
            <div className='classCourseSearch-item-label'>
              教师：
            </div>
            <Select
              showSearch
              allowClear
              onChange={(val) => this.changeSearchData(val, 'teacherId')}
              filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 150 }}>
                  {
                      this.state.teacherList.map(item => {
                        return <Option key={item.id} value={item.id}>{item.username}</Option>
                      })
                  }
              </Select>
          </div>
          <div className='classCourseSearch-item'>
            <div className='classCourseSearch-item-label'>
              课程：
            </div>
            <Select 
            style={{ width: 150 }}
            showSearch
            allowClear
            onChange={(val) => this.changeSearchData(val, 'curriculumId')}
            filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
              {
                this.state.allCourseList.map(item => {
                  return <Option key={item.id} value={item.id}>{item.name}</Option>
                })
              }
            </Select>
          </div>
          <div className='classCourseSearch-item'>
            <Button type='primary' onClick={() => this.handOpenOrCloseModel('addCourseModel', true)}>添加课程</Button>
            <Button style={{marginLeft: '10px'}} onClick={() => this.goBack()}>返回</Button>
          </div>
        </div>
        <QueueAnim style={{ display: 'flex', flexWrap: 'wrap' }}
        duration={600}
        animConfig={[
          { opacity: [1, 0], translateX: [0, 100] }
        ]}>
          {
            this.state.courseList.map((item, index) => {
              return (
                <div key={item.id}>
                  <Card style={{ width: 230, marginTop: 16, marginRight: 16 }} hoverable >
                    <div className='ttc'>
                      <div className='ttcName'>
                        {item.courseName}
                      </div>
                    </div>
                    <div className='ttc-teacher'>
                      教师：
                      <Select
                      showSearch
                      onChange={(val) => this.funUpdataTTC(val, item.id)}
                      defaultValue={item.teacherId}
                      filterOption={(input, option) =>
                          option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      style={{ width: 135 }}>
                          {
                              this.state.teacherList.map(teacherItem => {
                                return <Option key={teacherItem.id} value={teacherItem.id}>{teacherItem.username}</Option>
                              })
                          }
                      </Select>
                    </div>
                    <div className='ttc-handle'>
                      <div>
                        操作：
                      </div>
                      <div>
                        <Button size='small' className='ttc-handle-btn'>考试安排</Button>
                        <Popover placement="top" trigger='click' content = {
                            <div>
                                <p>确认删除该班级的次课程吗？</p>
                                <div className='teacher-delete-btn'>
                                    <Button type="danger" size={'small'} onClick={() => this.funDeleteClassCourse(item.id)}>确认</Button>
                                </div>
                            </div>
                        }>
                          <Button size='small' className='ttc-handle-btn'>删除课程</Button>
                        </Popover>
                      </div>
                    </div>
                  </Card>
                </div>
              )
            })
          }
        </QueueAnim>
        <Modal
        visible={this.state.addCourseModel}
        onCancel={() =>this.handOpenOrCloseModel('addCourseModel', false)}
        footer={''}>
          {
            this.state.addCourseModel ? <CreateForm
            onRef={this.getCreateForm}
            clickCancel={() => this.handOpenOrCloseModel('addCourseModel', false)}
            clickOk={(val) => this.addClassCourse(val)}
            fromList={[
              {
                formItemProp:{
                  label: '课程'
                },
                name: 'curriculumId',
                rules:[
                  {
                      required: true,
                      message: '请选择课程',
                  }
                ],
                component: 
                  <Select 
                  style={{ width: 150 }}
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }>
                    {
                      this.state.allCourseList.map(item => {
                        return <Option key={item.id} value={item.id}>{item.name}</Option>
                      })
                    }
                  </Select>
              },
              {
                formItemProp:{
                  label: '教师'
                },
                name: 'teacherId',
                rules:[
                  {
                      required: true,
                      message: '请选择教师',
                  }
                ],
                component: 
                  <Select 
                  style={{ width: 150 }}
                  showSearch
                  allowClear
                  filterOption={(input, option) =>
                      option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }>
                    {
                      this.state.teacherList.map(item => {
                        return <Option key={item.id} value={item.id}>{item.username}</Option>
                      })
                    }
                  </Select>
              }
            ]}/> : ''
          }
        </Modal>
      </div>
    )
  }

  funQueryTCCrelationPage = () => {
    let data = Object.assign({classId: this.state.params.id}, this.state.searchData)
    queryTCCrelationPage(data).then(res => {
      if (res.errno === 0) {
        this.setState({
          courseList: res.data.row
        })
      }
    })
  }
  // 查询所有教师
  funQueyAllTeacher = () => {
    queryAllTeacher().then(res => {
      if (res.errno === 0) {
        this.setState({
          teacherList: res.data
        })
      }
    })
  }
  // 查询所有课程
  funQueryAllCourse = () => {
    queryAllCourse().then(res => {
      if (res.errno === 0) {
        this.setState({
          allCourseList: res.data
        })
      }
    })
  }
  // 删除课程安排
  funDeleteClassCourse = (id) => {
    deleteTCCrelation({id}).then(res => {
      if (res.errno === 0) {
        message.success('删除成功')
        this.funQueryTCCrelationPage()
      }
    })
  }
  // 修改课程安排
  funUpdataTTC = (val, id) => {
    let data = {
      teacherId: val,
      id
    }
    updataTCCrelation(data).then(res => {
      if (res.errno === 0) {
        message.success('修改成功')
      }
    })
  }
  // 增加课程安排
  addClassCourse = (val) => {
    let data = Object.assign({classId: this.state.params.id}, val)
    insertTCCrelation(data).then(res => {
      if (res.errno === 0) {
        message.success('添加成功')
        this.funQueryTCCrelationPage()
      }
      this.handOpenOrCloseModel('addCourseModel', false)
    })
  }

  /**
   * @param {String} 指定弹窗名称
   * @param {Boolean} 打开或关闭
   */
  handOpenOrCloseModel = (name, flag) => {
    this.setState({
      [name]: flag
    })
  }

  // 修改搜索条件
  changeSearchData = (val, key) => {
    let data = this.state.searchData
    data[key] = val
    this.funQueryTCCrelationPage()
  }

  // 返回到班级首页
  goBack = () => {
    history.goBack(); 
  }
}

export default ClassesEditorCourse