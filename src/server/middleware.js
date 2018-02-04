import koaSend from 'koa-send';
import μs from 'microseconds';

export async function catcher(ctx, next) {
  try {
    await next();
  } catch (e) {
    ctx.throw(
      500,
      `There was an error. Please try again later.\n\n${e.message}`,
      ctx,
    );
  }
}

export async function responseTime(ctx, next) {
  const start = μs.now();
  await next();
  const end = μs.parse(μs.since(start));
  const total = end.microseconds + end.milliseconds * 1e3 + end.seconds * 1e6;
  ctx.set('Response-Time', `${total / 1e3}ms`);
}

export async function statics(ctx, next) {
  if (/\.(ico|png|svg|css|js|json)$/.test(ctx.path)) {
    try {
      await koaSend(ctx, ctx.path, { root: `${process.cwd()}/public` });
    } catch (e) {
      /**/
    }
  } else await next();
}
