$(function () {
    let jobId = null;
    console.log(window, location.href);
    let params = window.location.href.queryURLParams();
    console.log(params);
    //点击编辑进到此页面有id, 点击添加进到此页面没有id
    if (params.hasOwnProperty("id")) {
        jobId = params.id;
        getBaseInfo();
    }
    async function getBaseInfo() {
        let result = await axios.get("/job/info", {
            params: {
                jobId
            }
        })
        if (result.code === 0) {
            result = result.data;
            //实现数据的回显
            $(".jobname").val(result.name);
            $(".jobdesc").val(result.desc);
            return;

        }
        alert("稍后再试")
        jobId = null;
    }
    //数据校验
    //用户名验证
    function checkname() {
        let val = $(".jobname").val().trim();
        if (val.length === 0) {
            $(".spanname").html('必填项')
            return false;
        }
        if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
            $(".spanname").html('名字必须是2~10个汉字')
            return false;
        }
        $(".spanname").html('')
        return true
    }
    $(".jobname").blur(checkname)




    $(".submit").click(async function () {
        // if (!checkname()) {
        //     alert('你填写的数据不合法')
        //     return;
        // }
        //校验通过获取用户输入的数据
        //权限选择
        let arr=[];
        $.each($('input:checkbox'), async function () {
            if (this.checked) {
                let value = $(this).val()
                //console.log(value);
                arr.push(value);
            }
        })
        let params = {
            name: $('.jobname').val().trim(),
            desc: $(".jobdesc").val().trim(),
            power:arr
        }
        console.log(params)

        //判断是编辑还是新增
        if (jobId) {
            //实现编辑功能
            params.jobId = jobId;
            let result = await axios.post("/job/update", params)
            if (result.code === 0) {
                alert("编辑成功")
                window.location.href = 'joblist.html'
                return;
            }
            alert("编辑失败，稍后再试")
            return;
        }

        //实现新增功能
        let result = await axios.post("/job/add", params)
        if (result.code === 0) {
            // alert("添加成功");
            window.location.href = "../page/joblist.html";
            return
        }
        alert("添加失败~稍后再试")
    })
})