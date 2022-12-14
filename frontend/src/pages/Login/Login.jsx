import React, { useContext, useEffect } from "react";
import "antd/dist/antd.css";
import { Form, Button, Input, Typography, message } from "antd";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { MainContext } from "../../context/MainContext";
import axios from "axios";
import { END_POINT } from "../../utils/constant";

const LoginForm = styled.div`
  .Login {
    height: 100vh;
    display: flex;
    flex-direction: row;
    @media (max-width: 768px) {
      flex-direction: column;
    }
    @media (max-height: 628px) {
      flex-direction: column;
    }
    justify-content: center;
    align-items: center;
    padding-top: 100px;
    padding-bottom: 50px;
    background-color: #fbab7e;
    background-image: linear-gradient(62deg, #fbab7e 0%, #f7ce68 100%);
    overflow: auto;
  }
  .Login-header {
    max-width: 500px;
    width: 100%;
    background-color: #fff;
    padding: 25px 30px;
    border-radius: 5px;
    box-shadow: 0 5px 10px rgba(0, 0, 0, 0.15);
  }
  .ant-typography {
    font-size: 45px;
    font-weight: 500;
    position: relative;
  }
  .ant-input-affix-wrapper {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
      rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
      rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  }
  .ant-select {
    box-shadow: rgba(0, 0, 0, 0.2) 0px 12px 28px 0px,
      rgba(0, 0, 0, 0.1) 0px 2px 4px 0px,
      rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset;
  }
  .sign {
    text-align: right;
  }
`;
const ButtonContainer = styled.div`
  .ant-btn-primary {
    height: 100%;
    width: 100%;
    border-radius: 5px;
    border: none;
    color: #fff;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 1px;
    cursor: pointer;
    transition: all 0.3s ease;
    background-color: #fbab7e;
    &:hover {
      background-color: #fbab7e;
      background-image: linear-gradient(250deg, #e3ed1f 0%, #f7ce68 100%);
    }
  }
`;

function isValidEmail(email) {
  return /\S+@\S+\.\S+/.test(email);
}

const { Title } = Typography;

function Login() {
  const { setMetadata } = useContext(MainContext);
  useEffect(() => {
    setMetadata((prev) => {
      return {
        ...prev,
        title: "????ng nh???p | TKTL",
      };
    });
  }, []);

  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { loginHandle } = useContext(MainContext);
  const success = () => {
    message.success({
      content: "????ng nh???p th??nh c??ng",
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };
  const failed403 = () => {
    message.error({
      content: "Role c???a b???n ch??a ???????c x??c nh???n, t??? ch???i ????ng nh???p",
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };
  const failed400 = () => {
    message.error({
      content: "Email, s??? ??i???n tho???i ho???c m???t kh???u kh??ng ????ng",
      className: "custom-class",
      style: {
        marginTop: "20vh",
      },
    });
  };
  const emailphone = Form.useWatch("email/phone", form);
  let email;
  let phone;
  isValidEmail(emailphone) ? (email = emailphone) : (phone = emailphone);
  let password = Form.useWatch("password", form);

  const onFinish = async () => {
    try {
      const response = await axios.post(
        `${END_POINT}/auth/login`,
        {
          email: email,
          phone: phone,
          password: password,
        }
      );
      success();
      const { data } = response.data;
      loginHandle(data.accessToken, data.refreshToken, data.user);
      navigate("/", { replace: true });
    } catch (error) {
      if (error.message === "Request failed with status code 403") {
        failed403();
      }
      if (error.message === "Request failed with status code 400") {
        failed400();
      }
    }

    return (
      <LoginForm>
        <div className="Login">
          <div className="Login-header">
            <Form
              form={form}
              autoComplete="off"
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
              onFinish={onFinish}
              onFinishFailed={(error) => {
                console.log({ error });
              }}
            >
              <Title level={2} className="text-center">
                ????ng nh???p
              </Title>

              <Form.Item
                name="email/phone"
                label="Email/Phone"
                rules={[
                  {
                    required: true,
                    message: "Vui l??ng nh???p email ho???c s??? ??i???n tho???i",
                  },
                ]}
                hasFeedback
              >
                <Input placeholder="Nh???p email ho???c s??? ??i???n tho???i" />
              </Form.Item>

              <Form.Item
                name="password"
                label="M???t kh???u"
                rules={[
                  {
                    required: true,
                    message: "Vui l??ng nh???p m???t kh???u",
                  },
                  {
                    min: 6,
                    message: "M???t kh???u ph???i d??i h??n 6 ch??? s???",
                  },
                  {
                    max: 24,
                    message: "M???t kh???u ch??? ???????c t???i ??a 24 ch??? s???",
                  },
                ]}
                hasFeedback
              >
                <Input.Password placeholder="Nh???p m???t kh???u" />
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <div className="sign">
                  B???n ch??a c?? t??i kho???n?
                  <Link to="/dang-ki" className="font-semibold text-blue-700">
                    ????ng k?? t??i kho???n
                  </Link>
                </div>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <div className="sign">
                  <Link
                    to="/quen-mat-khau"
                    className="font-semibold text-blue-700"
                  >
                    Qu??n m???t kh???u
                  </Link>
                </div>
              </Form.Item>

              <Form.Item wrapperCol={{ span: 24 }}>
                <ButtonContainer>
                  <Button block type="primary" htmlType="submit">
                    ????ng nh???p
                  </Button>
                </ButtonContainer>
              </Form.Item>
            </Form>
          </div>
        </div>
      </LoginForm>
    );
  };

}

export default Login;