$(function () {
    var search;
    var page = 1;
    //在商品列表页面根据地址栏参数互殴当前搜索的关键字,获取中文可能是一个乱码,必须解码才能使用
    //如果参数只有一个才可以使用 只要参数多了就无法使用了
    // var search = decodeURL(location.search.split("=")[1]);
    // "调用封装好的获取url参数的方法,传入参数名获取参数的值"
    // var search = getQueryString("search");
    // var time = getQueryString("time");
    // var rsv_pq = getQueryString("rsv_pq");
    searchProduct();
    nowSearchProduct();
    sortProduct();
    pullRefresh();
    gotoDetail();
    //定义一个搜索商品的函数
    function searchProduct() {
        /*
        获取url search参数的值 跟这个参数的值来搜索
        调用api接口,把这个参数传递给api
        接受后台返回的数据 创建模板
        渲染到商品列表里面
        */
        // 调用封装的函数获得url参数
        search = getQueryString("search");
        //调用封装好的函数使用ajax请求商品列表
        queryProduct({
            proName: search,
        })
    }

    // 定义一个当前页面商品搜索的函数
    function nowSearchProduct() {
        $(".btn-search").on("tap", function () {
            //获取当前输入内容
            search = $(".input-search").val().trim();
            if (search == "") {
                return;
            }
            // 调用函数去搜索商品,把当前的search作为实参传递过去
            queryProduct({
                proName: search,
                page: 1,
                pageSize: 4,
            })
            console.log(search);
        })
    }

    // 把公公请求API 传参 调用模板 渲染页面公共代码封装到一个函数里面 因为请求参数很多一个一个传很麻烦,推荐使用对象
    //params就是参数对象 接受一个传递过来的参数对象 里面有page pageSize proName等数据
    function queryProduct(params) {
        params.page = params.page || 1;
        params.pageSize = params.pageSize || 2;
        // 使用ajax请求商品列表API;
        $.ajax({
            url: "/product/queryProduct",
            data: params,
            success: function (res) {
                // console.log(res);
                // console.log(res.data);
                var html = template("tpl", res);
                $(".product-list .mui-row").html(html);
                // 8. 把上拉加载的效果也要重置 这个文档没错
                mui('#pullrefresh').pullRefresh().refresh(true);
                    page =1;

            }
        })

    }


    //商品的排序
    function sortProduct() {
        /* 
        点击排序按钮做排序
        要知道惦记的是价格还是销量,为了区分可以给标签设置一个排序方法的属性在a标签上
        点击的时候取得排序的方法属性 data-type  做对应的排序
        还要获得排序的顺序.把顺序也设置到标签上,通过data-sort设置当前的排序顺序
        判断排序顺序,如果是1 升序 如果是2 降序  要改成对应的数字
        最后传入排序类型和殊勋
        获取到数据调用模板 渲染模板
        */

        // 给所有按钮添加点击事件
        $(".product-list .mui-card-header a").on("tap", function () {
            // 获取当前的排序类型
            var type = $(this).data("type");
            // 获取当前排序的顺序
            var sort = $(this).data("sort");
            if (sort == 1) {
                sort = 2;
                $(this).find("i").removeClass("fa-angle-down").addClass("fa-angle-up");
            } else {
                sort = 1;
                $(this).find("i").removeClass("fa-angle-up").addClass("fa-angle-down");
            }
            //把修改后的sort保存到标签上
            $(this).data("sort", sort);
            // 切换类名,
            $(this).addClass("active").siblings().removeClass("active");
            // 调用公共请求商品列表函数和渲染函数
            var obj = {
                parName: search,
                page: 1,
                pageSize: 2
            }
            // 给对象动态添加一个动态的属性和值
            obj[type] = sort;
            // 调用公共函数去查询商品列表
            queryProduct(obj);
        })
    }

    function pullRefresh() {

     
        // 下拉刷新和上拉加载
        mui.init({
            pullRefresh: {
                container: '#pullrefresh',
                down: {
                    callback: pulldownRefresh
                },
                up: {
                    contentrefresh: '正在加载...',
                    callback: pullupRefresh
                }
            }
        });
        /**
         * 下拉刷新具体业务实现
         */
        function pulldownRefresh() {
            setTimeout(function () {
                console.log(search);
                queryProduct({
                    proName: search,
                    page: 1,
                    pageSize: 2
                })
                mui('#pullrefresh').pullRefresh().endPulldownToRefresh(); //refresh completed
                
            }, 1500);
        }
        
        /**
         * 上拉加载具体业务实现
         */
        function pullupRefresh() {
            setTimeout(function () {
                page++;
                $.ajax({
                    url: '/product/queryProduct',
                    data: {
                        page: page,
                        pageSize: 2,
                        proName: search
                    },
                    success: function (res) {
                        if (res.data.length > 0) {
                            var html = template("tpl", res);
                            // 5. 渲染使用追加渲染 使用append 追加dom元素到mui-row（不能使用html）
                            $('.product-list .mui-row').append(html);
                            // 6. 有数据还是要结束转圈圈 只是不需要传参
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh();
                           
                        } else {
                            mui('#pullrefresh').pullRefresh().endPullupToRefresh(true); //参数为true代表没有更多数据了。
                        }
                    }
                })
            }, 1500);
        }
    }

    // 跳转到商品详情
    function gotoDetail(){
        //给购买按钮添加点击事件,动态委托
        $(".product-list").on("tap",".product-buy",function(){
            var id = $(this).data("id");
            console.log(id);
            location = "detail.html?id="+id;
        })
    }





    // 使用正则匹配url参数,返回这个匹配成功的值,根据参数名获取参数的值
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            // console.log(r);
            // 别人之前使用unescape 方式解密  但是我们默认是encodeURI加密 使用 decodeURI 解密
            return decodeURI(r[2]);
        }
        return null;
    }
})