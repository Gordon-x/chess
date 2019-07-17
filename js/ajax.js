/**
 * Created by Administrator on 15-5-14.
 */


var ajax = {
    xp: "",
    v: "",

    init: function()
    {
        if(window.XMLHttpRequest)
        {
            this.xp=new XMLHttpRequest();
        }
        else
        {
            this.xp=new ActiveXObject("Microsoft.XMLHTTP");
        }
        this.sendName();
        this.getUser();
    },

    setValue: function(v)
    {
        this.v = v;
    },

    sendName: function()
    {
        var url="../libs/app.php";
        this.xp.open("POST",url,true);
        this.xp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
        this.xp.send("user="+this.v);
    },

    getValue: function()
    {
        this.xp.onreadystatechange=function()
        {
            if(this.xp.readyState==4&&this.xp.status==200)
            {

            }
        }
    }
};

var username;
document.getElementById('ok').onclick = function()
{
    username = document.getElementById('username').value;
    document.getElementById('setName').style.display = 'none';
    //document.getElementById('canvas').style.display = 'block';
};

ajax.setValue(username);
ajax.init();