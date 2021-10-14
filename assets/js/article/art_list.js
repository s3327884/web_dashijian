$(function () {
    let form = layui.form;
    let laypage = layui.laypage;

    // 定义美化时间的过滤器
    template.defaults.imports.dateFormat = function (date) {
        const dt = new Date(date);

        let yyyy = dt.getFullYear();
        let mm = padZero(dt.getMonth() + 1);
        let dd = padZero(dt.getDate());

        let hour = padZero(dt.getHours());
        let min = padZero(dt.getMinutes());
        let sec = padZero(dt.getSeconds());

        return yyyy + "-" + mm + "-" + dd + "  " + hour + ":" + min + ":" + sec;
    };

    // 补零函数
    function padZero(n) {
        return n < 10 ? "0" + n : n;
    }

    // 定义一个查询的参数对象，将来请求数据的时候，将请求参数对象提交到服务器
    let q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页2条
        cate_id: "", // 文章分类 Id，为空默认不分类
        state: "", // 文章发布状态
    };

    // 调用请求函数渲染表格
    initTable();

    // 获取文章列表数据的方法
    function initTable() {
        // 发起ajax请求获取数据
        $.ajax({
            type: "GET",
            url: "/my/article/list",
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取文章列表失败！");
                }
                layui.layer.msg("获取文章列表成功！");
                // console.log(res);
                let htmlStr = template("tpl-table", res);
                $("tbody").html(htmlStr);
                // 调用渲染分页的方法
                renderPage(res.total);
            },
        });
    }

    initCate();
    // 初始化文章分类的方法
    function initCate() {
        $.ajax({
            type: "GET",
            url: "/my/article/cates",
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg("获取分类数据失败！");
                }
                // console.log(res);
                // 调用模板引擎渲染分类的可选项
                let htmlStr = template("tpl-cate", res);
                // console.log(htmlStr);
                $("[name=cate_id]").html(htmlStr);
                // 调用 layui 的 form.render() 重新渲染动态加载的列表
                form.render();
            },
        });
    }

    // 为筛选表单绑定 submit 事件
    $("#form-search").on("submit", function (e) {
        // 阻止表单提交的默认事件
        e.preventDefault();
        // 获取表单中选中项的值
        let cate_id = $("[name=cate_id]").val();
        let state = $("[name=state]").val();
        // 将获取的值给 查询参数对象 q
        q.cate_id = cate_id;
        q.state = state;
        // 重新调用请求函数
        initTable();
    });

    // 定义渲染分页的方法
    function renderPage(total) {
        // console.log(total);
        // 调用 laypage.render() 方法来渲染分页的结构
        laypage.render({
            elem: "pageBox", // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ["count", "limit", "prev", "page", "next", "skip"],
            limits: [2, 3, 5, 7, 10],
            // 分页发生切换的时候，触发 jump 跳转到指定页码
            jump: function (obj, first) {
                // 可以通过 obj.curr 拿到最新的页码
                // console.log(obj.curr);
                // 触发 jump 回调方式有两种：
                // 1. 点击页码时，触发
                // 2. 调用了 laypage.render() 方法
                // 1 方法中 first 的值为 undefined
                // 2 方法中 first 的值为 true
                // console.log(first);
                // 将拿到的页码赋给对象 q
                q.pagenum = obj.curr;
                // 把最新的条目数，赋值到 q 这个查询参数对象的 pagesize 属性中
                q.pagesize = obj.limit;
                // 在重新调用函数请求并渲染之前，判断用了1、2哪种方式
                if (!first) {
                    initTable();
                }
            },
        });
    }

    // 通过事件委托的形式，为动态生成的删除按钮绑定点击事件
    $("tbody").on("click", ".btn-delete", function () {
        // console.log(11);

        // 点击删除按钮时，获取页面中删除按钮的个数，如果只剩一个，说明删除完成后就没有文章了，则将页码 - 1
        // jQuery方法获取的元素是一个伪数组，有长度
        let len = $(".btn-delete").length;
        console.log(len);

        // 获取文章的 id
        let id = $(this).attr("data-id");
        // console.log(id);

        // 提示框，二次却认是否删除
        layer.confirm(
            "确认删除？",
            { icon: 3, title: "提示" },
            function (index) {
                $.ajax({
                    type: "GET",
                    url: "/my/article/delete/" + id,
                    success: function (res) {
                        if (res.status !== 0) {
                            return layer.msg("删除文章失败！");
                        }
                        layer.msg("删除文章成功！");

                        // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据，如果没有剩余的数据，则让页码值 - 1 后再重新调用请求 initTable()，渲染页面
                        if (len === 1) {
                            // 如果删除按钮的长度为1，说明删除完成后就没有文章了，则将页码 - 1
                            // 且页码值最小必须是 1
                            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                        }
                        initTable();
                        layer.close(index);
                    },
                });
            }
        );
    });
});
