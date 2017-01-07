var docomofaq = docomofaq || {};
var CategoryName = '',
    Title = '',
    Name = '',
    Url = document.location.href,
    Hash = '',
    faq = {};

docomofaq.get = function() {
    $(function() {
        $.getJSON('js/faq.json')
            .done(function(data) {
                // docomofaq.Count(data);
                if (Url.indexOf('answer.html') != -1) {
                    docomofaq.Extraction(data, Url);
                } else {
                    docomofaq.CategoryName(data);
                }
            });
    });
}

docomofaq.Count = function(data) {
    console.log(data.faqlist);
    console.log(data.faqlist[0].ContentsTitle.length);
    console.log(data.faqlist[1].ContentsTitle.length);
}

docomofaq.CategoryName = function(data) {
    $(data.faqlist).each(function(i) {
        faq.CategoryName = i;
        $('#ques').append('<h1>' + [i + 1] + data.faqlist[i].CategoryName + '</h1><dl></dl>');
        docomofaq.Title(data.faqlist, i);
    });
}

docomofaq.Title = function(data, count) {
    $(data[count].ContentsTitle).each(function(v) {
        faq.Title = v;
        $('dl').eq(count).append('<dt>' + [count + 1] + '-' + [v + 1] + ' ' + data[count].ContentsTitle[v].Title + '</dt>');
        docomofaq.Name(data[count].ContentsTitle[v], count);
    });
}

docomofaq.Name = function(data, count) {
    $(data.Link).each(function(x) {
        faq.Name = x;
        $('dl').eq(count).append('<dd><a href="answer.html?CategoryName=' + faq.CategoryName + '&Title=' + faq.Title + '&Name=' + faq.Name + '">' + data.Link[x].Name + '</a></dd>');
    });
}

docomofaq.Extraction = function(data, Url) {

    Hash = Url.slice(1).split('?');
    Hash = Hash[1].split('&');
    faq = {
        CategoryName: Hash[0].split('=')[1],
        Title: Hash[1].split('=')[1],
        Name: Hash[2].split('=')[1]
    }
    docomofaq.Render(data);
};


docomofaq.Render = function(data) {
    if (data.faqlist[faq.CategoryName].ContentsTitle[faq.Title].Link[faq.Name].Name) {
        $('h2').append(data.faqlist[faq.CategoryName].CategoryName);
        $('h3').append(data.faqlist[faq.CategoryName].ContentsTitle[faq.Title].Title);
        $('h4').append(data.faqlist[faq.CategoryName].ContentsTitle[faq.Title].Link[faq.Name].Name);
        $('.l-main').append(data.faqlist[faq.CategoryName].ContentsTitle[faq.Title].Link[faq.Name].Contents);
    } else {
        location.href = "index.html";
    }
    docomofaq.Page(data);
};

docomofaq.Page = function(data) {
    var MaxLlist = data.faqlist.length;
    var MaxMlist = data.faqlist[faq.CategoryName].ContentsTitle.length;
    var MaxSlist = data.faqlist[faq.CategoryName].ContentsTitle[faq.Title].Link.length;

    if (MaxSlist - 1 == parseInt(faq.Name)) {
        faq.Name = 0;
        if (MaxMlist - 1 == parseInt(faq.Title)) {
            faq.Title = 0;
            if (MaxLlist - 1 == parseInt(faq.CategoryName)) {
                faq.CategoryName = 0;
            } else {
                faq.CategoryName = parseInt(faq.CategoryName) + 1;
            }
        } else {
            faq.Title = parseInt(faq.Title) + 1;
        }
    } else {
        faq.Name = parseInt(faq.Name) + 1;
    }
    $("#prev").attr("href", 'answer.html?CategoryName=' + faq.CategoryName + '&Title=' + parseInt(faq.Title) + '&Name=' + (parseInt(faq.Name - 1)));
    $("#next").attr("href", 'answer.html?CategoryName=' + faq.CategoryName + '&Title=' + parseInt(faq.Title) + '&Name=' + parseInt(faq.Name));

};


docomofaq.get();