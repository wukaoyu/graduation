import React from 'react';
import ScrollView from 'react-custom-scrollbars'
import QueueAnim from 'rc-queue-anim';
import { queryCoursePage, insertCoures, deleteCourse, updataCouerse } from 'api/admin/course'
import { Card, Input, Button, Modal, message, Popover } from 'antd' 
import CreateForm from 'components/formComponent/index.jsx'
import { DeleteOutlined, EditOutlined } from '@ant-design/icons'


import './index.less'

const { Search } = Input;
const { TextArea } = Input;

class Course extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchLoading: false,
      courseList: [],
      addOrEditorCourseModel: false,
      userInfo: window.userInfo,
      queryData: {
        name: '',
        pageSize: 30,
        current: 1
      },
      hasMore: false,
      isScroll: true,
      CreateForm: '',
      editorData: {}
    }
    this.funQueryCoursePage()
  }
  render() {
    return (
      <ScrollView onScroll={this.onScroll}>
        <div className='scrollBox'>
          <div className='queryName'>
            <Search 
            onChange={value => this.changeValSearch(value)}
            onSearch={value => this.searchClass(value)}
            className='queryName-search'
            placeholder="输入课程名称查询" 
            loading={this.state.searchLoading}/>
            <Button type='primary' className='queryName-insert' onClick={() => this.getEditorData({})}>添加课程</Button>
          </div>
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
                          <img style={{width: '100%', minHeight:'200px'}} alt="example" src={item.headPortraitUrl || "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"} />
                        </div>
                      }
                      title={item.name}
                      extra={<div style={{color: '#1DA57A'}} onClick={() => this.toEditor(item.id)}>查看题库</div>}
                      actions={[
                          <EditOutlined key="edit" onClick={() => this.getEditorData(item)} />,
                          <Popover placement="top" trigger='click' content = {
                            <div>
                                <p>删除后将无法复原数据，<br/>确认删除改班级吗？</p>
                                <div className='teacher-delete-btn'>
                                    <Button type="danger" size={'small'} onClick={() => this.deleteCourse(item.id)}>确认</Button>
                                </div>
                            </div>
                        }>
                            <DeleteOutlined/>
                        </Popover>
                      ]}>
                        <div className='courseCount'>
                          题目数量：{item.questionCount || 0}
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
        {
          this.state.hasMore ? <div style={{textAlign: 'center'}}>
            加载更多 
          </div> : ''
        }
        <Modal
        visible={this.state.addOrEditorCourseModel}
        onCancel={() =>this.handOpenOrCloseModel('addOrEditorCourseModel', false)}
        footer={''}>
          {
            this.state.addOrEditorCourseModel ? <CreateForm
            onRef={this.getCreateForm}
            clickCancel={() => this.handOpenOrCloseModel('addOrEditorCourseModel', false)}
            clickOk={(val) => this.addOrEditorClass(val)}
            fromList={[
              {
                formItemProp:{
                  label: '课程名称'
                },
                initialValue: this.state.editorData.name || null,
                name: 'name',
                rules:[
                  {
                      required: true,
                      message: '请输入课程名称',
                  }
                ]
              },
              {
                formItemProp:{
                  label: '课程简介'
                },
                initialValue: this.state.editorData.introduce || null,
                name: 'introduce',
                component: <TextArea style={{width:'200px'}} autoSize={{minRows: 2, maxRows: 6}} />
              }
            ]}/> : ''
          }
           
        </Modal>
      </ScrollView>
    )
  }
  
  //查询班级分页信息
  funQueryCoursePage = () => {
    queryCoursePage(this.state.queryData).then(res => {
      if (res.errno === 0) {
        let data = res.data.row
        this.setState({
          courseList: data,
          hasMore: res.data.hasmore,
          isScroll: true
        })
      }
    })
  }
  // 增加或修改课程
  addOrEditorClass = (val) => {
    // this.CreateForm.handleResetFields()
    let data = {
      name: val.name,
      introduce: val.introduce,
      createBy: this.state.userInfo.id
    }
    if (this.state.editorData.id) {
      data.id = this.state.editorData.id
      updataCouerse(data).then(res => {
        if (res.errno === 0) {
          this.handOpenOrCloseModel('addOrEditorCourseModel', false)
          message.success('修改成功');
          this.funQueryCoursePage()
        }
      })
    }else {
      insertCoures(data).then(res => {
        if (res.errno === 0) {
          this.handOpenOrCloseModel('addOrEditorCourseModel', false)
          message.success('添加成功');
          this.funQueryCoursePage()
        }
      })
    }
  }
  // 删除班级
  deleteCourse = (id) => {
    deleteCourse({id}).then(res => {
      if (res.errno === 0) {
        message.success('删除成功');
        this.funQueryCoursePage()
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
  /**
   * @param {String} 搜索的值
   */
  searchClass = (val) => {
    this.setState({
      queryData: {
        ...this.state.queryData,
        name: val
      }
    },() => {
      this.funQueryCoursePage()
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
          name: ''
        }
      },() => {
        this.funQueryCoursePage()
      })
    }
  }
  // 跳出编辑页面
  getEditorData = item => {
    this.setState({
      editorData: item,
      addOrEditorCourseModel: true
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
          this.funQueryCoursePage()
          clearTimeout(timeout)
        }, 500)
      })
    }
  }
  // 路由跳转
  toEditor = (id) => {
    this.props.history.push('/admin/class/classEditor?id=' + id)
  }
  getCreateForm = (CreateForm) => {
    this.setState({
      CreateForm
    })
  }
}

export default Course