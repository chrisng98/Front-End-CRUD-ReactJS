import axios from "axios";
import {Pagination, Popconfirm, Table, Modal, Input, BackTop} from "antd";
import "antd/dist/antd.css";
import React, { useEffect, useState } from "react";
import { Button } from "antd/lib/radio";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons/lib/icons";
import Layout, { Content, Footer } from "antd/lib/layout/layout";
import "./Home.css"

const Home = (pageNumber) => {
  const [post, setPost] = useState([]);
  const [total, setTotal] = useState("");
  const [page, setPage] = useState(1);
  const [refresh, setRefresh] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [editingUser, setEditingUser] = useState("");
  const [creatingUser, setCreatingUser] = useState("");

  const baseURL = process.env.React_App_baseURL;
  const access_token = process.env.React_App_access_token;
  
  const columns = [
      {
          title: 'ID',
          dataIndex: 'id',
          key:"id",
          sorter: (a,b) => a.id - b.id
      },
      {
          title: 'Name',
          dataIndex: 'name',
          key:"name",
          editable :true
      },
      {
          title: 'Email',
          dataIndex: 'email',
          key:"email",
          editable :true
      },
      {
          title: 'Gender',
          dataIndex: 'gender',
          key:"gender",
          editable :true,
          filters: [
            {text: "Male", value: "male"},
            {text: "Female", value: "female"}
          ],
          onFilter: (value, record) => {
            return record.gender === value;
          }
      },
      {
          title: 'Status',
          dataIndex: 'status',
          key:"status",
          editable :true,
          filters: [
            {text: "Active", value: "active"},
            {text: "Inactive", value: "inactive"}
          ],
          onFilter: (value, record) => {
            return record.status === value;
          }
      },
      {
          title: 'Actions',
          key: "actions",
          render: (record) => {
            return(
              <>
                <EditOutlined onClick={() => onEditUser(record)} style= {{color:"blue"}}/>
                <Popconfirm
                title = "Are you sure?"
                onConfirm = {() => onDeleteUser(record.id)}
                >  
                <DeleteOutlined style= {{color:"red", marginLeft: 12}}/>
                </Popconfirm> 
               
              </>
            )
          }
      }
  ]

  useEffect(() => {

    const currentPage = parseInt(sessionStorage.getItem("currentPage"));

    try {
      if(!currentPage) {
        setPage(1);
      }else {
        setPage(currentPage);
      }
      
      axios.get(`${baseURL}?page=${page}`).then((response) => {
        setPost(response.data);
        setTotal(response.data.meta.pagination.total);
      });

      if(refresh) {
        window.location.reload();
        setRefresh(false);
      }
      
    } catch (error) {
      console.log(error)
    }

  },[page, refresh, baseURL]);

  if (!post) return null;

  const changeHandler = async (pageNumber) => {
     setPage(pageNumber);
     sessionStorage.setItem("currentPage", pageNumber);
    }

  const onAddUser = () => {
     setIsCreating(true);
  }

  const onEditUser = async (record) => {
    setIsEditing(true);
    setEditingUser({...record})
  }


  const onDeleteUser = async (id) => {
    try {
      const config = {
        headers: {
          "Authorization": `${access_token}`
        }
      };

      await axios.delete(`${baseURL}/${id}`,config);

    } catch (error) {
      console.log(error)
    }
    
    setRefresh(true);
  }

  return (
    <Layout className="screen">
        <header>
          <h1>User Management System</h1>
        </header>
        <Layout>
          <Content>
            <Modal className="model"
                title = "Edit User"
                visible= {isEditing}
                okText = "Save"
                onCancel = {() => {
                  setIsEditing(false)
                }}
                onOk={async() => {
                  try {
                    const config = {
                      headers: {
                        "Authorization": `${access_token}`,
                        "Content-Type": "application/json"
                      }
                    };

                    const data = {
                        "name": editingUser.name,
                        "email" : editingUser.email,
                        "gender" : editingUser.gender,
                        "status" : editingUser.status
                    }

                    await axios.put(`${baseURL}/${editingUser.id}`,data
                    ,config);
                    setRefresh(true);
                  } catch (error) {
                    console.log(error)
                  }

                  setIsEditing(false)
                }}
                >
                  <h3 className="intext">Name:</h3>
                  <Input value = {editingUser?.name} onChange={(e) => {
                    setEditingUser(pre => {
                      return {...pre, name: e.target.value}
                    })
                  }} 
                  />
                  <h3>Email:</h3>
                  <Input value = {editingUser?.email} onChange={(e) => {
                    setEditingUser(pre => {
                      return {...pre, email: e.target.value}
                    })
                  }} 
                  />
                  <h3>Gender:</h3>
                  <Input value = {editingUser?.gender} onChange={(e) => {
                    setEditingUser(pre => {
                      return {...pre, gender: e.target.value}
                    })
                  }} 
                  />
                  <h3>Status:</h3>
                  <Input value = {editingUser?.status} onChange={(e) => {
                    setEditingUser(pre => {
                      return {...pre, status: e.target.value}
                    })
                  }} 
                  />
              </Modal>
              
              <Modal className="model"
                title = "New User"
                visible= {isCreating}
                okText = "Create"
                onCancel = {() => {
                  setIsCreating(false)
                }}
                onOk={async() => {
                  try {
                    const config = {
                      headers: {
                        "Authorization": `${access_token}`,
                        "Content-Type": "application/json"
                      }
                    };

                    const data = {
                        "name": creatingUser.name,
                        "email" : creatingUser.email,
                        "gender" : creatingUser.gender,
                        "status" : creatingUser.status
                    }

                    await axios.post(`${baseURL}`,data
                    ,config);
                    setRefresh(true);
                  } catch (error) {
                    console.log(error)
                  }

                  setIsCreating(false)
                }}
                >
                  <h3>Name:</h3>
                  <Input value = {creatingUser?.name} onChange={(e) => {
                    setCreatingUser(pre => {
                      return {...pre, name: e.target.value}
                    })
                  }} 
                  />
                  <h3>Email:</h3>
                  <Input value = {creatingUser?.email} onChange={(e) => {
                    setCreatingUser(pre => {
                      return {...pre, email: e.target.value}
                    })
                  }} 
                  />
                  <h3>Gender:</h3>
                  <Input value = {creatingUser?.gender} onChange={(e) => {
                    setCreatingUser(pre => {
                      return {...pre, gender: e.target.value}
                    })
                  }} 
                  />
                  <h3>Status:</h3>
                  <Input value = {creatingUser?.status} onChange={(e) => {
                    setCreatingUser(pre => {
                      return {...pre, status: e.target.value}
                    })
                  }} 
                  />
              </Modal>
            <div>
            <Table
                  className="ant-table-thread"
                  rowKey= "id"
                  columns = {columns}
                  dataSource={post.data}
                  bordered = {true}
                  pagination ={false}
              ></Table>

              <Button className="adduserbutton" onClick= {onAddUser}>
              Add a new user
            </Button>
            <BackTop />
            </div>  
          </Content>
        </Layout>

        <Footer>
           <Pagination
                  defaultCurrent={1}
                  current={page}
                  total= {total}
                  pageSize={20}
                  showQuickJumper = {true}
                  showSizeChanger = {false}
                  onChange={changeHandler}
              >
              </Pagination>
        </Footer>
      </Layout>
   
  );
}

export default Home;