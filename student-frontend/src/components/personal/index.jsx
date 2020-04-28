import React from 'react'
import CreateForm from 'components/formComponent/index.jsx'
import { Radio, Upload, Button, message, Modal, Input } from 'antd'
import { LoadingOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { updataPersonal, updataPassword } from 'api/login'
import { imgUpload } from 'api/utilsApi'
import './index.less'
class teacherPersonal extends React.Component {
  constructor(props) {
    super(props)
    console.log(window.userInfo)
    this.state = {
      userInfo: window.userInfo,
      CreateForm: '',
      imageUrl: window.userInfo.headPortraitUrl,
      imgLoading: false,
      fileList: [],
      isUpload: false,
      updataPasswordModal: false
    }
  }

  render() {
    return (
      <div>
        <div className='queEditor-list'>
          <div className='form-item'>
            头像：
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
        <CreateForm cancelText='重置'
          clickCancel={() => this.handleResetFields()}
          clickOk={(val) => this.funEditorPersonal(val)}
          onRef={this.getCreateForm}
          fromList={[
            {
              formItemProp:{
                label: '账号'
              },
              name: 'account',
              component: 
              <div>
                {this.state.userInfo.account}
              </div>
            },
            {
              formItemProp:{
                label: '密码'
              },
              name: 'password',
              component: 
              <div>
                *****
                <Button onClick={() => this.handOpenOrCloseModel('updataPasswordModal', true)} className='exam-card-list-handle-correction' size='small' style={{marginLeft:'10px'}}>修改密码</Button>
              </div>
            },
            {
              formItemProp:{
                label: '姓名'
              },
              name: 'username',
              initialValue: this.state.userInfo.username,
              rules:[
                {
                    required: true,
                    message: '请输入姓名',
                }
              ]
            },
            {
              formItemProp:{
                label: '班级'
              },
              name: 'className',
              component: 
              <div>
                {this.state.userInfo.className}
              </div>
            },
            {
              formItemProp:{
                label: '性别'
              },
              name: 'sex',
              initialValue: this.state.userInfo.sex,
              rules:[
                {
                    required: true,
                    message: '请选择性别',
                }
              ],
              component: 
              <Radio.Group style={{ width: 200 }}>
                <Radio key={1} value={1}>男</Radio>
                <Radio key={0} value={0}>女</Radio>
              </Radio.Group>
            },
          ]} />
          <Modal
          visible={this.state.updataPasswordModal}
          onCancel={() => this.handOpenOrCloseModel('updataPasswordModal', false)}
          footer={''}>
            {
              this.state.updataPasswordModal ? 
              <CreateForm
              clickCancel={() => this.handOpenOrCloseModel('updataPasswordModal', false)}
              clickOk={(val) => this.funUpdataPassword(val)}
              fromList={[
                {
                  formItemProp:{
                    label: '旧密码'
                  },
                  name: 'oldPassword',
                  rules:[
                    {
                        required: true,
                        message: '请输旧密码',
                    }
                  ],
                  component: 
                  <Input.Password style={{width: '200px'}}/>
                },
                {
                  formItemProp:{
                    label: '新密码'
                  },
                  name: 'newPassword',
                  rules:[
                    {
                        required: true,
                        message: '请输新密码',
                    },
                    {
                      min:6,
                      message: '密码不能少于6个字符',
                    },
                    {
                      max:16,
                      message: '密码不能多于16个字符',
                    },
                  ],
                  component: 
                  <Input.Password style={{width: '200px'}}/>
                },
              ]}/> : ''
            }
          </Modal>
      </div>
    )
  }

  getCreateForm = (CreateForm) => {
    this.setState({
      CreateForm
    })
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
          isUpload: true
        })
      }
    );
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
  }

  // 删除图片
  removeImage = () => {
    this.setState({
      imageUrl: null,
      fileList: [],
    })
  }
  // 重制信息
  handleResetFields = () => {
    this.state.CreateForm.handleResetFields()
    this.setState({
      imageUrl: window.userInfo.headPortraitUrl
    })
  }
  // 修改个人信息
  funEditorPersonal = (val) => {
    let data = {
      username: val.username,
      sex: val.sex,
    }
    if (this.state.imageUrl !== this.state.userInfo.headPortraitUrl) {
      imgUpload({imgfiles:this.state.imageUrl}).then(res => {
        if (res.status === 100) {
          data.headPortraitUrl = res.imageUrl
          updataPersonal(data).then(res => {
            if (res.errno === 0) {
              message.success('修改成功')
              localStorage.setItem('token',res.data.token)
            }
          })
        }else {
          message.error(res.msg)
        }
      })
    }else {
      updataPersonal(data).then(res => {
        if (res.errno === 0) {
          message.success('修改成功')
          localStorage.setItem('token',res.data.token)
        }
      })
    }
  }
  funUpdataPassword = (val) => {
    updataPassword(val).then(res => {
      if (res.errno === 0) {
        this.handOpenOrCloseModel('updataPasswordModal', false)
        message.success('密码修改成功')
      }else {
        message.error(res.data)
      }
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
}

export default teacherPersonal