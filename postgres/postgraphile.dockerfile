FROM graphile/postgraphile

WORKDIR /postgraphile/
RUN yarn add @graphile-contrib/pg-simplify-inflector
