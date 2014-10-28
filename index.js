'use strict';

var joi = require('joi');

var strategySchema = joi.object().keys({
  name: joi.string().required(),
  scheme: joi.string().required(),
  mode: joi.alternatives(joi.boolean(), joi.string()),
  options: joi.object()
});

var optionsSchema = joi.object().keys({
  plugins: joi.alternatives(joi.object(), joi.array()),
  strategy: strategySchema,
  strategies: joi.array(strategySchema)
});

function strategy(plugin, strategies){
  strategies.forEach(function(strategy){
    if(strategy.mode != null){
      plugin.auth.strategy(strategy.name, strategy.scheme, strategy.mode, strategy.options);
    } else {
      plugin.auth.strategy(strategy.name, strategy.scheme, strategy.options);
    }
  });
}

function register(plugin, options, next){
  joi.assert(options, optionsSchema);

  var strategies = options.strategy ? [options.strategy] : options.strategies;

  if(!options.plugins){
    strategy(plugin, strategies);
    return next();
  }

  plugin.register(options.plugins, function(err){
    if(err){
      return next(err);
    }

    strategy(plugin, strategies);
    next();
  });
}

register.attributes = {
  pkg: require('./package.json')
};

module.exports = {
  register: register
};
