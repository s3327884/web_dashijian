$(function () {
    let form = layui.form;

    // 定义密码验证规则
    form.verify({
        pwd: [/^[\S]{6,12}$/, "密码必须6 ~ 12位，且不能出现空格"],
        samePwd: function (value) {
            if (value === $("[name=oldPwd]").val()) {
                return "新旧密码不能相同";
            }
        },
        rePwd: function (value) {
            if (value !== $("[name=newPwd]").val()) {
                return "两次输入密码不一致";
            }
        },
    });

    // 发起ajax请求提交新密码
    $(".layui-form").on("submit", function (e) {
        e.preventDefault();
        $.ajax({
            type: "POST",
            url: "/my/updatepwd",
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("更新密码失败！");
                }
                layui.layer.msg("更新密码成功！");

                // DOM原生方法重置表单
                $(".layui-form")[0].reset();
            },
        });
    });
});
