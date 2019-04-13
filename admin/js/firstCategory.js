// 由于commonjs里面也需要这2个变量 做成全局变量
var currentPage = 1;
var totalPages = 1;
$(function(){

    queryTopCategory();
    addCategory();

    // 查询分类的函数
    function queryTopCategory(){

        // 请求分类
        $.ajax({
            url: '/category/queryTopCategoryPaging',
            data: {
                page: currentPage,
                pageSize: 5
            },
            success: function(data){
                console.log(data);
                var html = template("tpl",data);
                $('#info table tbody').html(html);
                // 计算分页总数
                totalPages = Math.ceil(data.total/data.size);
                // 请求完数据初始化分页
                initPage(function(){
                    queryTopCategory();
                })
            }
        })
    }

    // 添加分类的函数
    function addCategory(){
        $(".btn-save").on("click",function(){
            // 获取输入的分类名称
            var categoryname = $(".category-name").val().trim();
            if(!categoryname){
                alert("请输入分类名称");
                return false;
            }
            if(categoryname.length>3){
                alert("输入的分类名称长度不能大于3");
                return false;
            }
            // 发请求
            $.ajax({
                url: '/category/addTopCategory',
                type: "post",
                data: {
                    categoryName:categoryname,
                },
                success: function(data){
                    if(data.success){
                        queryTopCategory();
                        $(".category-name").val("");
                    }
                }
            })
        })
    }
})