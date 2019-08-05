function AddRecipes() {
    this.param = {
        itemNum : 1,
    }
}

AddRecipes.prototype.init = function() {
    const $this = this;
    $('#addInputRec').on('click', function () {
        $this.addField();
    });

    $('#delInputRec').on('click', function () {
        $this.delField();
    });

    $('#sendBtn').on('click', function () {
        $this.sendRec();
    })
};

AddRecipes.prototype.addField = function() {
    if(this.param.itemNum < 7) {
        let row = $('<div/>', {
            id: 'input' + this.param.itemNum,
            class: 'row'
        }).appendTo($('#form'));

        let div0 = $('<div/>', {
            class: 'input-field col s6',
        }).appendTo(row);

        $('<input>', {
            id: 'item' + this.param.itemNum,
            name: 'item' + this.param.itemNum,
            type: 'text',
            class: 'validate',
        }).appendTo(div0);

        $('<label/>', {
            for: 'item' + this.param.itemNum,
            text: 'item' + this.param.itemNum,
        }).appendTo(div0);

        this.param.itemNum += 1;
    } else {
        M.toast({html: 'err: максимальное количество ингредиентов!'});
    }
};

AddRecipes.prototype.delField = function () {
    if(this.param.itemNum > 1 ) {
        this.param.itemNum -= 1;
        $('#input' + this.param.itemNum).remove();
    } else {
        M.toast({html: 'err: Один ингредиент должен присутствовать!'});
    }
};

AddRecipes.prototype.sendRec =function() {
    let msg = $('#form').serialize();
    $.post({
        data: msg + '&number=' + this.param.itemNum,
        url:'../engine/sendRecipes.php',
        success: function (data) {
            $('input').val('')
        },
        error: function () {
            M.toast({html: 'send Recipes -> error'});
        }
    })
};

let addrec = new AddRecipes();
addrec.init();