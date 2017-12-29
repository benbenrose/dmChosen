/**
 * auth lily
 * chosen
 * 2017/8/20.
 */
(function ($,window) {
        ;if('undefined' === typeof jQuery) throw new Error('dmChosen’s JavaScript require jQuery');
        +function ($) {
            var Chosen = function (element,options) {//options{type:true/false,show:'key/value/all',property:{placeholder:'',data-valid:''},data:[{key:'',value:''}],checkedData:[]}
                this.element = element;
                this.show = options.show || 'value';
                this.isMultiple = options.type || false;//multi 是否批量
                this.checkedData = options.checkedData || [];//选中的数据
                this.totalData = options.data || [];//总数据
                this.data = this.totalData;//匹配总数据{key:'',value,}
                this.property = options.property || {};
                if(typeof this.data == 'object' && typeof this.checkedData == 'object'){
                    this.init();
                }
            };
            Chosen.prototype.init = function () {
                this.createElement();
                this.createData('init');
                this.bind();
            };
            Chosen.prototype.createElement = function () {
                var inputP = '',property = this.property;
                for(var key in property){
                    if(key == 'dataValid') {//专为验证插件设置
                        inputP = inputP +' data-valid='+property[key];
                    }else{
                        inputP = inputP +' '+ key+'='+property[key];
                    }
                }
                var mClass = 'chosen-container-single';
                if(this.isMultiple){
                    mClass = 'chosen-container-multi';
                }
                $(this.element).append('<div class="promotion-chosen-container '+mClass+'"></div>');
                var chosenContainerDiv = $(this.element).find('.promotion-chosen-container');
                var chosenDropDiv = $('<div class="chosen-drop"><ul class="chosen-results"></ul></div>').appendTo($(chosenContainerDiv));

                $('<ul class="chosen-choices" >' +
                    ' <li class="search-field"> <input class="chosen-search-input promo-chosen-input"  type="text" '+inputP+'> </li> ' +
                    '</ul>').prependTo(chosenContainerDiv);//加入输入文本
                this.chosenResultElement = chosenDropDiv.find('ul');//option列表
                this.chosenContainerElement = chosenContainerDiv;//主div
                this.chosenChoiceElement = chosenContainerDiv.find('.chosen-choices');//choice input
            };
            Chosen.prototype.createSearchChoice = function (key,value) {
                var spanArray = value.split(','),spans = '';
                for(var i = 0;i<spanArray.length;i++){
                    spans = spans + '<span>'+spanArray[i]+'</span>'
                }
                var html = '<li class="search-choice" data-promo-key="'+key+'"> ' + spans+
                    ' <a class="search-choice-close"></a> ' +
                    '</li> ';
                return html;
            };
            Chosen.prototype.createChosenResult = function (key,value,isSeleted) {
                var spanArray = value.split(','),spans = '',matchV = this.inputValue || '', len = matchV.length;
                for(var i = 0;i<spanArray.length;i++){
                    var string = spanArray[i],spanHtml = '';
                    if(i == 0 && string.indexOf(matchV) >-1){
                        spanHtml = string.substring(0,string.indexOf(matchV)) +'<i>'+matchV+'</i>'+
                            string.substring(string.indexOf(matchV)+len,string.length);

                    }else{
                        spanHtml = string;
                    }
                    spans = spans + '<span title="'+string+'">'+spanHtml+'</span>';
                }
                var seleted = (isSeleted && this.isMultiple) || (isSeleted && key == 'nodata')? 'selected':'';
                var html = '<li data-promo-key="'+key+'" class="active-result '+seleted+'" > '+spans+'</li>';
                return html;
            };
            Chosen.prototype.createData = function (type) {
                var that = this;
                //创建option 1:清空option;2:判断是否选中的：seleted
                $(this.chosenResultElement).empty();
                var valueFun = this.valueAssemble();
                this.data.forEach(function (obj) {
                    var html = that.createChosenResult(obj.key,valueFun(obj),that.isSelected(obj.key));
                    $(that.chosenResultElement).append(html);
                });
                if(!this.data.length){
                    var html = that.createChosenResult('nodata','无数据',true);
                    $(that.chosenResultElement).append(html);
                }

                if(type == 'init') {
                    $(that.chosenChoiceElement).find('.search-choice').remove();
                    this.checkedData.forEach(function (obj) {
                        if(that.isMultiple){
                            var html = that.createSearchChoice(obj.key,valueFun(obj));
                            $(that.chosenChoiceElement).prepend(html);
                        }else{
                            that.chosenChoiceElement.find('input.chosen-search-input').val(obj.key);
                        }
                    });
                }
            };
            Chosen.prototype.removeData = function (e) {
                var $this = $(e.target || e.srcElement || e );
                if($this.is('.disabled')) return;
                if($this.context.nodeName == 'A' ) $this = $($this).parent();
                var key = $this.data('promo-key');
                //single:清空-添加；multi:删除checkedData和data的seleted状态改变
                if(this.isMultiple){
                    this.checkedData.splice(this.getInArrayIndex(key, this.checkedData),1);
                    $this.remove();
                    $(this.chosenResultElement).find('[data-promo-key='+key+']').removeClass('selected');
                }else{
                    this.checkedData.splice(0,this.checkedData.length);//清空
                }
                this.selectEvt();
                $(this.chosenContainerElement).removeClass('chosen-with-drop');
                e.stopPropagation();
            };
            Chosen.prototype.addData = function (e) {
                var $this = $(e.target || e.srcElement || e );
                if($this.context.nodeName == 'SPAN' ) $this = $($this).parent();
                var key = $this.data('promo-key');
                if($this.is('.selected')) return;
                //single:input清空-添加,multi:添加search-choice ;同时都要添加checkedData和更改seleted
                var index = this.getInArrayIndex(key, this.data);
                var obj = this.data[index];
                if(this.isMultiple){
                    var valueFun = this.valueAssemble();
                    var html = this.createSearchChoice(key,valueFun(obj));
                    $(this.chosenChoiceElement).prepend(html);
                    this.checkedData.push(obj);
                    $(this.chosenResultElement).find('[data-promo-key='+key+']').addClass('selected');
                    //批量：选中的时候清空input
                    this.chosenChoiceElement.find('input.chosen-search-input').val('');
                }else{
                    this.checkedData.splice(0,this.checkedData.length);//清空
                    this.checkedData.push(obj);
                    this.chosenChoiceElement.find('input.chosen-search-input').val(obj.key);
                    $(this.chosenContainerElement).removeClass('chosen-with-drop');
                }
                this.selectEvt();//触发选中事件

            };
            //判断数据是否选中
            Chosen.prototype.isSelected = function (key) {
                if(this.getInArrayIndex(key,this.checkedData) > -1) return true;
                return false;
            };
            //在数组中搜索指定的值，并返回其索引值
            Chosen.prototype.getInArrayIndex = function (key,data) {
                for(var i = 0;i<data.length;i++){
                    if(data[i].key == key) return i
                }
                return -1;
            };
            //组装显示的option信息
            Chosen.prototype.valueAssemble = function () {
                if(this.show == 'key'){
                    return function (obj) {
                        var value = obj.key || '';
                        return value;
                    }
                }else if(this.show == 'value'){
                    return function (obj) {
                        var value = obj.value || '';
                        return value;
                    }
                }else{
                    return function (obj) {
                        var value = obj.key + ','+obj.value ;
                        return value;
                    }
                }
            };
            Chosen.prototype.selectEvt = function () {
                var checkedData = this.checkedData;
                var e = $.Event('selected.dm.chosen', { checkedData: checkedData} );
                $(this.element).trigger(e)
            };
            Chosen.prototype.setData = function (data,type) {//type:inner:内部过滤数据；false:外部设置data数据,type:true设置checkedData
                if(typeof data != 'object') return;
                if(type && type != 'inner') {
                    this.checkedData = data;
                    this.createData('init');
                }else {
                    this.data = data;
                    if(!type)this.totalData = data;
                    this.createData();
                    if(!this.isMultiple && !type){//如果是单选选项且外部设置data数据，重置后文本清空
                        this.chosenChoiceElement.find('input.chosen-search-input').val('');
                    }
                }
            };
            Chosen.prototype.filterData = function (e) {
                var that = this;
                var $this = $(e.target || e.srcElement ), value = $.trim($($this).val());
                var totalData = this.totalData, matchData = [];
                var matchFun = function () {
                    if(that.show == 'key' || that.show == 'all'){//匹配key
                        return function (obj) {
                            if(obj.key.indexOf(value)>-1){
                                matchData.push(obj);
                            }
                        }
                    }else{//value
                        return function (obj) {
                            if (obj.value.indexOf(value) > -1) {
                                matchData.push(obj);
                            }
                        }
                    }
                }();
                totalData.forEach(function (obj) {
                    matchFun(obj);
                });
                this.inputValue = value;
                this.setData(matchData,'inner');
                var _evt = $.Event('value.dm.chosen', {inputValue: value} );
                $(this.element).trigger(_evt)
            };
            Chosen.prototype.setDisabled = function (type) {
                var elem = this.chosenChoiceElement.find('input.chosen-search-input');
                elem.attr("disabled",type);
                if(type)elem.parent().parent().addClass('disabled');
                if(!type)elem.parent().parent().removeClass('disabled');
                if(this.isMultiple){//search-choice-close
                    if(type)this.chosenChoiceElement.find('a.search-choice-close').addClass('disabled');
                    if(!type)this.chosenChoiceElement.find('a.search-choice-close').removeClass('disabled');
                }
            }
            Chosen.prototype.bind = function () {
                var that = this;
                /* var e = $.Event('selected.dm.validate', { checkedData: this.checkedData} );
                 var e = $.Event('value.dm.validate', { checkedData: this.checkedData} );
                 $(this.element).trigger(e)*/
                $(document).on('click.dm.chosen',function (e) {
                    var target = e.target || e.srcElement;
                    if ($.contains(that.chosenContainerElement[0], target)) return;//如果检测到所点击事件对象属于chosen就不影藏
                    $(that.chosenContainerElement).removeClass('chosen-with-drop');
                });
                $(this.chosenContainerElement)
                    .on('keyup.dm.chosen','.chosen-choices input',$.proxy(this.filterData,this))
                    .on('focus.dm.chosen','.chosen-choices input',function () {
                        $(that.chosenContainerElement).addClass('chosen-with-drop');
                    })
                    .on('keydown.dm.chosen','.chosen-choices input',function (e) {
                    //lili 20171013增加 触发backspace按钮，如果input为空依次自动删除选中的
                    if(e.keyCode == 8 && $.trim($(this).val()) == ''){
                        var $this = $('.chosen-choices').find('.search-choice').find('.search-choice-close');
                        $($this[$this.length-1]).trigger('click');
                      }
                    })
                    .on('click.dm.chosen','.chosen-choices',function () {
                        $(this).find('input').focus();
                    })
                    .on('click.dm.chosen','.search-choice-close',$.proxy(this.removeData,this))
                    .on('click.dm.chosen','.active-result',$.proxy(this.addData,this));

            }
            function Plugin(opt) {
                var _arg = arguments;
                return this.each(function (  )  {
                    var $this = $(this);
                    var options = $.extend({}, typeof opt == 'object' && opt);
                    var data  = $this.data('dm.chosen');
                    if (!data &&  typeof opt != 'string') $this.data('dm.chosen', (data = new Chosen(this,options)));
                    if (typeof opt == 'string'&& opt == 'setData'&& data) data[opt](_arg[1],_arg[2]);
                    if (typeof opt == 'string'&& opt == 'setDisabled'&&data) data[opt](_arg[1]);
                })
            }
            $.fn.promchosen = Plugin
        }(jQuery);
})(jQuery,window);