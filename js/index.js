/**
 * Created by lili on 2017/12/27.
 */
$(document).ready(function(){
    //promChosen
    $('#promChosen1').promchosen({type:'',show:'all',data:[{key:'3',value:'我是单选'},{key:'4',value:'我是单选1'}],property:{dataValid:'pageManage'},checkedData:[]})
        .on('selected.dm.chosen',function (data) {
            console.log(data);
        }).on('value.dm.chosen',function (data) {
        console.log(data);
    });
    //promChosen
    $('#promChosen2').promchosen({type:true,show:'all',data:[{key:'234',value:'我是多选234'},{key:'131',value:'我是多选131'},{key:'231',value:'我是多选231'}],property:{dataValid:'pageManage'},checkedData:[{key:'5',value:'我是多选2'}]})
        .on('selected.dm.chosen',function (data) {
            console.log(data);
        }).on('value.dm.chosen',function (data) {
        console.log(data);
    });
});