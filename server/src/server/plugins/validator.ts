import { FastifySchemaCompiler, FastifySchema } from 'fastify';
import Ajv, { JSONSchemaType } from 'ajv';
import addFormats from 'ajv-formats';

const ajv = new Ajv({
  removeAdditional: false,
  useDefaults: true,
  coerceTypes: true,
  allErrors: true
});

addFormats(ajv);

export const validatorCompiler: FastifySchemaCompiler<FastifySchema> = ({ schema }) => {
  return ajv.compile(schema as JSONSchemaType<unknown>);
};