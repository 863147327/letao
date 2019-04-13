$(function(){


    login();
    
        //写一个登陆的函数
        function login(){
            // 给登录按钮添加点击事件
            $(".btn-login").on("click",function(){
                // 获取用户名
                var username = $("#username").val().trim();
                // 判断用户名非空
                if(username == ""){
                    alert("请输入用户名");
                    return false;
                }
                // 获取密码
                var password = $("#password").val().trim();
                // 判断用户名非空
                if(password == ""){
                    alert("请输入密码");
                    return false;
                }
                // 发请求
                $.ajax({
                    url: "/employee/employeeLogin",
                    type: "post",
                    data: {
                        username: username,
                        password: password,
                    },
                    success: function(data){
                        if(data.error){
                            alert(data.message);
                            return;
                        }else{
                            location = "index.html";
                        }
                    }
                })
            })
        }
    })