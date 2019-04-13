$(function () {
    // 调用函数
    initLeft();
    initRight();
    queryTopcategory();
    querySecondCategory(1);

    // 初始化区域滚动插件
    // 初始化左侧不要滚动条
    function initLeft() {
        mui('.category-left .mui-scroll-wrapper').scroll({
            indicators: false, //是否显示滚动条
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    }
    // 初始化右侧 需要滚动条
    function initRight() {
        mui('.category-right .mui-scroll-wrapper').scroll({
            indicators: true, //是否显示滚动条
            deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
        });
    }
    // 实现左侧分类的数据渲染
    function queryTopcategory() {
        $.ajax({
            url: "/category/queryTopCategory",
            success: function (data) {
                var html = template("categoryLeftTpl", data);
                $(".category-left .mui-table-view").html(html);
                toggleSecondCategory();
            }
        })
    }


    //切换右侧数据
    function toggleSecondCategory() {
        var lis = $(".category-left ul li");
        lis.on("tap", function () {
            var id = $(this).data("id");
            querySecondCategory(id);
            $(this).addClass('active').siblings().removeClass('active');
        })
    }



    // 实现右侧分类的数据渲染
    function querySecondCategory(id) {
        $.ajax({
            url: "/category/querySecondCategory",
            data: {
                id: id
            },
            success: function (data) {
                console.log(data);
                var html = template("categoryRightTpl", data);
                $(".category-right .mui-row").html(html);
            }
        })

    }


})