import React from 'react';
import ScrollView from 'react-custom-scrollbars'
import QueueAnim from 'rc-queue-anim';
import { queryClassesPage, insertClasses, deleteClasses } from 'api/admin/classes'
import { queryAllTeacher } from 'api/admin/account'
import { Card, Input, Button, Modal, DatePicker, Select, message, Popover } from 'antd' 
import CreateForm from 'components/formComponent/index.jsx'
import { DeleteOutlined } from '@ant-design/icons'


import './index.less'

const { Search } = Input;
const { Option } = Select;

class ClassInformation extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      searchLoading: false,
      classList: [],
      addClassModel: false,
      teacherList: [],
      userInfo: window.userInfo,
      queryData: {
        className: '',
        pageSize: 30,
        current: 1
      },
      hasMore: false,
      isScroll: true,
      CreateForm: ''
    }
    this.funQueryClassesPage()
    this.funQueryAllTeacher()
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
            placeholder="输入班级名称查询" 
            loading={this.state.searchLoading}/>
            <Button type='primary' className='queryName-insert' onClick={() => this.handOpenOrCloseModel('addClassModel', true)}>增加班级</Button>
          </div>
          <QueueAnim
          style={{ display: 'flex', flexWrap: 'wrap' }}
          duration={600}
          animConfig={[
            { opacity: [1, 0], translateX: [0, 100] }
          ]}>
            {
              this.state.classList.map((item, index) => {
                return (
                  <div key={item.id}>
                    <Card style={{ width: 280, marginTop: 16, marginRight: 16 }} hoverable 
                      actions={[
                          <Popover placement="top" trigger='click' content = {
                            <div>
                                <p>删除后将无法复原数据，<br/>确认删除改班级吗？</p>
                                <div className='teacher-delete-btn'>
                                    <Button type="danger" size={'small'} onClick={() => this.deleteClasses(item.id)}>确认</Button>
                                </div>
                            </div>
                        }>
                            <DeleteOutlined />
                        </Popover>
                      ]}
                      title={item.className}
                      extra={<div style={{color: '#1DA57A'}} onClick={() => this.toEditor(item.id)}>详细信息</div>}>
                        <div className="classMain">
                          <div className='classMain-head'>
                            <img className='classMain-head-img' src={item.headPortraitUrl || "https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png"} alt="head"/>
                          </div>
                          <div>
                            <div className='classMain-describe'>
                              <div className='classMain-describe-key'>班主任：</div>
                              <div className='classMain-describe-val'>{item.teacherName || '暂无'}</div>
                            </div>
                            <div className='classMain-describe'>
                              <div className='classMain-describe-key'>班级人数：</div>
                              <div className='classMain-describe-val'>{item.studentCount || 0}</div>
                            </div>
                            <div className='classMain-describe'>
                              <div className='classMain-describe-key'>班级时间：</div> 
                              <div className='classMain-describe-val'>{item.timeText}</div> 
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
        {
          this.state.hasMore ? <div style={{textAlign: 'center'}}>
            加载更多 
          </div> : ''
        }
        <Modal
        visible={this.state.addClassModel}
        onCancel={() =>this.handOpenOrCloseModel('addClassModel', false)}
        footer={''}>
          <CreateForm
          onRef={this.getCreateForm}
          clickCancel={() => this.handOpenOrCloseModel('addClassModel', false)}
          clickOk={(val) => this.addClass(val)}
          fromList={[
            {
              formItemProp:{
                label: '班级名称'
              },
              name: 'className',
              rules:[
                {
                    required: true,
                    message: '请输入班级名称',
                }
              ]
            },
            {
              formItemProp:{
                label: '入学时间'
              },
              name: 'startTime',
              rules:[
                {
                    required: true,
                    message: '请选择入学时间',
                }
              ],
              component: <DatePicker style={{ width: 200 }}/>
            },
            {
              formItemProp:{
                label: '毕业时间'
              },
              name: 'graduationTime',
              rules:[
                {
                    required: true,
                    message: '请选择毕业时间',
                }
              ],
              component: <DatePicker style={{ width: 200 }}/>
            },
            {
              formItemProp:{
                label: '班主任'
              },
              name: 'mainTeacher',
              component: 
              <Select
              showSearch
              allowClear
              filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 200 }}>
                  {
                      this.state.teacherList.map(item => {
                          return <Option key={item.id} value={item.id}>{item.username}</Option>
                      })
                  }
              </Select>
            }
          ]}/> 
        </Modal>
      </ScrollView>
    )
  }
  
  //查询班级分页信息
  funQueryClassesPage = () => {
    queryClassesPage(this.state.queryData).then(res => {
      if (res.errno === 0) {
        let data = res.data.row
        for (let i = 0; i< data.length; i++) {
          data[i].timeText = data[i].startTime.split('-')[0] + '年~' + data[i].graduationTime.split('-')[0] + '年'
        }
        this.setState({
          classList: data,
          hasMore: res.data.hasmore,
          isScroll: true
        })
      }
    })
  }
  // 查询所有老师
  funQueryAllTeacher = () => {
    queryAllTeacher().then(res => {
      if (res.errno === 0) {
        this.setState({
          teacherList: res.data
        })
      }
    })
  }
  // 增加班级
  addClass = (val) => {
    // this.CreateForm.handleResetFields()
    let data = {
      className: val.className,
      mainTeacher: val.mainTeacher,
      startTime: val.startTime.format('YYYY-MM-DD'),
      graduationTime: val.graduationTime.format('YYYY-MM-DD'),
      createBy: this.state.userInfo.id
    }
    insertClasses(data).then(res => {
      if (res.errno === 0) {
        this.handOpenOrCloseModel('addClassModel', false)
        message.success('添加成功');
        this.funQueryClassesPage()
        this.state.CreateForm.handleResetFields()
      }
    })
  }
  // 删除班级
  deleteClasses = (id) => {
    deleteClasses({id}).then(res => {
      if (res.errno === 0) {
        message.success('删除成功');
        this.funQueryClassesPage()
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
        className: val
      }
    },() => {
      this.funQueryClassesPage()
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
          className: ''
        }
      },() => {
        this.funQueryClassesPage()
      })
    }
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
          this.funQueryClassesPage()
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

export default ClassInformation