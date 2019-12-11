//要求：尽量一个功能一个函数，函数之间可以有联系，由一个主要函数控制
var modifyForm = document.getElementsByClassName("stu-form")[0]
var addForm = document.getElementsByClassName("stu-form")[1];
var menu = document.getElementsByClassName("left-menu")[0];
var dialog = document.getElementsByClassName("dialog")[0];
var dialog = document.getElementsByClassName('dialog')[0];
var mask = document.getElementsByClassName('mask')[0];
var dialogContent = document.getElementsByClassName("dialogcontent")[0];
var addStudentBtn = document.getElementsByClassName("submitBtn")[0];
var editSubmitBtn = document.getElementsByClassName("editSubmitBtn")[0];
var tbody = document.getElementById('stu_list');
var list = document.getElementsByClassName("student-list")[0];
var totalDate = [];//存储一个全局数据

//初始化从这里开始
function init() {
    bindEvent();
}
//绑定函数
function bindEvent() {
    //这里有冗余
    list.classList.add('conactive');
    tbody.addEventListener('click', conBtnEvent, false);
    menu.addEventListener('click', changeMenu, false);
    addStudentBtn.addEventListener('click', addStudent, false);
    editSubmitBtn.addEventListener('click', modifyInfo, false)
    totalList.click();
}
//切换左侧菜单事件
function changeMenu(e) {
    var e = e || window.event;
    var target = e.target;
    var self = this.children;
    if (target.tagName === "DD") {
        initMenuCss(target);
        //这里用自定义的属性是为了左侧和右侧类名进行一一对应,用id获取到类名然后用class改样式
        var content = document.getElementById(target.getAttribute('data-id'));//
        initialConCss(content);
        //判断现在选中的是否是学生列表，是的话就渲染数据  
        if (target.id == 'totalList') {
            getStudentList();
        }
    }
}
//初始化左侧菜单样式
function initMenuCss(dom) {//初始化选中的active，把全部active选出来，然后去掉所有再给需要的添加
    var activeMenu = document.getElementsByClassName("active");
    for (var i = 0; i < activeMenu.length; i++) {
        activeMenu[i].classList.remove("active");
    }
    dom.classList.add('active');
}
//初始化右侧展示样式
function initialConCss(dom) {
    var activeCon = document.getElementsByClassName("conactive");
    for (var i = 0; i < activeCon.length; i++) {
        activeCon[i].classList.remove("conactive");
    }
    dom.classList.add('conactive');
}
// // 获取表单数据的函数(用来做添加学生和修改学生)
function getForm(formDate) {
    var name = formDate.name.value;
    var sex = formDate.sex.value;
    var sNo = formDate.sNo.value;
    var email = formDate.email.value;
    var birth = formDate.birth.value;
    var phone = formDate.phone.value;
    var address = formDate.address.value;
    var student = {
        name: name,
        sex: sex,
        sNo: sNo,
        birth: birth,
        email: email,
        phone: phone,
        address: address
    }
    return student
}
//ajax函数：给后端传参数 
function saveData(url, param) {
    var result = null;
    var xhr = null;
    if (window.XMLHttpRequest) {
        xhr = new XMLHttpRequest();
    } else {
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }
    if (typeof param == 'string') {
        xhr.open('GET', url + '?' + param, false);
    } else if (typeof param == 'object') {
        var str = "";
        for (var prop in param) {
            str += prop + '=' + param[prop] + '&';
        }
        xhr.open('GET', url + '?' + str, false);
    } else {
        xhr.open('GET', url + '?' + param.toString(), false);
    }
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            if (xhr.status == 200) {
                result = JSON.parse(xhr.responseText);
            }
        }
    }
    xhr.send();
    return result;
}
//渲染学生总表数据后拼接到页面中
function randerTable(obj) {
    //这里的result是后端返回的对象，要进行数据处理
    var htmlStr = '';
    for (var i = 0; i < obj.length; i++) {
        htmlStr += '<tr>\
        <td>'+ obj[i].sNo + '</td>\
        <td>'+ obj[i].name + '</td>\
        <td>'+ (obj[i].sex == 0 ? '男' : '女') + '</td>\
        <td>'+ obj[i].email + '</td>\
        <td>'+ (new Date().getFullYear() - obj[i].birth) + '</td>\
        <td>'+ obj[i].phone + '</td>\
        <td>'+ obj[i].address + '</td>\
        <td>\
            <button class="btn edit" date_Index='+ i + ' > 编辑</button >\
            <button class="btn del" date_Index='+ i + '>删除</button>\
        </td >\
        </tr > '
    }
    var tbody = document.getElementById('stu_list');
    tbody.innerHTML = htmlStr;
}
//获取全部学生
function getStudentList() {
    //这里调用函数处理按照api请求的数据
    var conStr=dealWithDate('api/student/findAll',' ');
    if (conStr.status == 'success') {
        var result = conStr.data;
        totalDate = result;
        randerTable(result);
        console.log(result,totalDate)
        return result
    } else {
        alert(conStr.msg);
    }
}
//获取添加表格数据的函数
function addStudent(e) {
    e.preventDefault();
    e.stopPropagation();
    var date = getForm(addForm);
    //调用数据交互处理
    var result=dealWithDate('api/student/addStudent',date)
    console.log(result)
    if (result.status == 'success') {
        var isTurnPage = confirm('数据上传成功，是否跳转页面查看');
        //上传成功，判断是否跳转查看
        if (isTurnPage) {
            totalList.click();
            getStudentList();
        }
        addForm.reset();
    } else {
        alert(result.msg)
    }
}
//数据交互处理函数                                                                                                                                                                                                                                                                                                                                                                                                                     
function dealWithDate(api, data) {
    var delStr=saveData('http://api.duyiedu.com/'+api, Object.assign(data, {
        appkey: 'dongmeiqi_1547441744650'
    }));
    return delStr;
}

// //添加内容区编辑按钮绑定事件
function conBtnEvent(e) {
    var e = e || window.enevt;
    var target = e.target;
    var isEdit = target.className.indexOf('edit') > -1;
    var isDel = target.className.indexOf('del') > -1;
    //判断是否是tbody里的两个button,然后以这两个button里面的class类名来判断是做修改还是做删除
    if (target.nodeName == 'BUTTON') {
        if (isEdit) {
            alertBox(target.getAttribute('date_Index'));
        } else if (isDel) {
            deleteInfo(target.getAttribute('date_Index'))
        }
    }
}
//编辑信息的弹窗
function alertBox(index) {
    dialog.classList.add('show');
    //取消事件冒泡，因为内容区包含在遮罩层，不然填充数据时候会消失
    dialogContent.addEventListener('click', function (e) {
        e.preventDefault();//因为提交表单会刷新页面，要阻止默认事件
        e.stopPropagation();
    }, false)
    mask.addEventListener('click', function (e) {
        dialog.classList.remove('show');
    }, false);
    //修改信息窗口数据回填
    var date = totalDate[index];
    console.log(date)
    for (var prop in date) {
        if (modifyForm[prop]) {
            modifyForm[prop].value = date[prop]
        }
    }
}
function modifyInfo() {
    //获取到已经填写到编辑页的数据
    var date = getForm(modifyForm);
    //调用数据交互处理
    var result=dealWithDate('/api/student/updateStudent',date);
    if (result.status == 'success') {
        var isTurnPage = confirm('修改成功，是否跳转页面？');
        if (isTurnPage) {
            totalList.click();
            mask.click();
        }
    } else {
        alert(result.msg)
    }
}
// 删除数据的函数
function deleteInfo(index) {
    var isDelete = confirm('是否要删除该数据？');
    var date = totalDate[index];
    if (isDelete) {
        //调用数据交互处理
        var result=dealWithDate('/api/student/delBySno',date);
        totalList.click();
        alert(result.msg)
    }
}
init();




