import React from 'react';
import { Pagination, Input, Select, Button, Checkbox, message } from 'antd'
import { upDataTestPaper, queryTestPaperId, queryChooseQuestion } from 'api/teacher/course'
import QueueAnim from 'rc-queue-anim';
import SingleElection from './chooseComponents/singleElection'
import MultipleChoice from './chooseComponents/multipleChoice'
import Completion from './chooseComponents/completion'
import ShortAnswer from './chooseComponents/shortAnswer'
import './index.less'

const createHistory = require("history").createHashHistory

const { Search } = Input;
const { Option } = Select;
const history = createHistory()

class chooseQuestion extends React.Component {
  constructor(props) {
    super(props)
    let paramData = {}, searchArray = this.props.location.search.substr(1).split('&')
    searchArray.forEach(item => {
    let newArray = item.split('=')
        paramData[newArray[0]] = parseInt(newArray[1])
    })
    this.state = {
      params: paramData,
      questionDataList: [],
      searchData: {},
      pageData:{
        pageSize:10,// 每页条数
        current: 1,// 当前页数
        total: 0,// 数据总数
      },
      addOrEditorQuestion: false,
      editorType: 1,
      editorData: {},
      chooseData: [],
      oldRules: []
    }
  }

  componentDidMount() {
    this.funQueryQuestionPage()
    this.funQueryTestId()
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
    return(
      <div>
        <div style={{minHeight:'calc(100vh - 160px)'}}>
          <div className='search'>
            <Search
              className='search-item'
              placeholder="搜索题目名称"
              onChange={value => this.changeValSearch(value)}
              onSearch={value => this.searchquestion(value)}
              style={{ width: 200 }}
            />
            <div className='search-item'>
              <div>题目类型：</div>
              <Select
              showSearch
              allowClear
              onChange={(val) => this.changeType(val)}
              filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 150 }}>
                <Option key={1} value={1}>单选题</Option>
                <Option key={2} value={2}>多选题</Option>
                <Option key={3} value={3}>填空题</Option>
                <Option key={4} value={4}>简答题</Option>
              </Select>
            </div>
            <div className='search-item'>
              <div>题目难度：</div>
              <Select
              showSearch
              allowClear
              onChange={(val) => this.changeDifficulty(val)}
              filterOption={(input, option) =>
                  option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              style={{ width: 150 }}>
                <Option key={0} value={0}>简答</Option>
                <Option key={1} value={1}>一般</Option>
                <Option key={2} value={2}>困难</Option>
                <Option key={3} value={3}>非常困难</Option>
              </Select>
            </div>
            <Button type='primary' style={{marginRight:'10px'}} onClick={() => this.handleChooseQue()}>确定</Button>
            <Button onClick={() => this.goBack()}>返回</Button>
          </div>
          <Checkbox.Group name='cardCheckBox' style={{width: '100%'}} onChange={value => this.changeChooseQue(value)}>
            <QueueAnim
              style={{marginBottom:'10px'}}
              duration={600}
              animConfig={[
                { opacity: [1, 0], translateX: [0, 100] }
              ]}>
              {
                this.state.questionDataList.map((item, index) => {
                  let comp = ''
                  item.difficultyArray = [
                    {
                      color: '#48A9A6',
                      text: '简单'
                    },
                    {
                      color: '#F58A07',
                      text: '一般'
                    },
                    {
                      color: '#D45113',
                      text: '困难'
                    },
                    {
                      color: '#F40000',
                      text: '非常困难'
                    }
                  ]
                  switch (item.type) {
                    case 1:
                      comp = <SingleElection questionData={item} 
                              openEditorModel={() => this.openEditorModel(1, item)}
                              deleteQuestion={() => this.deleteQuestion(item.id)}/>
                      break;
                    case 2:
                      comp = <MultipleChoice questionData={item} 
                            openEditorModel={() => this.openEditorModel(2, item)}
                            deleteQuestion={() => this.deleteQuestion(item.id)}/>
                      break;
                    case 3:
                      comp = <Completion questionData={item} 
                            openEditorModel={() => this.openEditorModel(3, item)}
                            deleteQuestion={() => this.deleteQuestion(item.id)}/>
                      break;
                    case 4:
                      comp = <ShortAnswer questionData={item} 
                            openEditorModel={() => this.openEditorModel(4, item)}
                            deleteQuestion={() => this.deleteQuestion(item.id)}/>
                      break;
                    default:
                      break;
                  }
                  return (
                    <Checkbox key={-item.id} value={item} style={{width: '100%'}}>
                      { comp }
                    </Checkbox>
                  )
                })
              }
            </QueueAnim>
          </Checkbox.Group>
        </div>
        <div className='bottom'>  
          <Pagination {...paginationProps}></Pagination>
        </div>
      </div>
    )
  }
  // 查询题目分页信息
  funQueryQuestionPage = () => {
    let data = {
      curriculumId: this.state.params.courseId,
      paperId:this.state.params.paperId,
      ...this.state.searchData,
      ...this.state.pageData
    }
    queryChooseQuestion(data).then(res => {
      if (res.errno === 0) {
        let questionData = res.data.row
        questionData.forEach(item => {
          item.answerJson = JSON.parse(item.answerJson)
          item.answerTrue = JSON.parse(item.answerTrue)
          item.questionJson = JSON.parse(item.questionJson)
        })
        let newPageData = Object.assign(this.state.pageData, {total: res.data.count})
          this.setState({
            questionDataList: questionData,
            pageData: newPageData
          })
      }
    })
  }

  // 查询试卷信息
  funQueryTestId = () => {
    queryTestPaperId({id: this.state.params.paperId, curriculumId: this.state.params.courseId}).then(res => {
      if (res.errno === 0) {
        let testPaperData = res.data
        testPaperData.rules = JSON.parse(testPaperData.rules)
        this.setState({
          oldRules: testPaperData.rules
        })
      }
    })
  }
  // 查询题目信息
  searchquestion = (val) => {
    let data = {
      ...this.state.searchData,
      questionTitle: val
    }
    this.setState({
      searchData: data
    },() => {
      this.funQueryQuestionPage()
    })
  }
  // 情况搜索条件时显示全部
  changeValSearch = e => {
    let val = e.target.value
    if (val === '') {
      this.setState({
        searchData: {
          ...this.state.searchData,
          questionTitle: ''
        }
      },() => {
        this.funQueryQuestionPage()
      })
    }
  }
  // 搜索题目类型
  changeType = val => {
    let data = {
      ...this.state.searchData,
      type: val
    }
    this.setState({
      searchData: data
    },() => {
      this.funQueryQuestionPage()
    })
  }
  // 题目难度筛选
  changeDifficulty = val => {
    let data = {
      ...this.state.searchData,
      difficulty: val
    }
    this.setState({
      searchData: data
    },() => {
      this.funQueryQuestionPage()
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
        this.funQueryQuestionPage()
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
          this.funQueryQuestionPage()
      })
  }
  // 改变选中题目的数据
  changeChooseQue = (value) => {
    this.setState({
      chooseData: value
    })
  }
  handleChooseQue = () => {
    if (this.state.chooseData.length === 0) {
      message.warning('请选择题目')
    }else {
      let newData = JSON.parse(JSON.stringify(this.state.chooseData))
      let newRules = this.state.oldRules
      newData.forEach(item => {
        delete item.curriculumId
        delete item.questionTitle
        delete item.createName
        delete item.difficultyArray
        delete item.createBy
        delete item.createTime
        delete item.isTest
        item.score = 0
        newRules.push(item)
      })
      upDataTestPaper({rules: JSON.stringify(newRules), id: this.state.params.paperId}).then(res => {
        if (res.errno === 0) {
          message.success('添加成功')
          this.goBack()
        }
      })
    }
  }
  // 返回上一页
   goBack = () => {
    history.goBack(); 
  }
}

export default chooseQuestion