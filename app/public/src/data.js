/**
 * Класс обработки данных
 * @param data
 * @constructor
 */
function Data(data) {
    this.data = {
        inputData: data,
        outputData: [],
    };

    this.recipes;
    this.loop = 0;
}

/**
 * Инициализация
 */
Data.prototype.init = function () {
    const $this = this;

    $('#testRecipes').on('click', function () {
        let msg = $('#prof').serialize();
        $.post({
            url: '../engine/getRecipes.php',
            data: msg,
            async: false,
            success: function (data) {
                M.toast({html: 'get recipes => success'});
                $this.recipes =  JSON.parse(data);
            }
        });
        // console.log($this.recipes);
        let clear = new Auth();
        clear.renderClear();
        $this.loopRecipes();
    });
};

/**
 * Обход всех итемов в рецепте
 */
Data.prototype.loopRecipes = function () {
    this.getPrice(this.recipes[this.loop].id_recipes);
    this.getPrice(this.recipes[this.loop].item0);
    this.getPrice(this.recipes[this.loop].item1);
    this.getPrice(this.recipes[this.loop].item2);
    this.getPrice(this.recipes[this.loop].item3);
    this.getPrice(this.recipes[this.loop].item4);
    this.getPrice(this.recipes[this.loop].item5);
    this.getPrice(this.recipes[this.loop].item6);

    this.checkSumm();
};

/**
 * Проверка профита и запуск рендера
 */
Data.prototype.checkSumm = function() {
    let proffit = 0;
    let summIng = 0;
    for(i = 0; i < this.data.outputData.length; i++) {
        if(i !== 0) {
            summIng += this.data.outputData[i];
        }
    }

    proffit = (this.data.outputData[0] - summIng).toFixed(2);

    let render = new Auth();
    render.render('#aucData', [
        this.recipes[this.loop].name_recipes,
        this.data.outputData[0].toFixed(2),
        summIng.toFixed(2),
        proffit,
        proffit > 0 ? 'green' : 'red'
    ]);

    this.loop++;
    this.data.outputData = [];
    if(this.loop < this.recipes.length) {
        this.loopRecipes();
    } else {
        this.loop = 0;
        M.toast({html: 'Все рецепты проверены'});
    }
};

/**
 * Получение самой низкой стоимости
 * @param itemId
 * @returns {number}
 */
Data.prototype.getPrice = function(itemId) {
    itemId = itemId.toString();
    let quantity = 1;
    if(itemId === '') {
        return;
    }
    if(itemId.search(/_/gi) !== -1) {
        let temp = itemId.split('_');
        itemId = temp[0];
        quantity = temp[1];
    }
    let arr = [];
    let tempVar;

    for(i=0; i<this.data.inputData.length; i++) {
        if(this.data.inputData[i].item === parseInt(itemId)) {
            arr.push(this.data.inputData[i]);
        }
    }

    arr.forEach(function (item, index, arr) {
        if(index === 0) {
            tempVar = arr[index];
        } else {
            if((arr[index].buyout !== 0) && ((tempVar.buyout / tempVar.quantity) > (arr[index].buyout / arr[index].quantity))) {
                tempVar = arr[index];
            }
        }
    });

    if(tempVar === undefined) {
        this.data.outputData.push(0);
    } else {
        this.data.outputData.push(((tempVar.buyout / tempVar.quantity) * quantity) / 10000);
        // console.log(this.data.outputData);
    }
};
