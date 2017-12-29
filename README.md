# dmChosen1.0
# auth lily
简单chosen 多选 单选
### 初始化
     $('#promChosen1').promchosen({type:'',show:'all',data:[{key:'3',value:'我是单选'},{key:'4',value:'我是单选1'}],property:{dataValid:'pageManage'},checkedData:[]})
                .on('selected.dm.chosen',function (data) {
                console.log(data);
                }).on('value.dm.chosen',function (data) {
                console.log(data);
                });
                  <br>
                type:true/false,show:'key/value/all'  //true:多选，false:单选；
                <br>
                checkedData:初始化选中的值；data：数据集；property：属性节点
                <br>
                设置数据集
                 $('#promChosen1').promchosen('setData',[{key:'3',value:'我是单选'},{key:'4',value:'我是单选1'}]);//初始化data数据
                <br>
                $('#promChosen1').promchosen('setData',[{key:'3',value:'我是单选'}]，true);//true:设置选中的数据
                <br>
                文本框是否可编辑
                 $('#promChosen1').promchosen('setDisabled',true/false);文本框是否编辑状态
                <br>
                $('#pageManageDiv').promchosen('setData',[{key:'3',value:'我是单选'}]，true);//true:设置选中的数据
                <br>
