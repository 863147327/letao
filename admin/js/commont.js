// 退出登录的函数
function logout() {
    $(".exit").on("click",function(){
        // 调用请求
        $.ajax({
            url: "/employee/employeeLogout",
            success:function(data){
                if(data.success){
                    location = "login.html";
                }
            }
        })
    })
}

// 分页模板初始化函数
function initPage(callback){
    $("#page").bootstrapPaginator({
        bootstrapMajorVersion: 3, //对应的bootstrap版本
        currentPage: currentPage, //当前页面显示第几页
        numberOfOages: 10, //每次显示页数 每次显示多少个按钮
        totalPages: totalPages, //总页数 总共多少页
        shouldShowPage: true, //是否显示分页按钮
        useBootStrapTooltip: true, //使用bootstrap工具提示
        //点击事件,点击每一个按钮
        onPageClicked:function(event,originalEvent,type,page){
            // 触发分页按钮点击的时候,修改全局变量currentPage的值为当前点击的page
            currentPage = page;
            // 参数是一个回调函数,调用这个回调函数请求和渲染
            callback();
        }
    })
}