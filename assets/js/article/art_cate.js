$(function () {
    let layer = layui.layer;
    let form = layui.form;

    initArtCateList();

    // 获取文章分类列表
    function initArtCateList() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取文章列表失败！");
                }
                // console.log(res);
                // 模板引擎渲染
                let htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
            },
        });
    }

    // 为添加类别按钮绑定点击事件
    let indexAdd = null;
    $("#btnAddCate").on("click", function () {
        // 打开弹出层有个返回值，用于之后关闭弹出层
        indexAdd = layer.open({
            type: 1,
            area: ["500px", "250px"], // 指定宽高
            title: "添加分类",
            content: $("#dialog-add").html(),
        });
    });

    // 通过事件委托，为 form-add 表单动态绑定 submit 事件
    // 因为 form-add 是动态添加的，所以无法直接绑定
    $("body").on("submit", "#form-add", function (e) {
        e.preventDefault();
        // console.log("ok");
        $.ajax({
            type: "POST",
            url: "/my/article/addcates",
            data: $("#form-add").serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("新增文章分类失败！");
                }
                initArtCateList();
                layer.msg("新增文章分类成功！");
                // 根据索引关闭对应弹出层
                layer.close(indexAdd);
            },
        });
    });

    // 通过事件委托，为btn-edit按钮绑定点击事件
    let indexEdit = null;
    $("tbody").on("click", ".btn-edit", function () {
        // console.log(11);
        // 打开弹出层有个返回值，用于之后关闭弹出层
        indexEdit = layer.open({
            type: 1,
            area: ["500px", "250px"], // 指定宽高
            title: "修改分类信息",
            content: $("#dialog-edit").html(),
        });

        // 拿到所属的id
        let id = $(this).attr("data-id");
        console.log(id);
        // 发起请求获取对应id的数据
        $.ajax({
            type: "GET",
            url: "/my/article/cates/" + id,
            success: function (res) {
                console.log(res);
                if (res.status !== 0) {
                    return layer.msg("获取文章分类信息失败！");
                }
                // console.log(res);
                form.val("form-edit", res.data);
            },
        });
    });

    // 通过事件委托，为修改分类的表单绑定 submit 事件
    $("body").on("submit", "#form-edit", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/article/updatecate",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新分类数据失败！");
                }
                layer.msg("更新分类数据成功！");
                layer.close(indexEdit);
                initArtCateList();
            },
        });
    });

    // 通过事件委托，为删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function () {
        let id = $(this).attr("data-id");
        console.log(id);
        // 提示框，二次却认是否删除
        layer.confirm(
            "确认删除？",
            { icon: 3, title: "提示" },
            function (index) {
                $.ajax({
                    type: "GET",
                    url: "/my/article/deletecate/" + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg("删除分类失败！");
                        }
                        layer.msg("删除分类成功！");
                        layer.close(index);
                        initArtCateList();
                    },
                });
            }
        );
    });
});
