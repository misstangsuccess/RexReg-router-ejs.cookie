window.addEventListener("DOMContentLoaded", function () {
  //用于保存下标
  var dataImgsrcindex = 0;
  //声明数量
  var goodsCount = 1;
  //(一).放大镜效果
  //先封装一个函数
  viewCon();
  function viewCon() {
    //获取元素
    var oPreview = document.querySelector(".preview");
    var oSmallArea = document.querySelector(".smallArea");
    //鼠标移入放大镜区域
    oPreview.onmouseenter = function () {
      //1.创建蒙版区域
      var oMask = document.createElement("div");
      //给蒙版区取个类名(classlist有add属性)
      oMask.classList.add("mask");
      //把创建的区域放到小图区域中
      oSmallArea.appendChild(oMask);

      //2.创建大图区域
      var oBigArea = document.createElement("div");
      //给大图区域取个类名
      oBigArea.classList.add("bigArea");
      //3.创建大图图片
      var oBigImg = new Image();
      //引入大图片
      oBigImg.src = goodData.imgsrc[dataImgsrcindex].b;
      //把大图图片放在大图区域中
      oBigArea.appendChild(oBigImg);
      //把大图区域添加到放放大镜区域
      oPreview.appendChild(oBigArea);

      //放大镜移动
      oPreview.onmousemove = function (e) {
        //1.获取鼠标到放大镜边缘的距离
        var mousePreview = {
          x: e.clientX - oSmallArea.getBoundingClientRect().left,
          y: e.clientY - oSmallArea.getBoundingClientRect().top,
        };
        //2.获取鼠标到蒙版一半的距离
        var maskHalf = {
          x: oMask.offsetWidth / 2,
          y: oMask.offsetHeight / 2,
        };
        //3.计算蒙版跟随鼠标移动的距离
        var maskMove = {
          x: mousePreview.x - maskHalf.x,
          y: mousePreview.y - maskHalf.y,
        };
        //4.判断临界值
        if (maskMove.x >= oSmallArea.offsetWidth - oMask.offsetWidth) {
          maskMove.x = oSmallArea.offsetWidth - oMask.offsetWidth;
        } else if (maskMove.x <= 0) {
          maskMove.x = 0;
        }
        if (maskMove.y >= oSmallArea.offsetHeight - oMask.offsetHeight) {
          maskMove.y = oSmallArea.offsetHeight - oMask.offsetHeight;
        } else if (maskMove.y <= 0) {
          maskMove.y = 0;
        }
        //把计算好的值赋值给蒙版操作
        oMask.style.left = maskMove.x + "px";
        oMask.style.top = maskMove.y + "px";
        //5.计算大图区域的比例
        var scale =
          (oBigArea.clientWidth - oBigImg.offsetWidth) /
          (oSmallArea.clientWidth - oMask.offsetWidth);
        //大图可移动的距离
        var bigAreaMove = {
          x: maskMove.x * scale,
          y: maskMove.y * scale,
        };
        //赋值给大图
        oBigImg.style.left = bigAreaMove.x + "px";
        oBigImg.style.top = bigAreaMove.y + "px";
        //console.log(oBigImg);
      };
      //鼠标移出
      oPreview.onmouseleave = function () {
        oPreview.onmousemove = null;
        oPreview.onmouseleave = null;
        oSmallArea.removeChild(oMask);
        oPreview.removeChild(oBigArea);
        oMask = null;
        oBigArea = null;
      };
      //
    };
  }
  //(二)缩略图动图数据加载
  //封装函数
  thumbnail();
  function thumbnail() {
    //用一个变量保存从js中拿过来的数据
    var data = goodData.imgsrc;
    //获取ul元素
    var oList = document.querySelector(".list");
    //遍历所有的图片
    data.forEach(function (item, index) {
      //创建li
      var newLi = document.createElement("li");
      //创建小图片
      var newImg = new Image();
      //声明一个变量保存js中的小图片
      newImg.src = item.s;
      //把小图片插入到li中
      newLi.appendChild(newImg);
      //把li插入到ul中
      oList.appendChild(newLi);
    });
  }
  //1.缩略图滚动效果
  //先封装一个函数
  scrollImg();
  function scrollImg() {
    //获取元素
    var oList = document.querySelector(".list");
    var oListLis = document.querySelectorAll(".list li");
    var oRight = document.querySelector(".prescroll .right");
    var oLeft = document.querySelector(".prescroll .left");
    //设置起始位置
    var startLength = 0;
    //设置总共走的距离
    var totalLength = (oListLis.length - 5) * oListLis[0].offsetWidth;
    //设置每次走的距离
    var everyLength = 2 * oListLis[0].offsetWidth;
    //绑定右点击事件
    oRight.onclick = function () {
      //判断临界值
      if (totalLength - startLength >= everyLength) {
        startLength += everyLength;
      } else {
        startLength = totalLength;
      }
      oList.style.transform = "translateX(-" + startLength + "px)";
    };
    //绑定左点击事件
    oLeft.onclick = function () {
      //判断临界值
      if (startLength >= everyLength) {
        startLength -= everyLength;
      } else {
        startLength = 0;
      }
      oList.style.transform = "translateX(-" + startLength + "px)";
    };
  }
  //2.点击缩略图
  scrollImgClick();
  function scrollImgClick() {
    //先获取缩略图中li的图片和小图区域的图片
    var oSmallAreaImg = document.querySelector(".smallArea img");
    var oListLisImg = document.querySelectorAll(".list li img");
    oListLisImg.forEach(function (item, index) {
      item.onclick = function () {
        oSmallAreaImg.src = item.src;
        dataImgsrcindex = index;
      };
    });
  }
  //3.价格区域数据动态加载
  priceAreaData();
  function priceAreaData() {
    //声明一个变量用于保存js中加载过来的数据
    var data = goodData.goodsDetail;
    //获取元素
    var oPriceArea = document.querySelector(".priceArea");
    //声明一个变量设置加载的数据
    var str = `<h3 class="title">${data.title}</h3>
    <p class="con1">${data.recommend}</p> 
  <div class="price">
        <div class="priceDetail"> 
          <p>价&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;格</p>
          <p>￥ <span>${data.price}</span> 元</p>
        </div>
        <div class="buy">
            <p>促&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;销</p>
            <p><span>${data.promoteSales.type}</span>${data.promoteSales.content}</p>
        </div>
    </div>
    <div class="support">
        <div class="supportDetail">
            <p>支&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;持</p>
            <p>${data.support}</p>
        </div>
        <div class="address">
            <p>配&nbsp;送&nbsp;至</p>
            <p>${data.address}</p>
        </div> `;
    oPriceArea.innerHTML = str;
  }
  //4.选择区域详情加载数据
  chooseData();
  function chooseData() {
    //声明一个变量保存js中的数据
    var data = goodData.goodsDetail.crumbData;
    //获取元素
    var ochooseArea = document.querySelector(".chooseArea");
    //遍历data数据
    data.forEach(function (item, index) {
      //创建dl
      var oDl = document.createElement("dl");
      //创建dt
      var oDt = document.createElement("dt");
      //把数据赋值给dt中
      oDt.innerHTML = item.title;
      //把dt插入到dl中
      oDl.appendChild(oDt);
      //遍历data中的dd
      item.data.forEach(function (item, index) {
        //创建dd
        var oDd = document.createElement("dd");
        //把数据赋值给dd中
        oDd.innerHTML = item.type;
        //设置一个自定义属性保存价格的改变
        oDd.dataset.changePrice = item.changePrice;
        //把dd插入到dl
        oDl.appendChild(oDd);
      });
      ochooseArea.appendChild(oDl);
    });
  }
  //5.选择详情设置
  detailArea();
  function detailArea() {
    //设置一个数组保存详情内容
    var arr = [0, 0, 0, 0];
    //获取dl元素
    var oDl = document.querySelectorAll(".chooseArea dl");
    //获取被插入选择的元素
    var oChooseInsert = document.querySelector(".chooseInsert");
    //遍历所有的dl
    oDl.forEach(function (item, index) {
      //设置一个属性保存下标
      item.index = index;
      //获取dd元素
      var oDd = item.querySelectorAll("dd");
      //遍历所有的dd
      oDd.forEach(function (item, i) {
        //绑定点击事件
        item.onclick = function () {
          //再次遍历所有的dd清空颜色
          oDd.forEach(function (item, index) {
            item.style.color = "#666";
          });
          this.style.color = "red";
          //把点击后的dd保存到数组中(dd所在dl对应的下标)
          arr[index] = this;
          //每次遍历数组之前先清空选择区域
          oChooseInsert.innerHTML = "";
          //遍历数组创建标签
          arr.forEach(function (item, i) {
            //如果在数组中做判断
            if (item) {
              //创建mark标签
              var oMark = document.createElement("mark");
              //给mark标签添加内容(等于数组中的内容)
              oMark.innerHTML = item.innerHTML;
              //创建删除标签
              var oDelete = document.createElement("a");
              //给删除标签添加内容
              oDelete.innerHTML = "X";
              //设置a标签时设置自定义属性,把a标签对应dl的下标保存起来
              oDelete.dataset.index = i;
              //把删除标签添加到mark标签中
              oMark.appendChild(oDelete);
              //把mark标签插入到页面中
              oChooseInsert.appendChild(oMark);
            }
          });
          //.删除功能
          //创建mark属性并获取
          var oDeletes = document.querySelectorAll("mark a");
          //   //对所有的删除按钮绑定点击事件
          oDeletes.forEach(function (item, index) {
            item.onclick = function () {
              //删除当前的元素
              item.parentNode.parentNode.removeChild(item.parentNode);
              //删除数组中的值(a标签上保存有当前a所对应的下标)
              var oDeleIndex = item.dataset.index;
              arr[oDeleIndex] = 0;
              //清当前删除的dl中的所有dd的颜色
              var oDeleDlDd = oDl[oDeleIndex].querySelectorAll("dd");
              oDeleDlDd.forEach(function (item) {
                item.style.color = "#666";
              });
              //给当前清空的dd默认第一个是红色
              oDeleDlDd[0].style.color = "red";
              addPrice(arr);
            };
          });
          addPrice(arr);
        };
      });
    });
    //6.封装函数计算价格
    function addPrice(arr) {
      //获取最初价格(默认价格)
      var oPrice = document.querySelector(".price .priceDetail span");
      var oMasterPrice = document.querySelector(
        ".detail .good-suits .master p"
      );
      var startPrice = goodData.goodsDetail.price * goodsCount;

      arr.forEach(function (item) {
        if (item) {
          startPrice += parseInt(item.dataset.changePrice) * goodsCount;
          //console.log(item);
        }
      });
      console.log(startPrice);

      oPrice.innerHTML = startPrice;
      oMasterPrice.innerHTML = "￥" + startPrice;
    }
  }
  //7.计算数量上的价格
  goodsNum();
  function goodsNum() {
    //获取元素
    var oPlus = document.querySelector(".goodsNum .num .plus");
    var oMins = document.querySelector(".goodsNum .num .mins");
    var oInput = document.querySelector(".goodsNum .num input");
    //获取搭配的价格
    var oMasterPrice = document.querySelector(".detail .good-suits .master p");
    //给加号绑定点击事件
    oPlus.onclick = function () {
      //数量累加
      goodsCount++;
      //把累加的值赋值给表单
      oInput.value = goodsCount;
      //获取最初价格
      var oPrice = document.querySelector(".price .priceDetail span");
      //获取改变后的价格
      var nowPrice = oPrice.innerHTML;
      //获取最新的价格
      var newPrice = (nowPrice / (goodsCount - 1)) * goodsCount;
      //把最新的价格赋值给最初的价格和搭配后的价格
      oPrice.innerHTML = newPrice;
      oMasterPrice.innerHTML = "￥" + newPrice;
    };
    //给减号绑定点击事件
    oMins.onclick = function () {
      //数量累加
      goodsCount--;
      if (goodsCount < 1) {
        goodsCount = 1;
        return;
      }
      //把累加的值赋值给表单
      oInput.value = goodsCount;
      //获取最初价格
      var oPrice = document.querySelector(".price .priceDetail span");
      //获取改变后的价格
      var nowPrice = oPrice.innerHTML;
      //获取最新的价格
      var newPrice = (nowPrice / (goodsCount + 1)) * goodsCount;
      //把最新的价格赋值给最初的价格和搭配后的价格
      oPrice.innerHTML = newPrice;
      oMasterPrice.innerHTML = "￥" + newPrice;
    };
  }
  //8.搭配项目价格计算
  chooseProduct();
  function chooseProduct() {
    //获取搭配的价格
    var oMasterPrice = document.querySelector(".detail .good-suits .master p");
    //获取最终价格
    var oResultPrice = document.querySelector(".result .price");
    //获取最初的价格
    var startPrice = goodData.goodsDetail.price;
    //设置搭配和最终的价格
    oMasterPrice.innerHTML = "￥" + startPrice;
    oResultPrice.innerHTML = "￥" + startPrice;
    //获取多选框元素
    var oInputs = document.querySelectorAll(
      ".suitsItem label input[type=checkbox]"
    );
    //遍历所有的多选框
    oInputs.forEach(function (item, index) {
      //绑定点击事件
      item.onclick = function () {
        //设置计时器
        var num = 0;
        //再次遍历多选框
        oInputs.forEach(function (item, index) {
          //判断是否被选中并赋值
          if (item.checked) {
            num += +item.value;
          }
        });
        //重新获取最终价格=搭配后的价格+选中的价格
        oResultPrice.innerHTML =
          "￥" + (+oMasterPrice.innerHTML.substr(1) + num);
      };
    });
  }
  //(三)Tab切换
  //(字面量对象)
  function Tab(oBtns, oContents) {
    //这里的this指实例化对象
    this.oBtns = oBtns;
    this.oContents = oContents;
    //声明一个that保存当前的this
    var that = this;
    //遍历oBtn
    this.oBtns.forEach(function (item, index) {
      //绑定点击事件
      item.onclick = function () {
        //选项卡切换的核心代码
        //所有选项卡切换的核心代码都是一致的,所以把这个方法写在原型对象上,就可以通用了
        that.click(index);
      };
    });
  }
  //这个方法是点击标题后选项卡切换的核心代码
  Tab.prototype.click = function (index) {
    var that = this;
    //遍历oBtn
    this.oBtns.forEach(function (item, index) {
      //移除oBtn中active的类名和oContent对应下标active的类名
      item.classList.remove("active");
      that.oContents[index].classList.remove("active");
    });
    //添加类名
    this.oBtns[index].classList.add("active");
    this.oContents[index].classList.add("active");
  };
  //封装一个函数
  doTab1();
  function doTab1() {
    //获取元素
    var oBtns = document.querySelectorAll(".tabTitle h4");
    var oContents = document.querySelectorAll(".tabContent .tab-pane");
    //实例化调用
    new Tab(oBtns, oContents);
  }
  //中间内容区切换
  doTab2();
  function doTab2() {
    //获取所有的按钮
    var oBtns = document.querySelectorAll(".tab-wraped li");
    var oContents = document.querySelectorAll(".tab-content .tab-pane");

    new Tab(oBtns, oContents);

    console.log(oBtns, oContents);
  }
  //右侧边栏
  toolBar();
  function toolBar() {
    //获取元素
    var oToolBar = document.querySelector(".toolBar");
    var oMenu = document.querySelector(".menu");
    //设置开关保存当前侧边栏的展开信息
    var flag = true;
    //对面包屑绑定点击事件
    oMenu.onclick = function () {
      if (flag) {
        //如果是flag那侧边栏就在右边等于0,否则向右走-294px
        oToolBar.style.right = "0";
      } else {
        oToolBar.style.right = "-294px";
      }
      flag = !flag;
    };
    //获取所有的侧边栏列表元素
    var oNavListLis = document.querySelectorAll(".navList li");
    var oNavListLiPs = document.querySelectorAll(".navList li p");
    //遍历所有的l
    oNavListLis.forEach(function (item, index) {
      //鼠标移入
      item.onmouseenter = function () {
        //所有的p标签对应的下标样式向左-62px
        oNavListLiPs[index].style.left = "-62px";
      };
      //鼠标移出
      item.onmouseleave = function () {
        oNavListLiPs[index].style.left = "35px";
      };
    });
  }
});
