
const express=require("express");
const router=new express.Router();
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
      res.redirect("http://127.0.0.1:3000/login.html")
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
  if(isHasUser.pass===pass){
    res.send("登录成功")
  }else{
    res.send("密码错误")
  }
})
module.exports=router;