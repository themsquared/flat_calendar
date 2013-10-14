var yy;
var calendarArray =[];
var monthOffset = [6,7,8,9,10,11,0,1,2,3,4,5];
var monthArray = [["JAN","January"],["FEB","February"],["MAR","March"],["APR","April"],["MAY","May"],["JUN","June"],["JUL","July"],["AUG","August"],["SEP","September"],["OCT","October"],["NOV","November"],["DEC","December"]];
var dayArray = ["7","1","2","3","4","5","6"];
var dayName =["M","T","W","T","F","S","S"];
$(document).ready(function() {
	$(document).on('click','.c-day.have-events',activateDay);
	$(document).on('click','.specific-day',activatecalendar);
	$(document).on('click','.c-month-arrow',offsetcalendar);
	$(window).resize(calendarScale);
	$(".calendar").calendar({
		"2013910": {
			"Mulberry Festival": {
				start: "9.00",
				end: "9.30",
				location: "London"
			}
		}
	});
	calendarSet();
	calendarScale();
	});
(function ( $ ) {
    $.fn.calendar = function(array, color) {
    	if(color == undefined) {
				$(this).data("color","red");
		} else {
			$(this).data("color",color);
		}
			$.each(array, function(date,events) {
				var tempdayarray = [];
				$.each(events, function(ev,evdata) {
					var tempeventarray = [];
					tempeventarray["name"] = ev;
					tempeventarray["start"] = evdata.start;
					tempeventarray["end"] = evdata.end;
					tempeventarray["location"] = evdata.location;
					tempdayarray.push(tempeventarray);
				});
				calendarArray[date] = tempdayarray;
			});
        return this;
    }; 
}( jQuery ));


	function calendarScale() {
		$(".calendar").each(function() {
			if($(this).width() < 400 && !$(this).hasClass('small')) {
				$(this).addClass('small');
			} else if($(this).width() > 400 && $(this).hasClass('small')) {
				$(this).removeClass('small');
			}
		})
	}

	function offsetcalendar() {
		var par = $(this).parents('.calendar');
		var cm = parseInt(par.attr('offset'));
		if($(this).data('dir') == "left") {
			calendarSetMonth(par,cm-1);
		} else if($(this).data('dir') == "right") {
			calendarSetMonth(par,cm+1);
		}

	}

	function orderBy(deli,array) {
		var p = array.slice();
		var o = p.length;
		var y,t;
		var temparray = [];
		for(var u=0; u<o;u++) {
			for(var uu=0;uu<p.length;uu++) {
				if(uu==0) {
					t = uu;
					y = p[uu];
				}
				else if(parseInt(p[uu][deli].replace('.','')) < parseInt(y[deli].replace('.',''))) {
					y = p[uu];
					t = uu;
				}
			}
			temparray.push(y);
			p.splice(t,1);
		}
		return temparray;
	}

	function calendarSet() {
		$(".calendar").append('<div class="c-month-view"><div class="c-month-arrow" data-dir="left">‹</div><p></p><div class="c-month-arrow" data-dir="right">›</div></div><div class="c-holder"><div class="c-grid"></div><div class="c-specific"><div class="specific-day"><div class="specific-day-info" i="day"></div><div class="specific-day-info" i="month"></div></div><div class="s-scheme"></div></div></div>');
		$(".calendar").each(function() {
			if($(this).data("color") == undefined) {
				$(this).data("color","red");
			}
			$(this).find('[data-role=day]').each(function() {
				var tempdayarray = [];
				$(this).find('[data-role=event]').each(function() {
					var tempeventarray = [];
					tempeventarray["name"] = $(this).data("name");
					tempeventarray["start"] = $(this).data("start");
					tempeventarray["end"] = $(this).data("end");
					tempeventarray["location"] = $(this).data("location");
					tempdayarray.push(tempeventarray);
				});
				if(calendarArray[$(this).data('day')] !== undefined) {
					$.each(calendarArray[$(this).data('day')], function(k,v) {
						tempdayarray.push(v)
					});
				} 
				calendarArray[$(this).data('day')] = tempdayarray;
			});
			calendarSetMonth($(this));
		});
		$(".calendar [data-role=day]").remove();
	}
	function activateDay() {
		$(this).parents('.calendar').addClass('spec-day');
		var di = new Date(parseInt($(this).attr('time')));
		var strtime = $(this).attr('strtime');
		var d = new Object();
		d.day = di.getDate();
		d.month = di.getMonth();
		d.events = calendarArray[strtime];
		d.tocalendar = tocalendar;
		d.tocalendar();
	}
	var tocalendar = function() {
		$(".specific-day-info[i=day]").html(this.day);
		$(".specific-day-info[i=month]").html(monthArray[this.month][0]);
		if(this.events !== undefined) {
		var ev = orderBy('start',this.events);
		for(var o = 0; o<ev.length;o++) {
			$(".s-scheme").append('<div class="s-event"><h1>'+ev[o]['name']+'</h1><p data-role="dur">'+ev[o]['start']+' - '+ev[o]['end']+'</p><p data-role="loc">'+ev[o]['location']+'</p></div>');
		}
		}
	}
	function activatecalendar() {
		$(this).parents('.calendar').removeClass('spec-day').find('.s-scheme').html('');
	}
	function calendarSetMonth(ele,offset) {
		ele.find(".c-grid").html('');
		var d = new Date();
		var c = new Date();
		var e = new Date();
		if(offset !== undefined) {
			d.setMonth(d.getMonth()+offset);
			e.setMonth(e.getMonth()+offset);
			ele.attr('offset', offset);
		} else {
			ele.attr('offset', 0);
		}
		ele.find(".c-month-view p").text(monthArray[d.getMonth()][1]+' '+d.getFullYear());
			d.setDate(1);
			if(dayArray[d.getDay()] == 1) {
				d.setDate(d.getDate()-7);
			} else {
				d.setDate(d.getDate()-dayArray[d.getDay()]+1);
			}
			var crow;
			if(ele.data('showdays')) {
				ele.find('.c-grid').append('<div class="c-row"><div class="c-day c-l"><div class="date-holder">'+dayName[0]+'</div></div><div class="c-day c-l"><div class="date-holder">'+dayName[1]+'</div></div><div class="c-day c-l"><div class="date-holder">'+dayName[2]+'</div></div><div class="c-day c-l"><div class="date-holder">'+dayName[3]+'</div></div><div class="c-day c-l"><div class="date-holder">'+dayName[4]+'</div></div><div class="c-day c-l"><div class="date-holder">'+dayName[5]+'</div></div><div class="c-day c-l"><div class="date-holder">'+dayName[6]+'</div></div></div>');
			}
			for(var i=0;i<42;i++) {
				if(i==0 || i==7 || i==14 || i==21 || i==28 || i==35) {
					crow = $('<div class="c-row"></div>');
					ele.find('.c-holder .c-grid').append(crow);
				}
				d.setDate(d.getDate()+i);
				var cal_day = $('<div class="c-day"><div class="date-holder">'+d.getDate()+'</div></div>');
				if(d.getMonth() !== e.getMonth()) {
					cal_day.addClass('other-month');
				}
				if(d.getTime() == c.getTime()) {
					cal_day.addClass('this-day');
				}
				var strtime = dToString(d);
				if(calendarArray[strtime] !== undefined) {
					cal_day.addClass('have-events');
				}
				var cal_day_eventholder = $('<div class="event-n-holder"></div>');
				if(calendarArray[strtime] != undefined) {
					for(var u=0;u<3 && u<calendarArray[strtime].length;u++) {
						cal_day_eventholder.append('<div class="event-n"></div>')
					}
				}
				cal_day.attr('strtime',strtime);
				cal_day.attr('time',d.getTime());
				cal_day.prepend(cal_day_eventholder);

				crow.append(cal_day);
				d.setDate(d.getDate()-i);
			}
	}
	function dToString(d) {
		var y = d.getFullYear();
		var m = d.getMonth()+1;
		var da = d.getDate();
		if(m.toString().length<2) m = "0"+m;
		if(da.toString().length<2) da = "0"+da;
		return y+''+m+''+da;
	}