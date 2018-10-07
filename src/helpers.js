/*
module.exports = {
  ifeq: function(a, b, options){
    if (a === b) {
      return options.fn(this);
      }
    return options.inverse(this);
  },
  bar: function(){
    return "BAR!";
  }
}
*/



var register = function(Handlebars) 
{
    var helpers = 
        {
          // put all of your helpers inside this object

          ifeq: function(a, b, opts) 
          {
            if(a === b) // Or === depending on your needs
                return opts.fn(this);
            else
                return opts.inverse(this);
          },  
          ifneq: function(a, b, opts) 
          {
            if(a === b) // Or === depending on your needs
                return opts.inverse(this);
            else
                return opts.fn(this);

          },

          /*
          colorbutton: function(a, opts) 
          {
            if(a === "Y") // Or === depending on your needs
                return {colorresult : "btn-success"};
            else
                return {colorresult : "btn btn-danger"};
          }, */            
          foo: function(){
              return "FOO";
          },
          bar: function(){
              return "BAR";
          }
        };

        if (Handlebars && typeof Handlebars.registerHelper === "function") 
        {
          // register helpers
          for (var prop in helpers) 
          {
              Handlebars.registerHelper(prop, helpers[prop]);
          }
        } 
        else 
        {
            // just return helpers object if we can't register helpers here
            return helpers;
        }

};

module.exports.register = register;
module.exports.helpers = register(null);

