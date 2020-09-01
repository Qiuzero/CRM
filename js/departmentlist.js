$(function () {
    showDepartMent();
    async function showDepartMent() {
        let result = await axios.get("/department/list");
        if (result.code !== 0) return;
        let str = ``;
        result.data.forEach(item => {
            let {
                id,
                name,
                desc,
            } = item;
            str += `<tr>
                <td class="w10">${id}</td>
                <td class="w20">${name}</td>
                <td class="w40">${desc}</td>
                <td class="w20" departmentId='${id}'>
                    <a href="javascript:;">编辑</a>
                    <a href="javascript:;">删除</a>
                </td>
            </tr>`
        })
        $("tbody").html(str)


    }
    delegate();

    function delegate() {
        $("tbody").on('click', 'a', e => {
            let target = e.target,
                tag = target.tagName,
                text = target.innerHTML.trim();
            if(tag==='A'){
                let departmentId=$(target).parent().attr("departmentId");
                if(text==='编辑'){
                    window.location.href=`departmentadd.html?id=${departmentId}`
                    return;
                    
                }
                if(text==='删除'){
                    //console.log('删除');
                    let flag=confirm("你确定要删除此用户吗")
                    if(!flag) return;
                    let result=axios.get("/department/delete",{
                        params:{departmentId}
                    })
                    if(result.code===0){
                        alert("删除成功")
                        $(target).parent().parent().remove();
                        return;
                    }
                    return;
                    
                }
            }
        })
    }
})