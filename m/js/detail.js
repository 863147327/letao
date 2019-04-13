$(function () {
    // 使用正则函数得到id
    var id = getQueryString('id');
    queryProductDetial();
    addCart();

    //查询商品详情
    function queryProductDetial() {
        $.ajax({
            url: '/product/queryProductDetail',
            data: {
                id: id
            },
            success: function (data) {
                console.log(data);
                // 取到尺码
                var min = +data.size.split("-")[0];
                var max = +data.size.split("-")[1];
                //定义一个空数组把尺码存进去
                data.size = [];
                // 遍历min到max
                for (i = min; i <= max; i++) {
                    data.size.push(i);
                }
                var html = template("tpl", data);
                $("#main").html(html);
                // 在页面渲染完成之后初始化组件,因为之前页面是没有内容的,只有渲染完成之后页面才会有组件
                
                // 轮播图
                //获得slider插件对象
                var gallery = mui('#slider');
                gallery.slider({
                    interval: 3000 //自动轮播周期，若为0则不自动播放，默认为0；
                });
                // 数字输入框初始化
                mui(".mui-numbox").numbox().getValue();
                // 初始化尺码点击
                $('.btn-size').on('tap', function () {
                    $(this).addClass('mui-btn-warning').siblings().removeClass('mui-btn-warning');
                });
                // 区域滚动
                mui('.mui-scroll-wrapper').scroll({
                    deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
                });
            }
        })
    }

    // 加到购物车
    function addCart (){
        //给购物车加点击事件
        $(".btn-add-cart").on("tap",function(){
            //获取尺码
            var size = $(".btn-size.mui-btn-warning").data("size");
            console.log(size)
            if(!size){
                mui.toast('请选择尺码',{
                    duration: 1000,
                    type: "div",
                });
                return;
            }
            // 获取当前选择的数量
            var num = mui(".mui-numbox").numbox().getValue();
            // 调用加入购物车的API去加入购物车
            $.ajax({
                url: "/cart/addCart",
                type: "post",
                data: {
                    productId: id,
                    num: num,
                    size: size,
                },
                success: function(data){
                    console.log(data);
                    if(data.error){
                        location = 'login.html?returnUrl=' + location.href;
                    }else{
                        mui.confirm('您确定要去购物车看看嘛？', '温馨提示', ['确定','取消'], function(e) {
                            if (e.index == 0) {
                                location = "cart.html";
                            } else {
                                mui.toast('请继续添加!', {
                                    duration: 1000,
                                    type: 'div'
                                });
                            }
                        })
                    }
                }
            })
        })
    }


    // 使用正则匹配url参数 返回这个匹配成功的值 根据参数名获取参数的值
    function getQueryString(name) {
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');
        var r = window.location.search.substr(1).match(reg);
        if (r != null) {
            console.log(r);
            // 别人之前使用unescape 方式解密  但是我们默认是encodeURI加密 使用 decodeURI 解密
            return decodeURI(r[2]);
        }
        return null;
    }
})