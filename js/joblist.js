$(function () {
    showJOb();
    async function showJOb() {
        let result = await axios.get("/job/list");
        if (result.code !== 0) return;
        let str = ``;
        console.log(result.data);
        result.data.forEach(item => {
            let {
                id,
                name,
                desc,
                power,
            } = item;
            str += `<tr>
                <td class="w8">${id}</td>
                <td class="w10">${name}</td>
                <td class="w20">${desc}</td>
                <td class="w50">${power}</td>
                <td class="w12" jobId='${id}'>
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
                let jobId=$(target).parent().attr("jobId");
                if(text==='编辑'){
                    window.location.href=`jobadd.html?id=${jobId}`
                    return; 
                }
                if(text==='删除'){
                    //console.log('删除');
                    let flag=confirm("你确定要删除此用户吗")
                    if(!flag) return;
                    let result=axios.get("/job/delete",{
                        params:{jobId}
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