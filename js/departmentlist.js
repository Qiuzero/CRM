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
                <td class="w20">
                    <a href="javascript:;">编辑</a>
                    <a href="javascript:;">删除</a>
                </td>
            </tr>`
        })
        $("tbody").html(str)


    }
})