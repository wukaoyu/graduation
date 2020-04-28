import React from 'react';
import ScrollView from 'react-custom-scrollbars'
import QueueAnim from 'rc-queue-anim';
import { queryStudentPage, insertStudent, deleteStudent, fileStudentAccount, upDataStudent } from 'api/admin/classes'
import { Card, Input, Button, Modal, Radio, Popover, Upload, Icon, message } from 'antd' 
import CreateForm from 'components/formComponent/index.jsx'

import './index.less'

const createHistory = require("history").createHashHistory
const { Search } = Input;
const { Dragger } = Upload;
const history = createHistory()

class ClassEditorStudent extends React.Component {
  constructor(props) {
    super(props)
    let params = {}, searchArray = this.props.location.search.substr(1).split('&')
    searchArray.forEach(item => {
    let newArray = item.split('=')
      params[newArray[0]] = parseInt(newArray[1])
    })
    this.state = {
      searchLoading: false,
      studentList: [],
      addStudentModel: false,
      teacherList: [],
      params,
      userInfo: window.userInfo,
      queryData: {
        username: '',
        pageSize: 30,
        current: 1,
        classId: params.id
      },
      hasMore: false,
      isScroll: true,
      CreateForm: '',
      fileVisible: false,
      fileList:[]
    }
    this.funQueryStudentPage()
  }
  render() {
    return (
      <ScrollView onScroll={this.onScroll} style={{minHeight:'calc(100vh - 180px)'}}>
        <div className='scrollBox'>
          <div className='studentQuery'>
            <Search 
            onChange={value => this.changeValSearch(value)}
            onSearch={value => this.searchStudent(value)}
            className='studentQueryName-search'
            placeholder="输入学生姓名查询" 
            loading={this.state.searchLoading}/>
            <Button type='primary' className='studentQueryName-insert' onClick={() => this.handOpenOrCloseModel('addStudentModel', true)}>增加学生</Button>
            <Button type='primary' className='studentQueryName-insert' onClick={() => this.handOpenOrCloseModel('fileVisible', true)}>批量导入</Button>
            <Button className='studentQueryName-insert' onClick={() => this.goBack()}>返回</Button>
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
                    <Card style={{ width: 280, marginTop: 16, marginRight: 16 }} hoverable 
                      title={item.username}
                      extra={
                        item.sex === 1 ? 
                        <img className='studentHeadImg' src="https://wkydegraduation.oss-cn-beijing.aliyuncs.com/image/man.png" alt="性别"/> : 
                        <img className='studentHeadImg' src="https://wkydegraduation.oss-cn-beijing.aliyuncs.com/image/woman.png" alt="性别"/> 
                      }>
                        <div className="studentMain">
                          <div className='studentMain-head'>
                            <img className='studentMain-head-img' src={item.headPortraitUrl || "http://wkydegraduation.oss-cn-beijing.aliyuncs.com/image/headPortraitUrl.png"} alt="head"/>
                          </div>
                          <div>
                            <div className='studentMain-describe'>
                              <div className='studentMain-describe-key'>账号：</div>
                              <div className='studentMain-describe-val'>{item.account}</div>
                            </div>
                          </div>
                        </div>
                        <div className='studentMain-operation'>
                          <div className='studentMain-operation-key'>操作：</div>
                          <div className='studentMain-operation-val'>
                            <Popover placement="top" trigger='click' content = {
                                <div>
                                    <p>确认退出该班级吗？</p>
                                    <div className='teacher-delete-btn'>
                                      <Button type="danger" size={'small'} onClick={() => this.funOutClass(item)}>确认</Button>
                                    </div>
                                </div>
                            }>
                              <Button size='small' className='studentMain-operation-val-btn'>退出班级</Button>
                            </Popover>
                            <Popover placement="top" trigger='click' content = {
                                <div>
                                    <p>删除该学生的一切数据将会删除，<br/>确认删除吗？</p>
                                    <div className='teacher-delete-btn'>
                                        <Button type="danger" size={'small'} onClick={() => this.funDeleteStudent(item.id)}>确认</Button>
                                    </div>
                                </div>
                            }>
                              <Button size='small' className='studentMain-operation-val-btn'>删除账号</Button>
                            </Popover>
                          </div>
                        </div>
                      </Card>
                  </div>
                )
              })
            }
          </QueueAnim>
        </div>
        {
          this.state.hasMore ? <div style={{textAlign: 'center'}}>
            加载更多 
          </div> : ''
        }
        <Modal
        visible={this.state.addStudentModel}
        onCancel={() =>this.handOpenOrCloseModel('addStudentModel', false)}
        footer={''}>
          {
            this.state.addStudentModel ? <CreateForm
            onRef={this.getCreateForm}
            clickCancel={() => this.handOpenOrCloseModel('addStudentModel', false)}
            clickOk={(val) => this.addStudent(val)}
            fromList={[
              {
                formItemProp:{
                  label: '学生账号'
                },
                name: 'account',
                rules:[
                  {
                      required: true,
                      message: '请输入班账号',
                  }
                ]
              },
              {
                formItemProp:{
                  label: '学生姓名'
                },
                name: 'username',
                rules:[
                  {
                      required: true,
                      message: '请输入学生姓名',
                  }
                ]
              },
              {
                formItemProp:{
                  label: '性别'
                },
                name: 'sex',
                rules:[
                  {
                      required: true,
                      message: '请选择性别',
                  }
                ],
                component: 
                <Radio.Group>
                  <Radio value={1}>男</Radio>
                  <Radio value={0}>女</Radio>
                </Radio.Group>
              }
            ]}/> : ''
          }
        </Modal>
        <Modal
          title={'批量导入'}
          visible={this.state.fileVisible}
          onCancel={() => this.handOpenOrCloseModel('fileVisible', false)}
          footer={
              <div>
                  <Button onClick={() => this.handOpenOrCloseModel('fileVisible', false)}>取消</Button>
                  <a href="https://wkydegraduation.oss-cn-beijing.aliyuncs.com/teacherAccount.xls" style={{margin: '0 8px'}}>
                      <Button type="primary" >下载模板</Button>
                  </a>
                  <Button type="primary" onClick={this.fileUpload}>上传文件</Button>
              </div>
          }>
            <Dragger
              accept='.xls,.xlsx'
              onChange={this.changeFile}
              fileList={this.state.fileList}
              beforeUpload={this.getFile}>
                  <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">单击或拖动Excel文件到此区域上传文件</p>
              </Dragger>
          </Modal>
      </ScrollView>
    )
  }
  
  //查询班级分页信息
  funQueryStudentPage = () => {
    queryStudentPage(this.state.queryData).then(res => {
      if (res.errno === 0) {
        this.setState({
          studentList: res.data.row,
          hasMore: res.data.hasmore,
          isScroll: true
        })
      }
    })
  }
  /**
   * @param {String} 搜索的值
   */
  searchStudent = (val) => {
    this.setState({
      queryData: {
        ...this.state.queryData,
        username: val
      }
    },() => {
      this.funQueryStudentPage()
    })
  }
  /**
   * 增加学生
   * @param {Object} 学生信息的form表单
   */
  addStudent = (val) => {
    const data = {
      ...val,
      password: '123456',
      createBy: this.state.userInfo.id,
      classId: this.state.params.id,
      createIdentity: 2
    }
    insertStudent(data).then(res => {
      if (res.errno === 0) {
        message.success('添加成功');
        this.funQueryStudentPage()
        this.handOpenOrCloseModel('addStudentModel', false)
      }else {
        message.error(res.data);
        this.state.CreateForm.handleResetFields()
      }
    })
  }
  /**
   * 删除学生账号
   * @param {Number} 学生id
   */
  funDeleteStudent = (id) => {
    deleteStudent({id}).then(res => {
      if (res.errno === 0) {
        message.success('删除成功');
        this.funQueryStudentPage()
      }else {
        message.error(res.data);
      }
    })
  }

  /**
   * 输入框清空的时候自动显示全部
   * @param {String} 输入框的值
   */
  changeValSearch = e => {
    let val = e.target.value
    if (val === '') {
      this.setState({
        queryData: {
          ...this.state.queryData,
          username: ''
        }
      },() => {
        this.funQueryStudentPage()
      })
    }
  }
  /**
   * 上传文件
   */
  fileUpload = () => {
    let formData = new FormData()
    formData.append('file', this.state.fileList[0])
    formData.append('createBy', this.state.userInfo.id)
    formData.append('createIdentity', 2)
    formData.append('classId',  this.state.params.id)
    fileStudentAccount(formData).then(res => {
        if (res.errno === 0) {
          this.funQueryStudentPage()
          this.setState({
              fileVisible: false,
              fileList: []
          })
          message.success(res.data)
        }else {
          message.warning(res.data)
        }
    })
  }
  /**
   * 退出班级
   */
  funOutClass = (param) => {
    const data = [{
      ...param,
      classId: 0
    }]
    
    upDataStudent({studentArray:data}).then(res => {
      if (res.errno === 0) {
        message.success('操作成功')
        this.funQueryStudentPage()
      }
    })
  }
  onScroll = e => {
    if (e.target.scrollTop + e.target.clientHeight === e.target.scrollHeight && this.state.hasMore && this.state.isScroll) {
      let beforePage = this.state.queryData.pageSize
      this.setState({
        queryData: {
          ...this.state.queryData,
          pageSize: beforePage + 30
        },
        isScroll: false
      },() => {
        let timeout = setTimeout(() => {
          this.funQueryStudentPage()
          clearTimeout(timeout)
        }, 500)
      })
    }
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
  /**
     * 文件赋值
     */
  getFile = (file) => {
    this.setState({
        fileList: [file]
    })
    return false
  }
  changeFile = (info) => {
    if (info.fileList.length === 0) {
      this.setState({
        fileList: info.fileList
      })
    }
  }
  getCreateForm = (CreateForm) => {
    this.setState({
      CreateForm
    })
  }
  // 返回到班级首页
  goBack = () => {
    history.goBack(); 
  }
}

export default ClassEditorStudent