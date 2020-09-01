$(function () {
    
    let checkList=null;
    //显示部门
    initDepartMent();
    async function initDepartMent() {
        let result = await queryDepart();
        if (result.code === 0) {

            let str = `<option value="0">全部</option>`;
            result.data.forEach(item => {
                str += `<option value="${item.id}">${item.name}</option>`
            })
            $(".selectBox").html(str)
        }

    }
    //展示员工列表;
    showUserList();
    async function showUserList() {
        let params = {
            departmentId: $(".selectBox").val(),
            search: $(".searchInp").val().trim(),
        }
        let result = await axios.get('/user/list', {
            params
        })
        // console.log(result);
        if (result.code !== 0) return;
        let str = ``;
        result.data.forEach(item => {
            let {
                id,
                name,
                sex,
                email,
                phone,
                department,
                job,
                desc,
            } = item;
            str += `<tr>
            <td class="w3"><input type="checkbox" userId="${id}"></td>
            <td class="w10">${name}</td>
            <td class="w5">${sex==0?'男':'女'}</td>
            <td class="w10">${department}</td>
            <td class="w10">${job}</td>
            <td class="w15">${email}</td>
            <td class="w15">${phone}</td>
            <td class="w20">${desc}</td>
            <td class="w12" userId="${id}">
                <a href="javascript:;">编辑</a>
                <a href="javascript:;">删除</a>
                <a href="javascript:;">重置密码</a>
            </td>
        </tr>`
        })
        $("tbody").html(str)

        //给checkList赋值
        checkList=$("tbody").find('input[type="checkbox"]');

    }
    //筛选
    // //选择框
    // $('.selectBox').on('change', function () {
    //     //var val = $(this).val();
    //     // console.log(val);
    //     $(this).blur();
    //     showUserList()
    // })
    // //搜索框
    // $(".searchInp").blur(function () {
    //     showUserList()
    searchHandle();

    function searchHandle() {
        $(".selectBox").change(showUserList);
        $(".searchInp").on("keydown", e => {
            if (e.keyCode == 13) { //回车
                showUserList();
            }
        })
    }
    //编辑删除修改
    delegate();

    function delegate() {
        $("tbody").on('click', 'a', e => {
            let target = e.target,
                tag = target.tagName,
                text = target.innerHTML.trim();
            if(tag==='A'){
                let userId=$(target).parent().attr("userId");
                if(text==='编辑'){
                    window.location.href=`useradd.html?id=${userId}`
                    return;
                    
                }
                if(text==='删除'){
                    //console.log('删除');
                    let flag=confirm("你确定要删除此用户吗")
                    if(!flag) return;
                    let result=axios.get("/user/delete",{
                        params:{userId}
                    })
                    if(result.code===0){
                        alert("删除成功")
                        $(target).parent().parent().remove();
                        //删除之后重新获取input框
                        checkList=$("tbody").find("input[type='checkbox']");
                        return;
                    }
                    return;
                    
                }
                if(text==='重置密码'){
                    //console.log('重置密码');
                    let flag=confirm("确定要重置密码吗？")
                    if(!flag) return;
                    let result=axios.post("/user/resetpassword",{
                        userId
                    })
                    if(result.code===0){
                        alert("重置成功")
                        return;
                    }
                    return;
                    
                }
            }
        })
    }
    //批量删除
    // $(".deleteAll").click(function () {
    //     $.each($('input:checkbox'), async function () {
    //         if (this.checked) {
    //             let id = parseInt($(this).attr('userId'))
    //             console.log(id);
    //             console.log(typeof (id));
    //             let result = await axios.get("/user/delete", {
    //                 params: {
    //                     userId: id
    //                 }
    //             })
    //             console.log(result);

    //             if (result.code == 0) {
    //                 showUserList();
    //                 return
    //             }
    //             alert('删除失败')

    //         }
    //     });

    // });
    //全选处理
    selectHandle();
    function selectHandle(){
        $("#checkAll").click(e=>{
            let checked=$("#checkAll").prop("checked");
            console.log(checked);
            checkList.prop("checked",checked);
        });
        $("tbody").on("click",'input',e=>{
            if(e.target.tagName==='INPUT'){
                let flag=true;
                newCheckList=Array.from(checkList);
                newCheckList.forEach(item=>{
                    if(!$(item).prop("checked")){
                        flag=false;
                    }
                })
                $("#checkAll").prop("checked",flag)
            }
        })
    }
    //实现批量删除
    $(".deleteAll").click(e=>{
        let arr=[];
        [].forEach.call(checkList,item=>{
            if($(item).prop("checked")){
                //console.log($(item));
                arr.push($(item).attr("userid"))
                
            }
        })
        //console.log(arr);
        if(arr.length===0){
            alert("请先选中")
            return
        }
        let flag=confirm("确定删除吗？")
        if(!flag) return
        let index=-1;
        async function deleteUser(){
            let userId=arr[++index];
            if(index>=arr.length){//递归出口
                alert("删除成功")
                showUserList();
                return
            }
            let result=await axios.get("/user/delete",{
                params:{userId}
            })
            if(result.code!=0){
                //删除失败
                return;
            }
            deleteUser();
        }
        deleteUser();
        
    })
})