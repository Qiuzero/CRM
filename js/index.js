$(function () {
    //获取元素
    let $navBoxList=$(".navBox>a");
    let $itemBoxList=null;
    init();
    //渲染用户信息
    let $plan = $.Callbacks(); //用来实现发布订阅
    $plan.add((_, baseInfo) => {
        console.log(baseInfo);
        $('.baseBox>span').html(`你好，${baseInfo.name || ''}`)
        
        //退出登录
        $('.baseBox>a').click(async function(){
            let result =await axios.get('/user/signout')
            if(result.code==0){
                window.location.href='login.html';
                return;
            }
            //退出失败
            alert('稍后再试');
        })

    })
    $plan.add((power) => {
        console.log(power);
        let str =``;
        if(power.includes('userhandle')){
            str +=`
            <div class='itemBox' text='员工管理'>
                <h3>
                <i class ='iconfont icon-yuangong'></i>
                员工管理
                </h3>
                <nav class='item'>
                  <a href='page/userlist.html' target='iframeBox'>员工列表</a>
                  <a href='page/useradd.html' target='iframeBox'>新增员工</a>
                </nav>
            </div>
            `
        }
        if(power.includes('departhandle')){
            str +=`
            <div class='itemBox' text='部门管理'>
                <h3>
                <i class ='iconfont icon-bumen'></i>
                部门管理
                </h3>
                <nav class='item'>
                  <a href='page/departmentlist.html' target='iframeBox'>部门列表</a>
                  <a href='page/departmentadd.html' target='iframeBox'>新增部门</a>
                </nav>
            </div>
            `
        }
        if(power.includes('jobhandle')){
            str +=`
            <div class='itemBox' text='职位管理'>
                <h3>
                <i class ='iconfont icon-zhiwei'></i>
                职位管理
                </h3>
                <nav class='item'>
                  <a href='page/joblist.html' target='iframeBox'>职位列表</a>
                  <a href='page/jobadd.html' target='iframeBox'>新增职位</a>
                </nav>
            </div>
            `
        }
        if(power.includes('customerall')){
            str +=`
            <div class='itemBox' text='客户管理'>
                <h3>
                <i class ='iconfont icon-kuhuguanli'></i>
                客户管理
                </h3>
                <nav class='item'>
                  <a href='page/customerlist.html?lx=my' target='iframeBox'>我的客户</a>
                  <a href='page/customerlist.html?lx=all' target='iframeBox'>全部客户</a>
                  <a href='page/customeradd.html' target='iframeBox'>新增客户</a>
                </nav>
            </div>
            `
        }
        $('.menuBox').html(str);
        $itemBoxList=$(".menuBox").find(".itemBox")

    });
    function handGroup(index){
        //分两组 $group1  $group2
        let $group1=$itemBoxList.filter((_,item)=>{
            let text=$(item).attr('text');
            return text === '客户管理'
        });
        let $group2=$itemBoxList.filter((_,item)=>{
            let text=$(item).attr('text');
            return /^(员工管理|部门管理|职位管理)/.test(text)
        });
        if(index===0){
            $group1.css('display','block')
            $group2.css('display','none')
        }else if(index===1){
            $group1.css('display','none')
            $group2.css('display','block')
        }

    }
    //实现tab选项卡功能
    $plan.add(power=>{
        //默认显示
        let initindex=power.includes("customer") ? 0: 1;
        $navBoxList.eq(initindex).addClass("active").siblings().removeClass('active');
        handGroup(initindex);
        //点击切换
        $navBoxList.click(function(){
           


            let index=$(this).index();//获取你点击a标签的索引
            let text=$(this).html().trim();

            if((text === '客户管理') && !/customerall/.test(power) || (text==='组织结构') && !/(userhandle | departhandle|jobhandle)/.test(power)){
                alert('没有权限')
                return
            }
            $(this).addClass("active").siblings().removeClass('active');
            handGroup(index);
        })
    })
    //控制默认的iframe的src
    $plan.add(power=>{
        let url ='page/customerlist.html'
        if(power.includes('customerall')){
            $(".iframeBox").attr('src',url)
        }
    })

    async function init() {
        //判断当前用户有没有登陆
        let result = await axios.get("/user/login")
        console.log(result);
        if (result.code != 0) {
            alert('请先登录')
            window.location.href = 'login.html';
            return;
        }
        let [power, baseInfo] = await axios.all([
            axios.get('/user/power'),
            axios.get('/user/info')
        ])
        power.code === 0 ? power = power.power :null;
        baseInfo.code===0 ? baseInfo = baseInfo.data : null;
        $plan.fire(power, baseInfo)
    }
})