
// Budget Controller
var budgetController = (function(){
    var Income, Expense, data;

    // Income Function Controller
    Income = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    Expense = function(id, description, value){
        this.id = id;
        this.description = description;
        this.value = value;
    }

    data = {
        allItems:{
            inc: [],
            exp: []
        },
        totals: {
            inc: 0,
            exp: 0
        }
    };

    return {
        addItem: function(type, desc, value){
            var ID, newItem;

            // Create a New ID
            if (data.allItems[type].length>0){
                ID = data.allItems[type][data.allItems[type].length-1].id+1;
            }else{
                ID =0;
            }

            // Create a New Item
            if(type === 'inc'){
                newItem = new Income(ID, desc, value);
            }else if(type === 'exp'){
                newItem = new Expense(ID, desc, value);
            }

            data.allItems[type].push(newItem);

            return newItem;
        }
    }

})();





// UI Controller
var UIController = (function(){
    var DOMstrings, type, description, value;

    DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
        incomeContainer: '.income__list',
        expenseContainer: '.expense__list'
    };

    return{
        getDOMStrings: function(){
            return DOMstrings;
        },

        getInputs: function(){
            return{
                type: document.querySelector(DOMstrings.inputType).value, // inc or exp
                description: document.querySelector(DOMstrings.inputDescription).value,
                value: document.querySelector(DOMstrings.inputValue).value
            };
        },

        addListItem: function(obj, type){
            var html, newHtml;

            // Create HTML string with placeholder text
            
            if(type === 'inc'){
                element = DOMstrings.incomeContainer;
                html = '<div class="item" id="income-%id%"><div class="item__description">%description%</div><div class="item__valuebox"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
            }else if(type === 'exp'){
                element = DOMstrings.expenseContainer;
                html = '<div class="item" id="expense-%id%"><div class="item__description">%description%</div><div class="item__valuebox"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="far fa-times-circle"></i></button></div></div></div>';
            }
            
            // Replace the placeholder text with actual data values
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // Insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        }
    }

})();



// Global Controller
var Controller = (function(budgetCtrl, UICtrl){
    var inputs, DOM;

    var setupEventListeners = function(){
        DOM = UICtrl.getDOMStrings();

        document.querySelector(DOM.inputButton).addEventListener('click',controller_add_item);
    
        document.addEventListener('keypress', function(e){
            if (e.keyCode === 13){
                controller_add_item();
            }
        });
    }

    var controller_add_item = function(){
       
        // Get input data 
        inputs = UICtrl.getInputs();

        // Add item to the Budget Controller
        newItem = budgetCtrl.addItem(inputs.type, inputs.description, inputs.value);

        // Update UI
        UICtrl.addListItem(newItem, inputs.type);
    }
    
   return{
       init: function(){
           setupEventListeners();
       }
   }



})(budgetController, UIController);

// Call the Initializer
Controller.init();