import React from 'react'
import { Menu } from 'antd'
import { NavLink } from 'react-router-dom'
import MenuConfig from '../../../../config/teacherMenuConfig'

import './navLeft.less'

const SubMenu = Menu.SubMenu;

export default class NavLeft extends React.Component{
    UNSAFE_componentWillMount() {
        const menuTree = this.renderMenu(MenuConfig)
        this.setState({
            menuTree
        })
    }
    renderMenu = (data) => {
        return data.map(item => {
            if (item.children) {
                return (
                    <SubMenu key={item.key} title={item.title}>
                        {this.renderMenu(item.children)}
                    </SubMenu>
                )
            }
            return (
                <Menu.Item key={item.key} title={item.title}>
                    <NavLink to={item.key}>{item.title}</NavLink>
                </Menu.Item>
            )
        })
    }
    render() {
        return (
            <div>
                <div className="logo">
                    <img src="/assets/logo-ant.svg" alt='logo'/>
                    <h1>考试管理系统</h1>
                </div>
                <Menu theme="dark">
                    { this.state.menuTree }
                </Menu>  
            </div>
        )
    }
}