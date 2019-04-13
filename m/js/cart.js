$(function () {

    // queryCart();

    pullRefresh();
    editor();
    deleteCart();
    // 声明一个函数用来查询购物车商品数据
    function queryCart() {
        $.ajax({
            url: "/cart/queryCart",
            success: function (res) {
                console.log(res);
                // 调用模板
                var html = template("tpl", {
                    data: res
                });
                $(".cart-list").html(html);
                // 区域滚动购物车列表
                mui(".mui-scroll-wrapper").scroll({
                    deceleration: 0.0005,
                })
            }
        })
    }

    // 购物车列表下拉刷新和上拉加载
    function pullRefresh(params) {
        mui.init({
            pullRefresh: {
                container: ".mui-scroll-wrapper",
                down: {
                    // 当初始化完成下拉刷新后马上自动触发一次下拉刷新
                    auto: true,
                    // 下拉刷新的回调函数
                    callback: pulldownRefresh
                },
                up: {
                    // 上拉加载的回调函数
                    contentrefresh: "正在加载...",
                    callback: pullupRefresh
                }
            }
        })

        
        // 下拉刷新具体业务实现
        function pulldownRefresh() {
            setTimeout(function () {
                queryCartPaging();
                page =1;
            }, 1000)
        }
        var page = 1;
        // 上拉加载具体业务实现
        function pullupRefresh() {
            setTimeout(function () {
                page++;
                //发送请求
                $.ajax({
                    url: '/cart/queryCartPaging',
                    data: {
                        page: page,
                        pageSize: 4
                    },
                    success: function (res) {
                        if (res.data) {
                            var html = template("tpl", res);
                            $(".cart-list").append(html);
                            // 结束上拉加载
                            mui("#pullrefresh").pullRefresh().endPullupToRefresh();
                        } else {
                            // 提示没有数据
                            mui("#pullrefresh").pullRefresh().endPullupToRefresh(true);
                        }
                    }
                })
            }, 1000)
        }
    }


    // 给编辑注册点击事件
    function editor() {
        $(".cart-list").on("tap", "#editor", function () {
            var li = $(this).parent().parent();
            // 获取到绑定在编辑里面的数据
            var data = $(this).data("product");
            // console.log(data);
            var min = data.productSize.split("-")[0];
            var max = data.productSize.split("-")[1];
            // 定义一个新的尺码数组,把每个尺码加进去
            data.productSize = [];
            // 遍历尺码
            for (var i = min; i <= max; i++) {
                data.productSize.push(i);
            }
            //调用编辑购物车的模板
            var html = template("editorTpl", data);
            html = html.replace(/[\r\n]/g, "");
            mui.confirm(html, '编辑商品', ['确定', '取消'], function (e) {
                if (e.index == 0) {
                    // 获取新的尺码
                    var size = $(".btn-size.mui-btn-warning").data("size");
                    // 获取新的数量
                    var num = mui('.mui-numbox').numbox().getValue();
                    // 调用API发送请求
                    $.ajax({
                        url: "/cart/updateCart",
                        type: "post",
                        data: {
                            id: data.id,
                            size: size,
                            num: num
                        },
                        success: function (data) {
                            if (data.success) {
                                queryCartPaging();
                            }
                        }
                    })
                } else {
                    mui.swipeoutClose(li[0]);
                }
            })
            // 4. 等弹框出来渲染完成后再初始化尺码和数量
            // 4.1 初始化数字框（也是组件也是动态生成的 也要手动初始化） 基本上初始化组件都是选择组件的大容器
            mui('.mui-numbox').numbox();
            // 4.1 让尺码能够点击也是在渲染完成后加事件和添加类名等 这个时候已经出来了不需要委托
            $('.btn-size').on('tap', function () {
                $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
            });
        })
    }

    // 购物车删除函数
    function deleteCart() {
        $(".cart-list").on("tap", "#delete", function () {
            var id = $(this).data("id");
            var li = $(this).parent().parent();
            // 弹出确认框
            mui.confirm("确认删除该商品吗?", "温馨提示", ["确认", "取消"], function (e) {
                if (e.index == 0) {
                    // 发送请求
                    $.ajax({
                        url: "/cart/deleteCart",
                        data: {
                            id: id
                        },
                        success: function (data) {
                            if (data.success) {
                                li.remove();
                                queryCartPaging();
                            }
                        }
                    })
                }else{
                    mui.swipeoutClose(li[0]);
                }
            })

        })
    }



    // 分页查询的函数
    function queryCartPaging() {
        // 发送请求
        $.ajax({
            url: '/cart/queryCartPaging',
            data: {
                page: 1,
                pageSize: 5,
            },
            success: function (res) {
                if (res.error) {
                    // 跳转到登录页面
                    location = "login.html?returnUrl=" + location.href;
                } else {
                    var html = template("tpl", res);
                    $(".cart-list").html(html);
                    mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed                  
                    // 5. 下拉刷新完成后要重置上拉加载的效果 (注意一定要等结束转圈圈再重置)
                    mui('#pullrefresh').pullRefresh().refresh(true);
                    // 6. 数据也要重置为第一页开始
                    page = 1;
                    // 数据渲染之后,计算总金额
                    getSum();
                    $(".mui-checkbox input").on("change", function () {
                        getSum();
                    })
                }
            }
        })
    }

    // 计算总金额
    function getSum() {
        // 获取所有选中的复选框
        var checkeds = $(".mui-checkbox input:checked");
        var sum = 0;
        checkeds.each(function (index, value) {
            // 获取商品单价
            var price = $(value).data("price");
            // 获取商品的数量
            var num = $(value).data("num");
            // 计算金额
            var count = price * num;
            sum += count;
        })
        // 保留两位小数
        sum = sum.toFixed(2);
        // 把金额渲染到页面上
        $(".order-count span").html(sum);


    }
})