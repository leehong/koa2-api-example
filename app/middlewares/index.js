import helpers from '../helpers';

async function catchError(ctx, next) {
  try {
    await next();
    if (ctx.status === 404) ctx.throw(404);
  } catch(err) {
    let status = err.status || 500;
    // let message = e.message || 'Server Error!'
    ctx.status = status;
    ctx.state = {
      status: status,
      helpers: helpers,
      currentUser: null
    };
    
    ctx.body = {error: 'not found' };
    if (status == 500) {
      console.log('server error', err, ctx);
    }
  }
}

export default {
  catchError
};
