(function () {
    // 调用用户基本信息请求函数
    getUserInfo();

    // 绑定一个退出登录事件
    $("#btnLogout").on("click", function () {
        // 二次确认是否退出
        layer.confirm(
            "是否确认退出登录？",
            { icon: 3, title: "提示" },
            function (index) {
                // 1. 清空本地储存中的 token
                localStorage.removeItem("token");
                // 2. 重新跳转到登录页面
                location.href = "../../login.html";

                // 点击取消关闭二次确认框
                layer.close(index);
            }
        );
    });
})();

// 获取用户基本信息
function getUserInfo() {
    $.ajax({
        type: "GET",
        url: "/my/userinfo",
        // headers 请求头的配置对象，统一写在baseAPI中
        // headers: {
        //     // 从本地储存中调用
        //     Authorization: localStorage.getItem("token") || "",
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg("获取用户信息失败");
            }
            // 调用 renderAvatar 函数渲染用户头像
            // console.log(res);
            renderAvatar(res.data);
        },

        // 无论成功还是失败，最终都会调用 complete 回调函数，已写到baseAPI中
        // complete: function (res) {
        //     // 在 complete 回调函数中，可以使用 res.responseJSON 拿到服务器响应回来的数据
        //     if (
        //         res.responseJSON.status === 1 &&
        //         res.responseJSON.message === "身份认证失败！"
        //     ) {
        //         // 1. 强制清空token
        //         localStorage.removeItem("token");
        //         // 2. 强制跳转到登录页面
        //         location.href = "../../login.html";
        //     }
        // },
    });
}

// 渲染用户头像
function renderAvatar(user) {
    // 1. 渲染欢迎***，如果有昵称，先用昵称，没有昵称就用用户名
    let uname = user.nickname || user.username;
    $("#welcome").html("欢迎&nbsp;&nbsp;" + uname);
    // 2. 渲染用户的头像，如果 user_pic 有内容，则渲染头像，否则渲染文本头像
    if (user.user_pic !== null) {
        // 2.1 渲染图片头像
        $(".layui-nav-img").attr("src", user.user_pic).show();
        $(".text-avatar").hide();
    } else {
        // 2.2 渲染文本头像
        $(".layui-nav-img").hide();
        let first = uname[0].toUpperCase();
        $(".text-avatar").html(first).show();
    }
}
