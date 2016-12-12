
const index = async (ctx, _next) => {
  ctx.body = { 'message': 'welcome to koa2!' };
};

export default {
  index
};

