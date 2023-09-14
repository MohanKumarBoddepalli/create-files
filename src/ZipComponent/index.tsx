import React, { useState } from 'react';
import JSZip from 'jszip';
import { Button, Modal, Form, Input, Select, Row, Col, Layout } from 'antd';
import './component.css';
import { PlusOutlined } from '@ant-design/icons';
import { Divider, Space } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const { Option } = Select;
const FormItem = Form.Item;
let index = 0;

const ZipDownloadComponent = () => {
  const [visible, setVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [textAreas, setTextAreas] = useState<string[]>([]);
  const [items, setItems] = useState(['bat', 'txt']);
  const [name, setName] = useState('');

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();
    setItems([...items, name || `New item ${index++}`]);
    setName('');
  };

  const replacePlaceholders = (template: string, data: { [key: string]: string }, i: number) => {
    return template.replace(/\${(.*?)}/g, (_, key) => data[key][i]);
  };


  const onFinish = (values: any) => {
    const updatedValues: any = {};
    for (let i = 0; i < textAreas.length; i++) {
      updatedValues[textAreas[i]] = values[textAreas[i]] !== '' ? values[textAreas[i]].split('\n') : [];
    }
    handleDownload(values, updatedValues);
  };

  const handleDownload = (values: any, updatedValues: any) => {

    const count = values.noOfFiles || updatedValues[textAreas[0]]?.length || 1
    const zip = new JSZip();
    const x = values.ComponentValue;
    for (let i = 0; i < count; i++) {

      const fullNo = i + values.startingNo
      const content = replacePlaceholders(values.componentValue, updatedValues, i);
      zip.file(`${values.filename}${fullNo}.${values.filetype}`, content);
    }

    zip.generateAsync({ type: 'blob' }).then((content) => {
      const blobUrl = URL.createObjectURL(content);
      const downloadLink = document.createElement('a');
      downloadLink.href = blobUrl;
      downloadLink.download = `${values.foldername}.zip`;
      downloadLink.click();
      URL.revokeObjectURL(blobUrl);
    });
  };

  const showModal = () => {
    setVisible(true);
  };

  const handleOk = () => {
    // Perform any logic you want with the input value
    console.log('Input value:', inputValue);
    if (inputValue) {
      const pushvalue = [...textAreas, inputValue]
      setTextAreas(pushvalue);
    }


    // Close the modal
    setVisible(false);
    setInputValue('');
  };

  const handleCancel = () => {
    setVisible(false);
    setInputValue('');
  };

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };


  return (
    <Layout className='layout'>
      <Header className='header' style={{textAlign:'left'}}>
        <h2>Create Files</h2>
      </Header>
      <Content className='content'>
        <div className='divs'>
          <Form
            name="nest-messages"
            onFinish={onFinish}
            style={{ maxWidth: '100%' }}
            layout="vertical"
            labelAlign='left'
            initialValues={{ startingNo: 0, noOfFiles: 0 }}
          >
            <Row className='flex-container'>
              <Col span={11}>
                <Form.Item name={['foldername']} label="Folder Name" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col span={11} offset={2}>
                <Form.Item name={['filename']} label="FileName" rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item name={['startingNo']} label="File Starting no">
                  <Input type="number" ></Input>
                </Form.Item>
              </Col>
              <Col span={11} offset={2}>
                <Form.Item name={['filetype']} label="File Type" rules={[{ required: true }]}>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Custom Dropdown"
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: '8px 0' }} />
                        <Space style={{ padding: '0 8px 4px' }}>
                          <Input
                            placeholder="Please enter item"
                            value={name}
                            onChange={onNameChange}
                          />
                          <Button type="text" icon={<PlusOutlined />} onClick={addItem}>
                            Add item
                          </Button>
                        </Space>
                      </>
                    )}
                  >
                    {items.map((item) => (
                      <Select.Option key={item} value={item}>
                        {item}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={11}>
                <Form.Item name={['noOfFiles']} label="No of files to create">
                  <Input type="number" ></Input>
                </Form.Item>
              </Col>
            </Row>
            <Row >
              <Col span={24}>
                <Form.Item name={['componentValue']} label="File input text">
                  <Input.TextArea
                    autoSize={{ minRows: 3, maxRows: 3 }}
                  />
                </Form.Item>
              </Col>
            </Row>
            <FormItem>
              {textAreas.length > 0 ? <div className="dynamic-flex-container">
                {textAreas.map((textArea, index) => (
                  <div className='flex-item'>
                    <Form.Item key={index}
                      name={[`${textArea}`]}
                      label={textArea}>
                      <Input.TextArea
                        className="scrollable-textarea"
                        autoSize={{ minRows: 3, maxRows: 3 }}
                        placeholder={`Enter Text Area ${index + 1}`}
                      />
                    </Form.Item>
                  </div>
                ))}
              </div> : <></>}
            </FormItem>

            <Row>
              <Col>
                <div>
                  <Button type="primary" onClick={showModal}>
                    Add key value
                  </Button>
                  <Modal
                    title="Enter key you want to add"
                    visible={visible}
                    onOk={handleOk}
                    onCancel={handleCancel}
                  >
                    <Input
                      placeholder="Name of parameter"
                      value={inputValue}
                      onChange={handleInputChange}
                      required
                    />
                  </Modal>
                </div>
              </Col>
              <Col>
                <Form.Item wrapperCol={{ offset: 8 }}>
                  <Button type="primary" htmlType="submit">
                    create & download
                  </Button>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </Content>
      <Footer className='footer' style={{ textAlign: 'right' }}>
      ©2023 Created by Mohan kumar
      </Footer>
    </Layout>

  );
};

export default ZipDownloadComponent;
