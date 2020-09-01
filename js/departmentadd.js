// $(function(){
//     function checkname() {
//         let val = $(".departmentname").val().trim();
//         if (val.length === 0) {
//             $(".spanname").html('必填项')
//             return false;
//         }
//         if (!/^[\u4e00-\u9fa5]{2,10}$/.test(val)) {
//             $(".spanname").html('名字必须是2~10个汉字')
//             return false;
//         }
//         $(".spanname").html('')
//         return true
//     }
//     $(".departmentname").blur(checkname)
//     $(".submit").click(async function () {
//         let params = {
//             name: $('.departmentname').val().trim(),
//             desc: $(".departmentdesc").val().trim(),
//         }
//         console.log(params)
//         //实现新增功能
//         let result = await axios.post("/departmentartment/add", params)
//         if (result.code === 0) {
//             alert("添加成功");
//             window.location.href = "departmentartmentlist.html";
//             return
//         }
//         alert("添加失败~稍后再试")
//     })
// })
$(function () {
    let departmentId = null;
    console.log(window,location.href);
    let params = window.location.href.queryURLParams();
    console.log(params);
    //点击编辑进到此页面有id, 点击添加进到此页面没有id
    if (params.hasOwnProperty("id")) {
        departmentId = params.id;
        getBaseInfo();
    }    
    async function getBaseInfo() {
        let result = await axios.get("/department/info", {
            params: {
                departmentId
            }
        })
        if (result.code === 0) {
            result = result.data;
            //实现数据的回显
            $(".departmentname").val(result.name);
            $(".departmentdesc").val(result.desc);
            return;

        }
        alert("稍后再试")
        departmentId = null;
    }
    //数据校验
    //用户名验证
    function checkname() {
        let val = $(".departmentname").val().trim();
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
    $(".departmentname").blur(checkname)
    $(".submit").click(async function () {
        if (!checkname()) {
            alert('你填写的数据不合法')
            return;
        }
        //校验通过获取用户输入的数据
        let params = {
            name: $('.departmentname').val().trim(),
            desc: $(".departmentdesc").val().trim(),
        }
        //console.log(params)

        //判断是编辑还是新增
        if (departmentId) {
            //实现编辑功能
            params.departmentId = departmentId;
            let result = await axios.post("/department/update", params)
            if (result.code === 0) {
                alert("编辑成功")
                window.location.href = 'departmentlist.html'
                return;
            }
            alert("编辑失败，稍后再试")
            return;
        }

        //实现新增功能
        let result = await axios.post("/department/add", params)
        if (result.code === 0) {
            // alert("添加成功");
            window.location.href = "departmentlist.html";
            return
        }
        alert("添加失败~稍后再试")
    })
})