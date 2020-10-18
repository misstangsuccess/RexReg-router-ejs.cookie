
const express=require("express");
const router=new express.Router();
const cookieParser=require("cookie-parser");
router.use(cookieParser())
const{
  resolve
}=require("path");

//引入数据库操作的内容
//引入mongoose模块
const mongoose=require("mongoose");
//引入约束模块
const userInfoSchema=require("../userInfo")
//创建一个对userInfo集合引用
const userInfo=mongoose.model("userInfo",userInfoSchema);
//注册的接口
router.post("/register",async(req,res)=>{
      //1.获取用户数据
      console.log(req.body)
      const{
        user,
        pass
      }=req.body;
      console.log(user,pass)
      //2.判断是否已经注册
      const isHasUser=await userInfo.findOne({
        user
      })
      console.log(isHasUser);
      if(isHasUser){
        if(isHasUser.user===user){
          res.send("用户名被注册");
          return;
        }
      }
      //3.保存在数据库存
      const saveResult=await userInfo.create({
        user,
        pass
      })
      console.log(saveResult);
      //4返回响应
      res.sendFile(resolve(__dirname,"../center/center.html"))
})
//登录接口
router.post("/login",async(req,res)=>{

  //1.获取用户的数据
  const{
    user,
    pass
  }=req.body;
  //2判断用户名是否存在
  const isHasUser=await userInfo.findOne({
    user
  });
  console.log(isHasUser);
  if(!isHasUser)return res.send("用户名不存在")
  //3判断密码是否正确
  //isHasUser其中已经包含的密码
  if(isHasUser.pass===pass){
    
   //把用户信息保存在session中
   req.session.userId=isHasUser._id;         
   //成功登录的时候,设置重定向到个人中心页面
    res.sendFile(resolve(__dirname,"../center/center.html"))
    return;
   
  }else{
    res.send("密码错误")
  }
})
module.exports=router;