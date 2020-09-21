// Budget Controller
var budgetController = (function(){

    var Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var CalculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum+= cur.value;
        });
        data.totals[type] = sum;
    }

    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        },
        budget: 0,
        percentage: -1
    };

    return {
        addItem: function(type, desc, val){
            var ID, newItem;

            // Create New ID
            if(data.allItems[type].length >0){
                ID = data.allItems[type][data.allItems[type].length-1].id + 1;
            }else{
                ID = 0;
            }

            // Create New Items based on 'inc' or 'exp'
            if(type=== 'exp'){
                newItem = new Expense(ID, desc, val);
            }else if(type === "inc"){
                newItem = new Income(ID, desc, val);
            };

            data.allItems[type].push(newItem);
            return newItem;
        },
        calculateBudget: function(){
            // Calculate total income and expense
            CalculateTotal('exp');
            CalculateTotal('inc');

            // Calculate the budget: Income - Expense
            data.budget = data.totals.inc - data.totals.exp;

            // Calculate the percentage of income that we spent
            if(data.totals.inc>0){
                data.percentage = Math.round((data.totals.exp/data.totals.inc)*100);
            }else{
                data.percentage = -1;
            }
            
        },
        getBudget: function(){
            return{
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        testing: function(){
            console.log(data);
        }
    };

})();



// UI Controller
var UIController = (function(){

    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expense__list',
        budgetLabel: '.budget__value',
        expenseLabel: '.budget__expenses--value',
        incomeLabel: '.budget__income--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'

    }

    return {
        getInput: function(){
            return{
                type : document.querySelector(DOMstrings.inputType).value, // inc or exp
                description : document.querySelector(DOMstrings.inputDescription).value,
                value : parseFloat(document.querySelector(DOMstrings.inputValue).value)
            };   
        },

        getDOMstrings : function(){
            return DOMstrings;
        },

        addListItem: function(obj, type){
            var html, newHtml;

            // Create HTML string with placeholder text
            
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item" id="inc-%id%"><div class="item__description">%description%</div><div class="item__valuebox"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item" id="exp-%id%"><div class="item__description">%description%</div><div class="item__valuebox"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
            }
            
            // Replace the placeholder text with actual data values
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFields: function(){
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMstrings.inputDescription +', '+DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current, index, array){
                current.value = "";
            });

            fieldsArr[0].focus();
        },

        displayBudget: function(obj){
            document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMstrings.expenseLabel).textContent = obj.totalExp;

            if(obj.percentage>0){
                document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage+'%';
            }else{
                document.querySelector(DOMstrings.percentageLabel).textContent = '---';
            }   
            
        }
    };

})();

// Global Controller
var controller = (function(budgetCtrl, UICtrl){

    var setupEventListeners = function(){

        var DOM = UICtrl.getDOMstrings();

        document.querySelector(DOM.inputButton).addEventListener('click', controller_add_item);

        document.addEventListener('keypress', function(event){
            if(event.keyCode === 13 ){
                controller_add_item();
            }
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        
    };

    var updateBudget = function(){
        // Calculate the Budget
        budgetCtrl.calculateBudget();

        // Return the Budget
        var budget = budgetCtrl.getBudget();

        // Display the Budget
        UICtrl.displayBudget(budget);

    };

    var controller_add_item = function(){

        var input, newItem;

        // Get Input Data
        input = UICtrl.getInput();

        if(input.description!=="" && input.value >0 && !isNaN(input.value)){
             // Add item to the Budget Controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // Update UI with the item
            UICtrl.addListItem(newItem, input.type);

            // Clear the Fields
            UICtrl.clearFields();
            
            // Calculate and update budget
            updateBudget();
        }
    };

    var ctrlDeleteItem = function(event){
        var itemID;

        itemID = console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);
        
        if(itemID){
            
        }
        
    
    };

    return {
        init: function(){
            UICtrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    };

})(budgetController, UIController);

// Call the initializer
controller.init();