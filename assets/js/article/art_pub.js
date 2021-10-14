$(function () {
    let layer = layui.layer;
    let form = layui.form;

    // 富文本编辑初始化
    initEditor();

    initCate();
    // 加载文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取文章分类失败！");
                }
                // console.log(res.data);
                // 调用模板引擎，渲染分类的下拉菜单
                let htmlStr = template("tpl-cate", res);
                $("[name=cate_id]").html(htmlStr);
                // 因为是动态渲染，所以一定要调用form.render方法重新渲染
                form.render();
            },
        });
    }

    // 文章封面照片的裁剪加载
    // 1. 初始化图片裁剪器
    let $image = $("#image");

    // 2. 裁剪选项
    let options = {
        aspectRatio: 400 / 280,
        preview: ".img-preview",
    };

    // 3. 初始化裁剪区域
    $image.cropper(options);
    // ------------------------------

    // 用户自己上传封面照片
    $("#btnChooseImage").on("click", function () {
        $("#coverFile").click();
    });
    // 为文件选择框绑定change事件
    $("#coverFile").on("change", function (e) {
        // 获取用户选择的文件
        let filelist = e.target.files;
        if (filelist.length === 0) {
            return; // layer.msg("请选择封面图片！");
        }
        // 1. 拿到用户所选择的文件
        let file = e.target.files[0];
        // 2. 将文件转换为路径
        let newImgURL = URL.createObjectURL(file);
        // 3. 重新初始化裁剪区域
        $image
            .cropper("destroy") // 销毁旧的裁剪区域
            .attr("src", newImgURL) // 重新设置图片路径
            .cropper(options); // 重新初始化裁剪区域
    });

    // 定义文章的发布状态
    let art_state = "已发布";

    // 为存为草稿按钮绑定点击事件
    $("#btnSave2").on("click", function () {
        art_state = "草稿";
    });

    // 为表单绑定submit提交事件
    $("#form-pub").on("submit", function (e) {
        // 1. 阻止表单的默认提交行为
        e.preventDefault();
        // 2. 基于 form 表单，快速创建一个FormData对象
        let fd = new FormData($(this)[0]);
        // 3. 将文章的发布状态存到fd中
        fd.append("state", art_state);
        // 4. 将裁剪过后的封面图片，输出为一个文件对象
        $image
            .cropper("getCroppedCanvas", {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280,
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存到 fd 中
                fd.append("cover_img", blob);
                // 6. 调用函数，发起 ajax 请求
                publishArticle(fd);
            });

        // console.log(fd);
        // fd.forEach(function (value, key) {
        //     console.log(key, value);
        // });
    });

    // 定义一个发布文章的方法
    function publishArticle(fd) {
        $.ajax({
            type: "POST",
            url: "/my/article/add",
            data: fd,
            // 注意，如果向服务器提交的是 FormData 格式的数据，必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("发布文章失败！");
                }
                layer.msg("发布文章成功！");
                // 并且跳转到文章列表页面
                location.href = "/article/art_list.html";
            },
        });
    }
});
