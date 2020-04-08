import React from 'react';
import { Pagination, Input, Select, Button, Modal } from 'antd'
import { queryQuestionPage } from 'api/teacher/course'
import QueueAnim from 'rc-queue-anim';
import SingleElection from './components/singleElection'
import SingleElectionEditor from './components/singleElectionEditor'
import MultipleChoice from './components/multipleChoice'
import MultipleChoiceEditor from './components/multipleChoiceEditor'
import Completion from './components/completion'
import CompletionEditor from './components/completionEditor'
import ShortAnswer from './components/shortAnswer'
import ShortAnswerEditor from './components/shortAnswerEditor'
import './index.less'

const { Search } = Input;
const { Option } = Select;

class courseInformaition extends React.Component {
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
      editorData: {}
    }
  }

  componentDidMount() {
    this.funQueryQuestionPage()
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
              <div>添加题目：</div>
              <Button className='search-item-btn' onClick={() => this.editorQuestion(1)}>单选题</Button>
              <Button className='search-item-btn' onClick={() => this.editorQuestion(2)}>多选题</Button>
              <Button className='search-item-btn' onClick={() => this.editorQuestion(3)}>填空题</Button>
              <Button className='search-item-btn' onClick={() => this.editorQuestion(4)}>简答题</Button>
            </div>
          </div>
          <QueueAnim
            style={{marginBottom:'20px'}}
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
                item.isTestArray = [
                  {
                    text: '仅练习',
                    color: '#48A9A6'
                  },
                  {
                    text: '仅考试',
                    color: '#D17B88'
                  },
                  {
                    text: '练习&考试',
                    color: '#F58A07'
                  }
                ]
                switch (item.type) {
                  case 1:
                    comp = <SingleElection questionData={item} editorQuestion={() => this.editorQuestion(1, item)}/>
                    break;
                  case 2:
                    comp = <MultipleChoice questionData={item} editorQuestion={() => this.editorQuestion(2, item)}/>
                    break;
                  case 3:
                    comp = <Completion questionData={item} editorQuestion={() => this.editorQuestion(3, item)}/>
                    break;
                  case 4:
                    comp = <ShortAnswer questionData={item} editorQuestion={() => this.editorQuestion(4, item)}/>
                    break;
                  default:
                    break;
                }
                return (
                  <div key={-item.id} style={{marginTop:'10px'}}>
                    { comp }
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
        visible={this.state.addOrEditorQuestion}
        onCancel={() => this.handOpenOrCloseModel('addOrEditorQuestion', false)}
        footer={''}>
          {(() => {
            switch (this.state.editorType) {
              case 1:
                return <SingleElectionEditor questionData={this.state.editorData}/>
              case 2: 
                return <MultipleChoiceEditor questionData={this.state.editorData}/>
              case 3: 
                return <CompletionEditor questionData={this.state.editorData}/>
              case 4: 
                return <ShortAnswerEditor questionData={this.state.editorData}/>
              default:
                break;
            }
          })()}
        </Modal>
      </div>
    )
  }
  // 查询题目分页信息
  funQueryQuestionPage = () => {
    let data = {
      curriculumId: this.state.params.id,
      ...this.state.searchData,
      ...this.state.pageData
    }
    queryQuestionPage(data).then(res => {
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
  /**
   * 打开或关闭弹窗
   * @param {*} name 弹窗名称
   * @param {*} flag 开启或关闭
   */
  handOpenOrCloseModel = (name, flag) => {
    this.setState({
      [name]: flag
    })
  }

  /**
   * 打开编辑窗口
   * @param {*} type 题目类型
   * @param {*} item 题目数据
   */
  editorQuestion = (type, item = {}) => {
    this.setState({
      editorType: type,
      editorData: item
    },() => {
      this.handOpenOrCloseModel('addOrEditorQuestion', true)
    })
  }
}

export default courseInformaition