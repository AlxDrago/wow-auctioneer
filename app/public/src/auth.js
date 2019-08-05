function Auth() {
    this.param = {
        clientId:'',
        redirect:'',
        code: '',
        realm: '',
        clientSecret: '',
        accessToken: '',
        dataAuc: '',
    }
}

/**
 * Инициализация
 */
Auth.prototype.init = function () {
    const $this = this;
    $('#step1').on('click', function () {
        $this.getCode();
    });

    $('#step2').on('click', function () {
        $this.getAuth();
    });

    $('#step3').on('click', function () {
        $this.getAucDump();
    });

    // $('#startDump').on('click', function () {
        $this.getAucDataDump();
    // });
};

/**
 * Получение кода авторизации
 */
Auth.prototype.getCode = function() {
    let $this = this.param;
    window.location.href ='https://eu.battle.net/oauth/authorize?' +
        '&client_id=' + $this.clientId +
        '&scope=wow.profile' +
        '&state=test' +
        '&redirect_uri=' + $this.redirect +
        '&response_type=code' +
        '&grant_type=client_credentials';
};

/**
 * Получение токена авторизации
 */
Auth.prototype.getAuth = function() {
    let $this = this.param;
    let err = 0;
    if(window.location.href.search(/code=/) !== -1) {
        let spl1 = window.location.href.split('code=');
        $this.code = (spl1[1].split('&'))[0];
        M.toast({html: 'get code => success'});
    } else {
        err += 1;
        M.toast({html: 'get code => error'});
    }

    if(err <= 0) {
        $.ajax({
            type: 'POST',
            url: 'https://eu.battle.net/oauth/token?' +
                'grant_type=authorization_code' +
                '&code=' + $this.code +
                '&redirect_uri=' + $this.redirect +
                '&client_id=' + $this.clientId +
                '&client_secret=' + $this.clientSecret +
                '&client_id=' + $this.clientId,
            success: function (data) {
                // console.log(data);
                $this.accessToken = data.access_token;
                M.toast({html: 'get access token => success'});
                // console.log('get access token => success');
            },
            error: function () {
                M.toast({html: 'get access token => error'});
                // console.log('get access token => error');
            }
        })
    } else {
        M.toast({html: 'get access token => error'});
        // console.log('get access token => error');
    }
};

/**
 * Получение ссылки аукциона
 */
Auth.prototype.getAucDump = function () {
    $this = this.param;
    $.ajax({
        type: 'POST',
        async: false,
        data: {'token': this.param.accessToken},
        url: '../engine/getauth.php',
        complete: function (data) {
            if (data.responseText !== '') {
                let response = JSON.parse(data.responseText);
                $this.dataAuc = response.files[0];
                M.toast({html: 'get aucUrl => success'});
                // console.log('get aucUrl=> success');
            } else {
                M.toast({html: 'get aucUrl => error'});
                // console.log('get aucUrl => error');
            }
        }
    });
    let date = new Date(this.param.dataAuc.lastModified);
    this.getAucData(date);

    // this.render('#dataDump', date);
};

/**
 * Получение БД аукциона
 */
Auth.prototype.getAucData = function(date) {
  let $this = this;

  $.ajax({
      type: 'POST',
      data: {'url': $this.param.dataAuc.url, 'date': date},
      url: '../engine/getaucdata.php',
      complete: function (data) {
          // let response =JSON.parse(data.responseText);
          M.toast({html: 'get aucData => success'});

          // $this.findData(response.auctions);
      }
  })
};

/**
 * Получение БД аукциона из дампа
 */
Auth.prototype.getAucDataDump = function() {
    let $this = this;

    $.ajax({
        type: 'POST',
        url: '../engine/getaucdatadump.php',
        complete: function (data) {
            let response =JSON.parse(data.responseText);
            let responseAuc = JSON.parse(response[0]);
            M.toast({html: 'get aucDataDump => success'});
            $('#preloader').attr('hidden', true);
            $this.render('#dataDump', response[1]);
            $this.findData(responseAuc.auctions);
        }
    })
};

/**
 * Метода обработки данных аукциона
 * @param getData
 */
Auth.prototype.findData = function(getData) {
    let data = new Data(getData);
    data.init();
};

/**
 * Метод очистки поля рецептов
 */
Auth.prototype.renderClear = function() {
    M.toast({html: 'Очистка всех рецептов'});
    $('#aucData').children().remove();
};

/**
 * Метод рендера
 * @param div
 * @param text
 */
Auth.prototype.render = function(div, text) {
    if(Array.isArray(text) === false) {
        $('<p/>',{
            text: text,
        }).appendTo($(div));
    } else {

        let row = $('#aucData');
        let div0 = $('<div/>', {
            class: 'col s12 m6 l4',
        }).appendTo(row);

        let div1 = $('<div>', {
            class: 'card ' + text[4] + ' lighten-3',
            style: 'height: 170px'
        }).appendTo(div0);

        let div2 = $('<div/>', {
            class: 'card-content',
        }).appendTo(div1);

        $('<span/>', {
            class: 'card-title',
            text: text[0]
        }).appendTo(div2);

        $('<p/>', {
            text: 'Цена предмета: ' + text[1],
        }).appendTo(div2);

        // for(i = 0; i < text.length; i++) {
        //     $('<p/>', {
        //         text: 'Цена Ингредиента' + (i + 1) + ': price',
        //     }).appendTo(div2);
        // }

        $('<p/>', {
            text: 'Сумма Ингредиентов: ' + text[2],
        }).appendTo(div2);

        $('<p/>', {
            text: 'Проффит: ' + text[3],
        }).appendTo(div2);
    }
};

let auth = new Auth();
auth.init();