import React  from 'react';
import { Form, Input, Button } from 'antd'

const FormItem = Form.Item
// 封装要form组件
class CreateForm extends React.Component {
  constructor(props) {
    super(props)
    if(props.onRef){//如果父组件传来该方法 则调用方法将子组件this指针传过去
      props.onRef(this)
    }
    const { fromList, fromLayout, cancelText } = this.props
    this.state = {
      fromList: fromList || [],
      formItemLayout: fromLayout || {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      cancelText: cancelText || '取消'
    }
  }
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <Form {...this.state.formItemLayout}>
          {
            this.state.fromList.map((item, index) => {
              return (
                <FormItem {...item.formItemProp} key={index}>
                  {
                        getFieldDecorator(item.name || '', {
                            initialValue: item.initialValue || null,
                            rules: item.rules || []
                        })(
                          item.component || <Input style={{ width: 200 }}/>
                        )
                    }
                </FormItem>
              )
            })
          }
          <FormItem label=' ' colon={false}>
              <Button  onClick={this.clickCancel} >
                  {this.state.cancelText}
              </Button>
              <Button style={{marginLeft:'10px'}} type="primary" onClick={this.clickOk} >
                  确认
              </Button>
          </FormItem>
        </Form>
      </div>
    )
  }
  /**
   * 提交信息
   */
  clickOk = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
            // console.log('Received values of form: ', values);
            this.props.clickOk(values)
        }
    });
  }
  /**
   * 关闭弹窗
   */
  clickCancel = () => {
      this.props.clickCancel()
  }
  /**
   * 重置数据
   */
  handleResetFields = () => {
    this.props.form.resetFields()
  }
}

export default Form.create()(CreateForm)