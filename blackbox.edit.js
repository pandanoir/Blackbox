(function($,window){
	$(function () {
		$("body").on("dragover",function(event){
			event.pd();
			event.sp();
			return false;
		});
		$.Event.fn=$.Event.prototype
		$.Event.fn.pd=function(){
			this.preventDefault();
		}
		$.Event.fn.sp=function(){
			this.stopPropagation();
		}
		var $rform = $("#rform"),
		$lform=$("#lform"),
		$bef=$lform.find("#bef"),
		$radio=$rform.find("input[type=radio]:checked"),
		$select=$rform.find("select"),
		$json=JSON,
		ls=localStorage;
//		var App={trace:!0,log:function(){if(this.trace&&"undefined"!=typeof console){var a=Array.prototype.slice.call(arguments,0);a.unshift("(App)");console.log.apply(console,a)}}};
		if($json.parse(ls.getItem("radio_option"))!=null){
			
			var RadioOption=$json.parse(ls.getItem("radio_option")),
			SelectOption=$json.parse(ls.getItem("select_option"));
			var $radios=$rform.find("input[type=radio]")
			
			for(var i=0,j=$radios.length;i<j;i++){
				if(RadioOption[$radios.eq(i).attr("name")]){
					$radios.eq(i).val( [RadioOption[$radios.eq(i).attr("name")]] )
				}
				else{
					RadioOption[$radios.eq(i).attr("name")] = $radio.filter("[name='"+$radios.eq(i).attr("name")+"']").val();
				}
			}
			
			for(var i=0,j=$select.length;i<j;i++){
				if(SelectOption[$select.eq(i).attr("id")]) $select.eq(i).val(SelectOption[$select.eq(i).attr("id")]);
				else{SelectOption[$select.eq(i).attr("id")]=$select.eq(i).find("option:selected").val();}
			}
			
			//オプション設定の読み込み
		}else{
			var RadioOption={},SelectOption={};
			for(var i=0,j=$radio.length;i<j;i++){
				RadioOption[$radio.eq(i).attr("name")] = $radio.eq(i).val();
			}
			for(var i=0,j=$select.length;i<j;i++){
				SelectOption[$select.eq(i).attr("id")]=$select.eq(i).find("option:selected").val();
			}
		}
		$rform.css3form().on("click","#save",function(event){
			
			event.pd();
			event.sp();
			$radio=$rform.find("input[type=radio]:checked")
			
			for(var i=0,j=$radio.length;i<j;i++){
				RadioOption[$radio.eq(i).attr("name")] = $radio.eq(i).val();
			}
			
			for(var i=0,$select=$rform.find("select"),j=$select.length;i<j;i++){
				SelectOption[$select.eq(i).attr("id")]=$select.eq(i).find("option:selected").val();
			}
			
			ls.setItem("radio_option",$json.stringify(RadioOption));
			ls.setItem("select_option",$json.stringify(SelectOption));
			//オプション設定の保存
		}).on("click","#default",function(event){
			event.pd();
			event.sp();
			var $customRadioButton=$("div.customRadioButton")
			$customRadioButton.eq(0).find("a").eq(3).trigger("click").end().end()
			.eq(1).find("a").eq(0).trigger("click").end().end()
			.eq(2).find("a").eq(3).trigger("click").end().end()
			.eq(3).find("a").eq(3).trigger("click").end().end()
			.eq(4).find("a").eq(1).trigger("click");
		});
		$("#readable").on("click",function (e) {
			e.pd();
			e.sp();
			String.prototype.mult = function (num) {
				var result = "";
				for(var i = 0; i < num; i++) {
					result += this;
				}
				return result;
			}
			var b = $bef.val().replace(/^[\s]*/gm, "")
				.replace(/[\r\n]/g, "")
				.replace(/[\t ]*([,:;\{])[\t ]*/g, "$1")
				.replace(/([^\t ]+?)[\t ]*\}[\t ]*/g, "$1}"),
				indent = $rform.find("input[name='indent']:checked").val(),
				colon = $rform.find("input[name='colon']:checked").val(),
				comma = $rform.find("input[name='comma']:checked").val(),
				comment = $rform.find("input[name='comment']:checked").val(),
				color = $rform.find("input[name='color']:checked").val(),
				indentchar,
				commachar,
				colonptn = /([^;\{])(.+?)[ ]?:[ ]?(.+?)([$;])/gm,
				colonmod="$1$2",
				commentptn = /\/\*([\s\S]+?)\*\//gm,
				commentmod;
			b = b.replace(/\{/g, "{\n")
				.replace(/([^;{}\r\n\*\/])\}/g, "$1;}")
				.replace(/\}(?!$)/g, "}\n")
				.replace(/;(?!\/\*)/g,";\n");
			if(indent=="tab") indentchar = "\t";
			else if(indent=="space1")indentchar = " ";
			else if(indent=="space2")indentchar = "  ";
			else if(indent=="space3")indentchar = "   ";
			else if(indent=="space4")indentchar = "    ";
			else if(indent=="none")indentchar = "";
			
			if(comma=="after")commachar = ", ";
			else if(comma=="both")commachar = " , ";
			else if(comma=="before")commachar = " ,";
			else if(comma=="none")commachar = ",";
			b=b.replace(/[ ]?,[ ]?/g, commachar);
			
			if(comment=="after")commentmod="\/\*$1\*\/\n";
			else if(comment=="both")commentmod="\n\/\*$1\*\/\n";
			else if(comment=="before")commentmod="\n\/\*$1\*\/";
			else if(comment=="none")commentmod="\/\*$1\*\/";
			b = b.replace(commentptn, commentmod)
			
			var line = b.split("\n"),
				indents = 0;
			for(var i = 0, j = line.length; i < j; i++) {
				if(line[i].indexOf("}") != -1) {
					indents--
				}
				line[i] = indentchar.mult(indents) + line[i];
				if(line[i].indexOf("{") != -1) {
					indents++
				}
			}
			b=line.join("\n");
			
			if(colon=="after")colonmod=colonmod+": ";
			else if(colon=="both")colonmod=colonmod+" : ";
			else if(colon=="before")colonmod=colonmod+" :";
			else if(colon=="none")colonmod=colonmod+":";
			colonmod=colonmod+"$3$4";
			b = b.replace(colonptn, colonmod)
			
			b = b.replace(/([: ,)(]|[\t ]?:[\t ]?)(#[0-9a-fA-F][0-9a-fA-F]?[0-9a-fA-F][0-9a-fA-F]?[0-9a-fA-F][0-9a-fA-F]?)/g, function(all,prop,one){
				if(color=="lower") return prop+(one.toLowerCase())
				else if(color=="upper") return prop+(one.toUpperCase())
			});//カラーを小文字か大文字に
			
			$lform.find("#aft").val(b).select();
			$("#mes").not(":animated").addClass("on").fadeTo(1500, 0.5,function(){$(this).removeClass("on")})
		});
		$lform.on("click",".select,.reset",function (e) {
			e.sp();
			$(this).siblings("textarea").select()
		});
		$bef.select();
		$(window).on("keydown",function(e){
			e.sp();
			if(e.keyCode==13&&((!e.ctrlkey&&e.metaKey)||(e.ctrlkey&&!e.metakey))) $("#readable").trigger("click");
		});
		$("#wrench").on("click",function(event){
			event.pd();
			event.sp();
			$("#options").toggle();
		})
		if(window.File){
			$bef.on("dragenter",function(event){
				event.pd();
				event.sp();
			}).on("dragover",function(event){
				event.originalEvent.dataTransfer.dropEffect="copy";
				event.pd();
				event.sp();
			}).on("drop",function(event){
				//ドラッグアンドドロップ
				event.pd();
				event.sp();
				event=event.originalEvent;
				var files=event.dataTransfer.files,
				encode=$rform.find("#encode").find("option:selected").val();
				for(var i=0,j=files.length;i<j;i++){
					var reader=new FileReader(),f=files[i];
					reader.readAsText(f, encode);
					reader.onload=$.proxy(function(){
						$(this).val(reader.result);
						$("#readable").trigger("click")
					},this)
				}
			})
		}else{
			$bef.attr("placeholder","ここにコードをペーストしてください。どうやらお使いのブラウザではドラッグアンドドロップは対応していないようです。");
		}
	});
}(jQuery,this));