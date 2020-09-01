$(function () {
    let userId = null;
    //console.log(window,location.href);
    let params = window.location.href.queryURLParams();
    console.log(params);
    //点击编辑进到此页面有id, 点击添加进到此页面没有id
    if (params.hasOwnProperty("id")) {
        userId = params.id;
        getBaseInfo();
    }
    async function getBaseInfo() {
        let result = await axios.get("/user/info", {
            params: {
                userId
            }
        })
        if (result.code === 0) {
            result = result.data;
            //实现数据的回显
            $(".username").val(result.name);
            result.sex == 0 ? $("#man").prop("checked", true) : $("#women").prop("checked", true); //0代表男  1代表女
            $(".useremail").val(result.email);
            $(".userphone").val(result.phone);
            $(".userdepartment").val(result.departmentId);
            $(".userjob").val(result.jobId);
            $(".userdesc").val(result.desc);
            return;
        }
        alert("稍后再试")
        userId=null;
    }


    initDepAndJob();
    async function initDepAndJob() {
        let departmentData = await queryDepart();
        let jobData = await queryJob();

        if (departmentData.code === 0) {
            departmentData = departmentData.data;
            let str = ``;
            departmentData.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`;
            })
            $(".userdepartment").html(str);
        }
        if (jobData.code === 0) {
            jobData = jobData.data;
            let str = ``;
            jobData.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`;
            })
            $(".userjob").html(str);
        }

    }
    //数据校验
    //用户名验证
    function checkname() {
        let val = $(".username").val().trim();
        if (val.length === 0) {
            $(".spanusername").html('必填项')
            return false;
        }
        if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
            $(".spanusername").html('名字必须是2~10个汉字')
            return false;
        }
        $(".spanusername").html('')
        return true
    }
    //邮箱验证
    function checkemail() {
        let val = $(".useremail").val().trim();
        if (val.length === 0) {
            $(".spanuseremail").html("必填项")
            return false;

        }
        if (!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(val)) {
            $(".spanuseremail").html("请输入正确格式的邮箱")
            return false;
        }
        $('.spanuseremail').html('')
        return true;
    }
    //手机号验证
    function checkphone() {
        let val = $(".userphone").val().trim();
        if (val.length === 0) {
            $(".spanuserphone").html("必填项");
            return false
        }
        if (!/^1[3456789]\d{9}$/.test(val)) {
            $(".spanuserphone").html("请输入正确格式的手机号")
            return false;
        }
        $(".spanuserphone").html('');
        return true;
    }
    $(".username").blur(checkname)
    $(".useremail").blur(checkemail)
    $(".userphone").blur(checkphone)
    $(".submit").click(async function () {
        if (!checkname() || !checkemail() || !checkphone()) {
            alert('你填写的数据不合法')
            return;
        }
        //校验通过获取用户输入的数据
        let params = {
            name: $('.username').val().trim(),
            sex: $("#man").prop("checked") ? 0 : 1, //0代表男  1代表女
            email: $(".useremail").val().trim(),
            phone: $(".userphone").val().trim(),
            departmentId: $(".userdepartment").val(),
            jobId: $(".userjob").val(),
            desc: $(".userdesc").val().trim(),
        }
        //console.log(params)

        //判断是编辑还是新增
        if(userId){
            //实现编辑功能
            params.userId=userId;
            let result=await axios.post("/user/update",params)
            if(result.code===0){
                alert("编辑成功")
                window.location.href='userlist.html'
                return;
            }
            alert("编辑失败，稍后再试")
            return;
        }
        //实现新增功能
        let result = await axios.post("/user/add", params)
        if (result.code === 0) {
            // alert("添加成功");
            window.location.href = "userlist.html";
            return
        }
        alert("添加失败~稍后再试")
    })
})