$(function(){
    $(".submit").click(async function () {
        let params = {
            name: $('.inpBox input').val().trim(),
            desc: $(".inpBox textarea").val().trim(),
        }
        console.log(params)
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