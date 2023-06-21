import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const ExtractToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    return token;
  },
);

export const ExtractDataFromToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const token = request.headers.authorization.split(' ')[1];
    const extractDataFromTonek = JSON.parse(
      Buffer.from(token.split('.')[1], 'base64').toString(),
    ) as { id: number };

    return extractDataFromTonek;
  },
);
