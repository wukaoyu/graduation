import React from 'react'
import { queryTestPage, insertTestPaper, upDataTestPaper, deleteTestPaper } from 'api/teacher/course'
import { Pagination, Card, Button, Input, Modal, message, Popover } from 'antd'
import QueueAnim from 'rc-queue-anim';
import CreateForm from 'components/formComponent/index.jsx'
const createHistory = require("history").createHashHistory

const { Search } = Input
const history = createHistory()

class TestPaper extends React.Component {
  constructor (props) {
    super(props)
    let paramData = {}, searchArray = this.props.location.search.substr(1).split('&')
    searchArray.forEach(item => {
    let newArray = item.split('=')
        paramData[newArray[0]] = parseInt(newArray[1])
    })
    this.state = {
      params: paramData,
      testPaperDataList: [],
      searchData: {},
      pageData:{
        pageSize:10,// 每页条数
        current: 1,// 当前页数
        total: 0,// 数据总数
      },
      addOrEditorPaper: false,
      paperData: {},
    }
  }

  componentDidMount() {
    this.funQueryTestPage()
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
        <div style={{minHeight:'calc(100vh - 160px)'}}>
          <div className='search'>
            <Search
              className='search-item'
              placeholder="搜索试卷名称"
              onChange={value => this.changeValSearch(value)}
              onSearch={value => this.searchTestPaper(value)}
              style={{ width: 200 }}
            />
            <div className='search-item'>
              <Button type='primary' onClick={() =>this.handOpenOrCloseModel('addOrEditorPaper', true)}>添加试卷</Button>
              <Button onClick={() => this.goBack()} style={{marginLeft: '10px'}}>返回</Button>
            </div>
          </div>
          <QueueAnim
            style={{marginBottom:'20px', display: 'flex', flexWrap: 'wrap'}}
            duration={600}
            animConfig={[
              { opacity: [1, 0], translateX: [0, 100] }
            ]}>
              {
                this.state.testPaperDataList.map((item, index) => {
                  return (
                    <div key={item.id}>
                      <Card style={{ width: 280, marginTop: 16, marginRight: 16 }} hoverable title={item.name}>
                        <div className='paper-list'>
                          <div className='paper-list-child'>
                            <div className='paper-list-label'>
                              满分：
                            </div>
                            <div className='paper-list-fullText'>
                              {item.fullMarks}
                            </div>
                          </div>
                          <div className='paper-list-child'>
                            <div className='paper-list-label'>
                              创建者：
                            </div>
                            <div>
                              {item.createName}
                            </div>
                          </div>
                        </div>
                        <div className='paper-list'>
                          <div className='paper-list-label'>
                            创建时间：
                          </div>
                          <div>
                            {item.createTime}
                          </div>
                        </div>
                        <div>
                          <div className='paper-list-handle'>
                            <Button size='small' className='paper-list-handle-btn' onClick={() => this.toEditorTestPaperQuestion(item.id)}>编辑题目</Button>
                            <Button size='small' className='paper-list-handle-btn' onClick={() => this.editorPaper(item)}>编辑信息</Button>
                            <Popover placement="top" trigger='click' content = {
                                <div>
                                    <p>删除后将无法复原数据，<br/>确认删除该试卷吗？</p>
                                    <div className='teacher-delete-btn'>
                                        <Button type="danger" size={'small'} onClick={() => this.funDeleteTestPaper(item.id)}>确认</Button>
                                    </div>
                                </div>
                              }>            
                              <Button size='small' className='paper-list-handle-btn'>删除试卷</Button>
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
        <div className='bottom'>  
          <Pagination {...paginationProps}></Pagination>
        </div>
        <Modal
        visible={this.state.addOrEditorPaper}
        onCancel={() =>this.handOpenOrCloseModel('addOrEditorPaper', false)}
        footer={''}>
          {}
          {
            this.state.addOrEditorPaper ? <CreateForm
            clickCancel={() => this.handOpenOrCloseModel('addOrEditorPaper', false)}
            clickOk={(val) => this.addOrEditorPaper(val)}
            fromList={[
              {
                formItemProp:{
                  label: '试卷名称'
                },
                initialValue: this.state.paperData.name || '',
                name: 'name',
                rules:[
                  {
                      required: true,
                      message: '试卷名称',
                  }
                ]
              },
            ]}/> : ''
          }
        </Modal>
      </div>
    )
  }
  // 查询试卷分页信息
  funQueryTestPage = () => {
    let data = {
      curriculumId: this.state.params.id,
      ...this.state.searchData,
      ...this.state.pageData
    }
    queryTestPage(data).then(res => {
      if (res.errno === 0) {
        res.data.row.forEach(item => {
          item.rules = JSON.parse(item.rules)
        })
        let newPageData = Object.assign(this.state.pageData, {total: res.data.count})
        this.setState({
          testPaperDataList: res.data.row,
          pageData: newPageData
        })
      }
    })
  }

  // 查询试卷信息
  searchTestPaper = (val) => {
    let data = {
      ...this.state.searchData,
      name: val
    }
    this.setState({
      searchData: data
    },() => {
      this.funQueryTestPage()
    })
  }
  // 情况搜索条件时显示全部
  changeValSearch = e => {
    let val = e.target.value
    if (val === '') {
      this.setState({
        searchData: {
          ...this.state.searchData,
          name: ''
        }
      },() => {
        this.funQueryTestPage()
      })
    }
  }
  /**
   * @param {String} 指定弹窗名称
   * @param {Boolean} 打开或关闭
   */
  handOpenOrCloseModel = (name, flag) => {
    this.setState({
      [name]: flag,
    })
    if (flag === false) {
      this.setState({
        paperData: {},
      })
    }
  }
  changePageSize = (pageSize,current) => {
    let newPageData = Object.assign(this.state.pageData, {pageSize, current})
    this.setState({
        pageData: newPageData
    },() => {
        this.funQueryTestPage()
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
          this.funQueryTestPage()
      })
  }
  editorPaper = data => {
    this.setState({
      paperData: data
    },() => {
      this.handOpenOrCloseModel('addOrEditorPaper', true)
    })
  }
  // 增加或删除试卷
  addOrEditorPaper = val => {
    if (this.state.paperData.id) {
      val.id = this.state.paperData.id
      upDataTestPaper(val).then(res => {
        if (res.errno === 0) {
          message.success('修改成功')
          this.funQueryTestPage()
          this.handOpenOrCloseModel('addOrEditorPaper', false)
        }else {
          message.error(res.message)
        }
      })
    }else {
      val.fullMarks = 0
      val.rules = '[]'
      val.curriculumId = this.state.params.id
      insertTestPaper(val).then(res => {
        if (res.errno === 0) {
          message.success('添加成功')
          this.funQueryTestPage()
          this.handOpenOrCloseModel('addOrEditorPaper', false)
        }else {
          message.error(res.message)
        }
      })
    }
  }
  // 删除试卷
  funDeleteTestPaper = id => {
    deleteTestPaper({id}).then(res => {
      if (res.errno === 0) {
        message.success('删除成功')
        this.funQueryTestPage()
      }else {
        message.error(res.message)
      }
    })
  }

   // 返回到班级首页
  goBack = () => {
    history.goBack(); 
  }
  // 跳转到编辑题目页面
  toEditorTestPaperQuestion = id => {
    this.props.history.push('/teacher/course/editorTestPaper?id=' + id + '&courseId=' + this.state.params.id)
  }
}

export default TestPaper