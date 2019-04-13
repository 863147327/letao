var currentPage = 1;
var totalPages = 1;
$(function(){

    querySecondCategory();
    addBrand();
    // 获取分类数据的函数
    function querySecondCategory(){
        $.ajax({
            url: "/category/querySecondCategoryPaging",
            data: {
                page:currentPage,
                pageSize:5,
            },
            success: function(data){
                // console.log(data);
                var html = template("tpl",data);
                $("#info table tbody").html(html);
                // 计算总页数
                totalPages = Math.ceil(data.total / data.size);
                // 渲染页面之后初始话分页页码
                initPage(function(){
                    querySecondCategory();
                })
            }
        })
    }

    // 添加品牌函数
    function addBrand(){
        $(".btn-add-brand").on("click",function(){
            // 请求一级分类的数据
            $.ajax({
                url: "/category/queryTopCategory",
                success: function(data){
                    console.log(data);
                    var html = "";
                    for( var i = 0;i<data.rows.length;i++){
                        html+="<option value="+data.rows[i].id+">"+data.rows[i].categoryName+"</option>"
                    }
                    $(".select-category").html(html);
                }
            })
        })

        // 图片长传
        $(".select-img").on("change",function(){
            var file = this.files[0];
            console.log(file);
            // 非空判断
            if(!file){
                alert("请选择图片");
                return;
            }
            // 
            // 新建一个FormData格式的对象,(图片文件只有放到这里才能传,图片不能直接传到后台)
            var formData = new FormData;
            formData.append("pic1",file);
            // 发请求
            $.ajax({
                url: "/category/addSecondCategoryPic",
                data: formData,
                // 防止数据转成字符串
                processData: false,
                // 防止浏览器使用这种编码对文加加密
                contentType: false,
                // 取消浏览器的缓存
                cache: false,
                success: function(data){
                    $("brand-logo").attr("src",data.picAddr);
                }
            })
        })

        // 点击保存添加分类
         $('.btn-save').on('click', function () {
            // 获取选择的分类id 品牌名称 图片路径
            var categoryId = $('.select-category').val();
            console.log(categoryId);
            var brandName = $('.brand-name').val().trim();
            console.log(brandName);
            if (!brandName) {
                alert('请输入品牌名称');
                return false;
            }
            var brandLogo = $('.brand-logo').attr('src');
            console.log(beandLogo);
            if (!brandLogo) {
                alert('请选择图片');
                return false;
            }
            // 发送请求
            $.ajax({
                url: "/category/addSecondCategory",
                data: {
                    categoryId: categoryId,
                    brandLogo: brandLogo,
                    brandName: brandName,
                    hot: 1
                },
                success: function(data){
                    if(data.success){
                        querySecondCategory();
                    }
                }
            })
        })
    }
})
