$(function () {
    let form = layui.form;
    let layer = layui.layer;

    // 自定义昵称验证规则
    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return "昵称长度必须在1 ~ 6个字符之间！";
            }
        },
    });

    // 调用获取用户信息
    initUserInfo();

    // 获取用户信息函数
    function initUserInfo() {
        $.ajax({
            type: "GET",
            url: "/my/userinfo",
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取用户信息失败！");
                }
                // console.log(res);
                // 调用form.val()方法快速为表单赋值
                form.val("formUserInfo", res.data);
            },
        });
    }

    // 重置表单数据事件
    $("#btnReset").on("click", function (e) {
        // 阻止表单默认重置行为
        e.preventDefault();
        // 调用获取用户信息函数
        initUserInfo();
    });

    // 监听表单的提交事件
    $(".layui-form").on("submit", function (e) {
        // 阻止表单的默认提交行为
        e.preventDefault();
        // 发起ajax更新数据请求
        $.ajax({
            type: "POST",
            url: "/my/userinfo",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("更新用户信息失败！");
                }
                layer.msg("更新用户信息成功");
                // 调用父页面index的方法，重新渲染用户的头像和用户信息
                // 当前的页面是在iframe框架下，所以当前页面的window指iframe，iframe的parent指的就是index
                window.parent.getUserInfo();
            },
        });
    });
});
