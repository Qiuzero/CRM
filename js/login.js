$(function () {
    $('.submit').click(async function (e) {
        let account = $('.userName').val().trim();
        let password = $('.userPass').val().trim();
        if (account === '' || password === '') {
            alert('账号和密码不能为空')
            return;
        }
        password = md5(password);
        // console.log(account,password);
        // axios.post('/user/login', {
        //     account,
        //     password
        // }).then(res => {
        //     console.log(res);

        // }).catch(err => {
        //     console.log(err);

        // })
        let res=await axios.post('/user/login',{account,password})
        //console.log(res);
        if(parseInt(res.code)===0){
            alert('登陆成功');
            window.location.href='index.html'
            return;
        }
        alert('用户名或密码错误')
        

    })
})