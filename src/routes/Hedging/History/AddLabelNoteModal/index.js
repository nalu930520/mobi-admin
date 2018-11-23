import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal } from 'antd';

const { TextArea } = Input;
const FormItem = Form.Item;

@Form.create()

@connect(state => ({
  hedging: state.hedging,
}))

export default class AddLabelNoteModal extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'hedging/fetchHedgeDetail',
      payload: {
        currency: 'cny',
      },
    });
  }

  componentWillReceiveProps(nextProps) {
    if (
      !this.props.hedging.closeModal &&
      nextProps.hedging.closeModal
    ) {
      this.props.handleCancel();
    }
  }

  handleOk = () => {
    const { dispatch, labelId } = this.props;
    this.props.form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      dispatch({
        type: 'hedging/addLabelNote',
        payload: {
          id: labelId,
          label_note: fieldsValue.label_note,
        },
      });
    });
  }

  handleCurrencyChange = (value) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'hedging/fetchCurrencyPreAmount',
      payload: {
        currency: value,
      },
    });
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    const { visible, labelNote } = this.props;

    return (
      <Modal
        title="添加／查看标注"
        width={400}
        visible={visible}
        onOk={this.handleOk}
        confirmLoading={false}
        onCancel={this.props.handleCancel}
      >
        <Form>
          <FormItem>
            {getFieldDecorator('label_note', {
              initialValue: labelNote,
            })(
              <TextArea rows={6} />
            )}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}
