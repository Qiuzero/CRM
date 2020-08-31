$(function () {
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

    }
    //筛选
    //选择框
    $('.selectBox').on('change', function () {
        //var val = $(this).val();
        // console.log(val);
        $(this).blur();
        showUserList()
    })
    //搜索框
    $(".searchInp").blur(function () {
        showUserList()
    })
    //批量删除
    $(".deleteAll").click(function () {
        $.each($('input:checkbox'), async function () {
            if (this.checked) {
                let id = parseInt($(this).attr('userId'))
                console.log(id);
                console.log(typeof (id));
                let result = await axios.get("/user/delete", {
                    params: {
                        userId: id
                    }
                })
                console.log(result);

                if (result.code == 0) {
                    showUserList();
                    return
                }
                alert('删除失败')
                
            }
        });

    });
})