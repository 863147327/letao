$(function(){
    
    addHistory();
    queryHistory();
    deleteHistory();
    clearHistory();
    //区域滚动初始化
    mui('.mui-scroll-wrapper').scroll({
        deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
    });


    // 添加记录的函数
    function addHistory(){
        //思路
            // 数据储存在localstorage中,除非手动删除,不然永远存在
            // 点击搜索按钮获取关键字
            // 把这个关键字添加到本地储存localstorage中
            //以数组的方式添加(因为有可能会有很多记录)
            $(".btn-search").on("tap",function(){
                // 获得搜索文字,并且去掉空格
                var search = $("#input-search").val().trim();
                // 做非空判断
                if(search == ""){
                    return;
                }
                //要在原来的记录里把数据取出来,不然每一次都是重新声明一个数据,会替换掉之前的数据
                var arr = localStorage.getItem("searchHistory");
                if(arr == null){
                    arr = [];
                }else {
                    arr = JSON.parse(arr);
                }

                // 创建空的数组来记录历史
                // var arr =[];
                // 调用一个函数把数组去重
                arr = uniq(arr);
                // 判断当前的值在不在数组中
                for(var i = 0; i < arr.length; i++){
                    if(arr[i] == search){
                        arr.splice(i,1);
                        i--;
                    }
                }
                arr.unshift(search);
                localStorage.setItem("searchHistory",JSON.stringify(arr));

                // 清空搜索框
                $("#input-search").val('');
                queryHistory();
                // 记录添加完成后就跳转到商品列表页面 由于按钮不是a链接只能使用js localtion对象去跳转
                // 跳转页面的文件路径参照是当前search.html这个页面而不是search.js文件
                // 由于这个当前输入搜索关键字在商品列表需要这个值通过url参数传递过去
                location = 'productlist.html?search='+search+"&time="+new Date().getTime()+"&rsv_pq=fsdfdsf1231231";
 
            })
    }
})
// 数组去重的函数
function uniq (array){
    var temp=  [];
    for (var i = 0; i < array.length; i++) {
        if(temp.indexOf(array[i])){
            temp.push(array[i]);
        }
    }
    return temp;
}

// 查询记录的函数

function queryHistory (){
    // 吧之前的数据取出来
    // 判断本地储存有没有数据
    // 把数据渲染到页面上
    var arr = localStorage.getItem("searchHistory");
    if(arr == null){
        arr = [];
    }else {
        arr = JSON.parse(arr);
    }
    // 调用引擎模板
    var html = template("tpl",{rows:arr});
    $(".search-history ul").html(html);

}

// 删除记录的函数
function deleteHistory(){
    // 给span设置点击事件
    // 获取到这一行对应的id
    // 通过id删除数组中的这一个数据
    
    $(".mui-table-view").on("tap",".btn-delete",function(){
        var index = $(this).data("index");
        // console.log(index);
        var arr = localStorage.getItem("searchHistory");
        if(arr == null){
            arr = [];
        }else {
            arr = JSON.parse(arr);
        }
        // console.log(arr);
        arr.splice(index,1);
        // console.log(arr);
        localStorage.setItem("searchHistory",JSON.stringify(arr));
        queryHistory();
    })
}

// 清空记录的函数
function clearHistory(){
    $(".fa-trash").on("tap",function(){
        localStorage.removeItem("searchHistory");
        queryHistory();
    })
}