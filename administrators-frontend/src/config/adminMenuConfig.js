const adminMenuList = [
    {
        title:'账号管理',
        key:'/admin/teacherAccount',
        children:[
            {
                title:'教师账号',
                key:'/admin/account/teacher',
            },
            {
                title:'管理员账号',
                key:'/admin/account/admin',
            },
        ]
    },
    {
        title: '班级管理',
        key: '/admin/class',
        children:[
            {
                title: '班级信息',
                key: '/admin/class/classTable'
            },
            {
                title: '学生账号',
                key: '/admin/class/studentAccount'
            },
            {
                title: '课程安排',
                key: '/admin/class/arrangement'
            }
        ]
    },
    {
        title: '课程管理',
        key: '/admin/course/index'
    },
    {
        title: '考试记录',
        key: '/admin/examinationRecord/main'
    },
    {
        title: '个人中心',
        key: '/admin/personal/main'
    }
];
export default adminMenuList;