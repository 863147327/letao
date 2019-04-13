$(function(){

    login();
    // 定义一个登录功能的函数
    function login(){
        //给登录按钮添加点击事件
        $(".btn-login").on("tap",function(){
            //获取当前的用户名
            var username = $(".username").val().trim();
            if(!username){
                mui.toast("请输入用户名",{
                    duration: 1000,
                    type: "div"
                })
                return;
            }
            //获取当前输入的密码
            var password = $(".password").val().trim();
            if(!password){
                mui.toast("请输入密码",{
                    duration: 1000,
                    type: "div"
                })
            }
            // 调用登录API实现登录功能
            $.ajax({
                url: "/user/login",
                type: "post",
                data: {
                    username: username,
                    password: password,
                },
                success: function(data){
                    if(data.error){
                        console.log(data.message);
                        mui.toast(data.message,{
                            duration: 1000,
                            type: "div"
                        })
                    }else{
                        // 如果进入这里表示成功,获取当前要返回的页面
                        var returnUrl = getQueryString("returnUrl");
                        location = returnUrl;
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