import  React  from 'react';
import { Input, Select, Checkbox, Button, Upload, message } from 'antd'
import { LoadingOutlined, PlusOutlined, DeleteOutlined, PlusCircleOutlined, CloseCircleFilled } from '@ant-design/icons'
import ScrollView from 'react-custom-scrollbars'

const { Option } = Select;

class CompletionEditor extends React.Component {
  constructor(props) {
    super(props)
    switch (props.questionData.isTest) {
      case 0:
        props.questionData.testCheckArray = [0]
        break;
      case 1:
        props.questionData.testCheckArray = [1]
        break;
      case 2:
        props.questionData.testCheckArray = [0, 1]
        break;
      default:
        break;
    }
    let propsQuestionData = {}
    if (props.questionData.id) {
      propsQuestionData = props.questionData
      props.questionData.questionJson.forEach((item, index) => {
        item.key = index
      })
    }else {
      propsQuestionData = {
        questionJson: [
          {
            key: 0,
            type: 1,
            title: ''
          },
          {
            key: 1,
            type: 0,
            title: ''
          }
        ],
        imgUrl: '',
        difficulty: 0,
        testCheckArray: [0],
        answerTrue: [[{key: 0, text: ''}]]
      }
    }
    let isAddText = propsQuestionData.questionJson.length % 2 ? false : true
    this.state = {
      imageUrl: propsQuestionData.imgUrl,
      imgLoading: false,
      fileList: [],
      isUpload: false,
      questionData: propsQuestionData,
      addOrEditorData: {
        type: 3,
        difficulty: propsQuestionData.difficulty,
        imgUrl: '',
        isTest: propsQuestionData.isTest || 0,
        questionTitle: propsQuestionData.questionTitle
      },
      isAddText
    }
  }
  
  render() {
    let questionData = this.state.questionData
    return (
      <div style={{height: '550px'}}>
        <ScrollView >
          <div className='queEditor-list'>
            <div className='queEditor-list-labelShort'>
              题目设置：
            </div>
            <div className='queEditor-list-content'>
              {
                questionData.questionJson.map((item, index) => {
                  return (
                    <div key={item.key}>
                      {(() => {
                        switch (item.type) {
                          case 1:
                            return (
                              <div className='queEditor-list-content-compleList'>
                                <div className='queEditor-list-content-compleList-label'>
                                  内容：
                                  {
                                    questionData.questionJson.length > 2 ? 
                                    <Button size={'small'} type='danger' onClick={() => this.removeQuestion(index)} style={{
                                      fontSize: '12px',
                                      marginLeft: '20px'
                                    }}>删除内容和填空</Button> : ''
                                  }
                                </div>
                                <Input.TextArea style={{width: '250px'}} 
                                autoSize={{ minRows: 2, maxRows: 4 }} 
                                defaultValue={item.title}
                                onBlur={(e) => this.changeQuestionTitle(index, e)}
                                />
                              </div>
                            )
                          case 0:
                            return (
                              <div className='queEditor-list-content-compleList'>
                                <div className='queEditor-list-content-compleList-label'>
                                  填空答案：
                                </div>
                                <div className='queEditor-list-content-compleList-answer'>
                                  {
                                    questionData.answerTrue[(index - 1) / 2].map((answerItem, answerIndex) => {
                                      return (
                                        <div key={answerItem.key} className='queEditor-list-content-compleList-answer-input'>
                                          <Input defaultValue={answerItem.text} style={{width: '100px',marginRight:'5px',marginBottom:'5px'}}
                                          onBlur={(e) => this.changeAnswerTitle((index - 1) / 2, answerIndex, e)}/>
                                          {
                                            questionData.answerTrue[(index - 1) / 2].length > 1 ?
                                            <CloseCircleFilled className='queEditor-list-content-compleList-answer-input-remove' 
                                            onClick={() => this.removeAnswerArray((index - 1) / 2, answerIndex)}/> : ''
                                          }
                                        </div>
                                      )
                                    }) 
                                  }
                                  {
                                    questionData.answerTrue[(index - 1) / 2].length < 4 ? 
                                    <PlusCircleOutlined style={{marginTop:'8px',color:'#1DA57A', cursor:'pointer'}} onClick={() => this.addAnswerArray((index - 1) / 2)}/> : ''
                                  }
                                </div>
                              </div>
                            )
                          default:
                            break;
                        }
                      })()}
                    </div>
                  )
                })
              }
            </div>
          </div>
          {
            questionData.questionJson.length < 10 ?
            <div className='queEditor-list'>
              <div className='queEditor-list-labelShort'></div>
              <div>
                <Button size={'small'} style={{marginRight:'10px'}} type='primary' disabled={!this.state.isAddText} onClick={() => this.addText()}>添加文字</Button>
                <Button size={'small'} type='primary' disabled={this.state.isAddText} onClick={() => this.addInput()}>添加填空</Button>
              </div>
            </div> : ''
          }
          <div className='queEditor-list'>
            <div className='queEditor-list-labelShort'>
              图片：
            </div>
            <div className='queEditor-list-content queEditor-list-upload'>
              <Upload
                name="avatar"
                listType="picture-card"
                className="avatar-uploader"
                showUploadList={false}
                fileList={this.state.fileList}
                beforeUpload={() => this.getFile()}
                accept='.jpg,.jpeg,.png'
                onChange={(info) => this.handleChange(info)}
              >
                {
                  this.state.imageUrl ? 
                  <img src={this.state.imageUrl} alt="avatar" style={{ width: '100%' }} /> : 
                  <div>
                    {this.state.imgLoading ? <LoadingOutlined /> : <PlusOutlined />}
                    <div className="ant-upload-text">Upload</div>
                  </div>
                }
              </Upload>
              {
                this.state.imageUrl ?  <DeleteOutlined  style={{color: '#f00'}} onClick={() => this.removeImage()}/> : ''
              }
            </div>
          </div>
          <div className='queEditor-list'>
            <div className='queEditor-list-labelShort'>
              难度：
            </div>
            <div className='queEditor-list-content'>
              <Select style={{width: '150px'}} defaultValue={questionData.difficulty} onChange={(val) => this.changeQuestionDiff(val)}>
                <Option key={0} value={0}>简单</Option>
                <Option key={1} value={1}>一般</Option>
                <Option key={2} value={2}>困难</Option>
                <Option key={3} value={3}>非常困难</Option>
              </Select>
            </div>
          </div>
          <div className='queEditor-list'>
            <div className='queEditor-list-labelShort'>
              题目出现在：
            </div>
            <div className='queEditor-list-content'>
              <Checkbox.Group style={{marginTop:'5px'}} defaultValue={questionData.testCheckArray} onChange={val => this.changeIsTest(val)}>
                <Checkbox key={0} value={0}>测试题</Checkbox>
                <Checkbox key={1} value={1}>考试题</Checkbox>
              </Checkbox.Group>
            </div>
          </div>
          <div className='queEditor-list'>
            <div className='queEditor-list-labelShort'></div>
            <div className='queEditor-list-content'>
              <Button type='primary' style={{marginRight:'10px'}} onClick={() => this.addOrEditorQuestion()}>确定</Button>
              <Button onClick={() => this.closeEditorModel()}>取消</Button>
            </div>
          </div>
        </ScrollView>
      </div>
    )
  }
  /**
   * 文件赋值
   */
  getFile = (file) => {
    this.setState({
      imgLoading: true
    })
    return false
  }
  handleChange = info => {
    this.getBase64(info.file, imageUrl => {
        this.setState({
          imageUrl,
          imgLoading: false,
          fileList: [info.file],
          isUpload: true,
          addOrEditorData: {
            ...this.state.addOrEditorData,
            imgUrl: imageUrl
          }
        })
      }
    );
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }
  closeEditorModel = () => {
    this.props.closeEditorModel()
  }
  // 改变难度
  changeQuestionDiff = val => {
    this.setState({
      addOrEditorData: {
        ...this.state.addOrEditorData,
        difficulty: val
      }
    })
  }
  // 该变题目会出现的地方
  changeIsTest = val => {
    let isTest = ''
    if (val[1] > -1) {
      isTest = 2
    }else if (val[0] > -1){
      isTest = val[0]
    }
    this.setState({
      addOrEditorData: {
        ...this.state.addOrEditorData,
        isTest
      }
    })
  }
  // 删除图片
  removeImage = () => {
    this.setState({
      imageUrl: null,
      fileList: [],
      addOrEditorData: {
        ...this.state.addOrEditorData,
        imgUrl: null
      }
    })
  }
  // 添加问题
  addText = () => {
    let newQuestion = JSON.parse(JSON.stringify(this.state.questionData.questionJson)) 
    newQuestion.push({
      key: newQuestion[newQuestion.length - 1].key + 1,
      type: 1,
      title: ''
    })
    this.setState({
      questionData: {
        ...this.state.questionData,
        questionJson: newQuestion
      },
      isAddText: false
    })
  }
  // 添加填空
  addInput = () => {
    let newAnswer = JSON.parse(JSON.stringify(this.state.questionData.answerTrue))
    let newQuestion = JSON.parse(JSON.stringify(this.state.questionData.questionJson)) 
    newAnswer.push([{
      key: 0,
      text: ''
    }])
    newQuestion.push({
      key: newQuestion[newQuestion.length - 1].key + 1,
      type: 0,
      title: ''
    })
    this.setState({
      questionData: {
        ...this.state.questionData,
        questionJson: newQuestion,
        answerTrue: newAnswer
      },
      isAddText: true
    })
  }
  // 添加填空答案
  addAnswerArray = index => {
    let newAnswer = JSON.parse(JSON.stringify(this.state.questionData.answerTrue))
    newAnswer[index].push({
      key: newAnswer[index][newAnswer[index].length - 1].key + 1,
      text: ''
    })
    this.setState({
      questionData: {
        ...this.state.questionData,
        answerTrue: newAnswer
      }
    })
  }
  // 删除填空答案
  removeAnswerArray = (index, answerIndex) => {
    let newAnswer = JSON.parse(JSON.stringify(this.state.questionData.answerTrue))
    newAnswer[index].splice(answerIndex, 1)
    this.setState({
      questionData: {
        ...this.state.questionData,
        answerTrue: newAnswer
      }
    })
  }
  // 删除填空
  removeQuestion = (index) => {
    let newAnswer = JSON.parse(JSON.stringify(this.state.questionData.answerTrue))
    let newQuestion = JSON.parse(JSON.stringify(this.state.questionData.questionJson))
    newQuestion.splice(index, 2)
    if (index / 2 < newAnswer.length) {
      newAnswer.splice(index / 2, 1)
    }
    this.setState({
      questionData: {
        ...this.state.questionData,
        questionJson: newQuestion,
        answerTrue: newAnswer
      },
      isAddText: true
    })
  }
  // 修改题目内容
  changeQuestionTitle = (index, e) => {
    let newQuestion = JSON.parse(JSON.stringify(this.state.questionData.questionJson))
    newQuestion[index].title = e.target.value
    this.setState({
      questionData: {
        ...this.state.questionData,
        questionJson: newQuestion
      }
    })
  }
  // 修改参考答案内容
  changeAnswerTitle = (index, answerIndex, e) => {
    let newAnswer = JSON.parse(JSON.stringify(this.state.questionData.answerTrue))
    newAnswer[index][answerIndex].text = e.target.value
    this.setState({
      questionData: {
        ...this.state.questionData,
        answerTrue: newAnswer
      }
    })
  }
  // 增加或修改题目
  addOrEditorQuestion = () => {
    let newQuestionData = JSON.parse(JSON.stringify(this.state.addOrEditorData))
    let questionTitle = ''
    if (this.state.questionData.id) {
      newQuestionData.id = this.state.questionData.id
    }
    newQuestionData.answerTrue = JSON.parse(JSON.stringify(this.state.questionData.answerTrue))
    newQuestionData.questionJson = JSON.parse(JSON.stringify(this.state.questionData.questionJson))
    newQuestionData.questionJson.forEach(item => {
      if (item.type) {
        questionTitle += item.title
      }
    })
    newQuestionData.questionTitle = questionTitle
    newQuestionData.answerJson = {}
    // console.log(newQuestionData)
    if (!newQuestionData.questionTitle){
      message.error('题目不能为空')
    }else if (newQuestionData.isTest === ''){
      message.error('请选择题目出现处')
    }else {
      this.props.addOrEditorQuestion(newQuestionData)
    }
  }
}

export default CompletionEditor