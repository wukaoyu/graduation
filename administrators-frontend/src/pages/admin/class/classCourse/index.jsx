import React from 'react'
import { Select, Button, Table, Popover, Modal, message } from "antd";
import { queryTCCrelationPage, insertTCCrelation, deleteTCCrelation, updataTCCrelation, queryAllClass } from 'api/admin/classes';
import { queryAllTeacher } from "api/admin/account";
import { queryAllCourse } from "api/admin/course";
import CreateForm from 'components/formComponent/index.jsx'

const { Option } = Select
const { Column } = Table

class ClassCourse extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      allCourseList: [],
      teacherList: [],
      classList: [],
      searchData: {},
      classCourseData: [],
      pageData:{
        pageSize:10,// 每页条数
        current: 1,// 当前页数
        total: 0,// 数据总数
      },
      addOrEditorCourseModel: false,
      editorData: {}
    }
  }

  componentDidMount() {
    this.funQueryAllTeacher()
    this.funQueryAllCourse()
    this.funQueryAllClass()
    this.funQueryClassCoursePage()
  }

  render() {
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
            <div className='classCourseSearch-item-label'>
              班级：
            </div>
            <Select 
            style={{ width: 150 }}
            showSearch
            allowClear
            onChange={(val) => this.changeSearchData(val, 'classId')}
            filterOption={(input, option) =>
                option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }>
              {
                this.state.classList.map(item => {
                  return <Option key={item.id} value={item.id}>{item.className}</Option>
                })
              }
            </Select>
          </div>
          <div className='classCourseSearch-item'>
            <Button type='primary' onClick={() => this.getEditorData({})}>添加课程</Button>
          </div>
        </div>
        <Table style={{marginTop: '20px'}} dataSource={this.state.classCourseData} scroll={{ y: `calc(100vh - ${350}px)` }} rowKey={record => record.id} pagination={paginationProps}>
          <Column title="序号" dataIndex="index" key="index" align='center' width='150' render={(text,record,index) => (
              index+1
          )} />
          <Column title='班级' dataIndex='className' key='className' align='center' width='150'/>
          <Column title='课程' dataIndex='courseName' key='courseName' align='center' width='150'/>
          <Column title='教师' dataIndex='teacherName' key='teacherName' align='center'/>
          <Column title='操作' dataIndex='handle' key='handle' align='center' width='180px' render={(text,record,index) => (
              <div>
                  <Button style={{marginRight:'10px'}} onClick={ () => this.getEditorData(record)}>编辑</Button>
                  <Popover placement="topRight" trigger='click' content = {
                      <div>
                        <p>删除后将无法复原数据，<br/>确认删除吗？</p>
                        <div className='teacher-delete-btn'>
                          <Button type="danger" size={'small'} onClick={ () => this.handDeleteClassCourse(record.id)}>确认</Button>
                        </div>
                      </div>
                  }>
                    <Button type="danger">删除</Button>
                  </Popover>
              </div>
          )}/>
        </Table>
        <Modal
        visible={this.state.addOrEditorCourseModel}
        onCancel={() =>this.handOpenOrCloseModel('addOrEditorCourseModel', false)}
        footer={''}>
          {
            this.state.addOrEditorCourseModel ? <CreateForm
            onRef={this.getCreateForm}
            clickCancel={() => this.handOpenOrCloseModel('addOrEditorCourseModel', false)}
            clickOk={(val) => this.addOrClassCourse(val)}
            fromList={[
              {
                formItemProp:{
                  label: '课程'
                },
                name: 'curriculumId',
                initialValue: this.state.editorData.curriculumId || '',
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
                initialValue: this.state.editorData.teacherId || '',
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
              },
              {
                formItemProp:{
                  label: '班级'
                },
                name: 'classId',
                initialValue: this.state.editorData.classId || '',
                rules:[
                  {
                      required: true,
                      message: '请选择班级',
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
                      this.state.classList.map(item => {
                        return <Option key={item.id} value={item.id}>{item.className}</Option>
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
  // 查询所有教师
  funQueryAllTeacher = () => {
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
  // 查询所有班级
  funQueryAllClass = () => {
    queryAllClass().then(res => {
      if (res.errno === 0) {
        this.setState({
          classList: res.data
        })
      }
    })
  }
  // 查询课程安排分页信息
  funQueryClassCoursePage = () => {
    let data = Object.assign({}, this.state.pageData, this.state.searchData)
    queryTCCrelationPage(data).then(res => {
      if (res.errno === 0) {
        let newPageData = Object.assign(this.state.pageData, {total: res.data.count})
        this.setState({
          classCourseData: res.data.row,
          pageData: newPageData
        })
      }
    })
  }

  addOrClassCourse = (val) => {
    if (this.state.editorData.id) {
      let data = Object.assign({id: this.state.editorData.id}, val)
      updataTCCrelation(data).then(res => {
        if (res.errno === 0) {
          message.success('修改成功')
        }
      })
    }else {
      insertTCCrelation(val).then(res => {
        if (res.errno === 0) {
          message.success('添加成功')
          this.funQueryClassCoursePage()
        }
      })
    }
    this.handOpenOrCloseModel('addOrEditorCourseModel', false)
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
          this.funQueryClassCoursePage()
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
          this.funQueryClassCoursePage()
      })
  }

  // 修改搜索条件
  changeSearchData = (val, key) => {
    let data = this.state.searchData
    data[key] = val
    this.funQueryClassCoursePage()
  }

  // 删除课程安排
  handDeleteClassCourse = (id) => {
    deleteTCCrelation({id}).then(res => {
      if (res.errno === 0) {
        message.success('删除成功')
        this.funQueryClassCoursePage()
      }
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

  // 跳出编辑页面
  getEditorData = item => {
    this.setState({
      editorData: item,
      addOrEditorCourseModel: true
    })
  }
}

export default ClassCourse