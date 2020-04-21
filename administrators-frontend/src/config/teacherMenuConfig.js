const adminMenuList = [
    {
        title: '班级管理',
        key: '/teacher/class/main',
        children:[
            {
                title: '管理的班级',
                key: '/teacher/class/mainClass'
            },
            {
                title: '上课的班级',
                key: '/teacher/class/courseClass'
            }
        ]
    },
    {
        title: '课程管理',
        key: '/teacher/course/main'
    },
    {
        title: '考试管理',
        key: '/teacher/examinationRecord/main'
    },
    {
        title: '个人中心',
        key: '/teacher/person/main'
    }
];
export default adminMenuList;