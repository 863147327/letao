// 当前页面
var currentPage = 1;
// 总页面
var totalPages = 1;

$(function () {
    updataUser();
    queryUser();
    logout();
    // 查询用户信息的函数
    function queryUser() {
        $.ajax({
            url: '/user/queryUser',
            data: {
                page: currentPage,
                pageSize: 5
            },
            success: function (data) {
                console.log(data);
                // 调用模板
                var html = template("tpl", data);
                $("#info table tbody").html(html);
                // 通过数据来计算分页的总数, 总页面= 总条数/每页大小,向上取整
                totalPages = Math.ceil(data.total / data.size);
                // 初始化分页
                initPage(function () {
                    queryUser();
                })
            }
        })
    }

    // 改变用户状态
    function updataUser(){
        $("#info table tbody").on("click",".btn-option",function(){
        
            // 取到按钮上的id和状态
            var id = $(this).data("id");
            var isDelete = $(this).data("isDelete");
            // 判断isDelete的值,0改为1 1改为0
            isDelete = isDelete ? 0 : 1;
            // 发请求
            $.ajax({
                url: "/user/updateUser",
                type: "post",
                data: {
                    id:id,
                    isDelete: isDelete
                },
                success: function(data){
                    console.log(data);
                    if(data.success){
                        queryUser();
                    }
                }
            })
        })

    }

    

})