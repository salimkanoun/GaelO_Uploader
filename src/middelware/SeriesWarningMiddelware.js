const seriesWaringMiddleWare = store => next => action => {
    console.log("Middleware triggered:", action);
    console.log(store.getState())
    next(action)
    console.log(store.getState())
    //store.dispatch()
  }

export default seriesWaringMiddleWare