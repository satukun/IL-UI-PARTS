var yousuke = yousuke || {};

yousuke.common = function() {
    $(function() {
        $.getJSON('js/faq.json')
            .done(function(data) {
                var url = window.location.href;
                console.log(url);
                if (url.indexOf("answer.html") != -1) {
                    var category = "",
                        ques = "";
                    var hash = url.slice(1).split('?');
                    hash = hash[1].split('&');
                    category = hash[0].split('=');
                    ques = hash[1].split('=');
                    console.log(ques);
                    var test = eval("data.faqlist[0]." + category[1]);
                    $('h1').append(test.name);
                    $('span').append(test.lists[ques[1]].q);
                } else {
                    if (data) {
                        jQuery.each(data.faqlist[0], function(cate, val) {
                            console.log(cate);
                            $('#ques').append(val.name);
                            $(val.lists).each(function(i) {
                                $('#ques').append('<p><a href="answer.html?category=' + cate + '&ques=' + i + '">' + $(this)[0].q + '</a></p>');
                            });
                        });
                    } else {
                        console.log("error.....");
                    }
                }
            });
    });
}


yousuke.common();