(function () {
    // 注册账号和登录界面切换
    $("#link_reg").on("click", function () {
        $("#resign").show();
        $("#login").hide();
    });
    $("#link_login").on("click", function () {
        $("#login").show();
        $("#resign").hide();
    });

    // layui自定义表单验证规则
    let form = layui.form;
    let layer = layui.layer;
    // 通过form.verify()函数自定义验证规则
    form.verify({
        // 自定义 pwd 规则
        pwd: [/^[\S]{6,12}$/, "密码必须6-12位，不能有空格"],
        // 校验两次密码是否一致的规则
        repwd: function (value) {
            // 通过形参拿到的是确认密码框的内容
            // 通过获取元素拿到密码框的内容
            // 将两者进行判断,如果失败,返回一个提示消息
            let pwd = $(".resign [name=password]").val();
            if (pwd !== value) {
                return "两次密码不一致！";
            }
        },
    });

    // 监听注册表单的提交事件
    $("#resign").on("submit", function (e) {
        // 阻止默认事件
        e.preventDefault();
        // 发起POST请求
        $.post(
            "/api/reguser",
            {
                username: $("#form_reg [name=username]").val(),
                password: $("#form_reg [name=password]").val(),
            },
            function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message);
                }
                layer.msg("注册成功，请登录");
                // 成功以后调用去登录的点击事件，自动跳转到登录界面
                $("#link_login").click();
                // 自动填充注册的用户名和密码
                $("#login-ipt-username").val(
                    $("#form_reg [name=username]").val()
                );
                $("#login-ipt-pwd").val($("#form_reg [name=password]").val());
            }
        );
    });

    // 监听登录表单的提交事件
    $("#form_login").submit(function (e) {
        // 阻止默认行为
        e.preventDefault();
        // 发起ajax的post请求
        $.ajax({
            type: "POST",
            url: "/api/login",
            data: $(this).serialize(), // .serialize()快速获取表单内容
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("登录失败！");
                }
                layer.msg("登录成功！即将跳转到主页");
                // 将登录成功得到的 token 值，存到localStorage中
                localStorage.setItem("token", res.token);
                // console.log(res.token);

                // 延时跳转到后台主页
                (function () {
                    let delay;
                    delay = setTimeout(() => {
                        location.href = "/index.html";
                    }, 1000);
                })();
            },
        });
    });
})();
