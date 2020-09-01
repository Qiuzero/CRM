$(function(){
    function checkname() {
        let val = $(".depname").val().trim();
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
    $(".depname").blur(checkname)
    $(".submit").click(async function () {
        let params = {
            name: $('.depname').val().trim(),
            desc: $(".depdesc").val().trim(),
        }
        console.log(params)
        //实现新增功能
        let result = await axios.post("/department/add", params)
        if (result.code === 0) {
            alert("添加成功");
            window.location.href = "departmentlist.html";
            return
        }
        alert("添加失败~稍后再试")
    })
})