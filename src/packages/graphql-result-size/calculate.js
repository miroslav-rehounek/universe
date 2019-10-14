// @flow strict

import {
  Kind,
  isExecutableDefinitionNode,
  isListType,
  isObjectType,
  type GraphQLSchema,
  type DocumentNode,
} from 'graphql';

const THRESHOLD = 500_000;

const UNLIMITED_LIST_PENALTY = 10_000;
const UNKNOWN_KIND_PENALTY = 100_000;

/**
 * Please note: we actually don't do any kind of optimizations yet as described in the paper.
 * It's because the priority is to make it work well first. Moreover, these optimizations made
 * the referential implementation horribly slow which is paradoxical.
 */
export default function calculate(schema: GraphQLSchema, query: DocumentNode) {
  let score = 0;

  function analyzeSubquery(definition, objectType) {
    if (score > THRESHOLD) {
      throw new Error(`Threshold of ${THRESHOLD} reached.`);
    }

    if (definition == null || objectType == null) {
      return;
    }

    if (definition.kind === Kind.FIELD && isObjectType(objectType)) {
      if (isIntrospectionField(definition.name.value)) {
        return;
      }
      const fields = objectType.getFields();
      const fieldType = fields[definition.name.value].type;
      const currentType = isListType(fieldType) ? fieldType.ofType : fieldType;
      if (definition.selectionSet === undefined) {
        if (isListType(fieldType)) {
          score += 4; // aaa: [ 1, 2 ]
          const numberOfEdges = getNumberOfEdges(definition);
          for (let i = 0; i < numberOfEdges; i++) {
            score += 1; // add +1 per each scalar iteration
          }
        } else {
          score += 3; // aaa: xxx
        }
      } else if (isListType(fieldType)) {
        score += 4; // aaa: [ { ... } ]
        const numberOfEdges = getNumberOfEdges(definition);
        for (let i = 0; i < numberOfEdges; i++) {
          score += 2; // add +1 per each object iteration for the braces
          analyzeSubquery(definition.selectionSet, currentType);
        }
      } else {
        score += 4; // field with other subselections
        analyzeSubquery(definition.selectionSet, currentType);
      }
    } else if (definition.kind === Kind.SELECTION_SET) {
      definition.selections.forEach(selection => {
        analyzeSubquery(selection, objectType);
      });
    } else if (definition.kind === Kind.OPERATION_DEFINITION) {
      analyzeSubquery(definition.selectionSet, objectType);
    } else if (definition.kind === Kind.INLINE_FRAGMENT) {
      analyzeSubquery(definition.selectionSet, objectType);
    } else if (definition.kind === Kind.FRAGMENT_DEFINITION) {
      const onType = definition.typeCondition.name.value;
      analyzeSubquery(definition.selectionSet, schema.getType(onType));
    } else if (definition.kind === Kind.FRAGMENT_SPREAD) {
      // no score change
    } else {
      // we do not support this definition kind yet
      score += UNKNOWN_KIND_PENALTY;
    }
  }

  query.definitions.map(definition => {
    if (isExecutableDefinitionNode(definition)) {
      if (definition.kind === Kind.FRAGMENT_DEFINITION) {
        return analyzeSubquery(definition, schema.getQueryType()); // FragmentDefinition
      }
      switch (definition.operation) {
        case 'query':
          return analyzeSubquery(definition, schema.getQueryType());
        case 'mutation':
          return analyzeSubquery(definition, schema.getMutationType());
        case 'subscription':
          return analyzeSubquery(definition, schema.getSubscriptionType());
        default:
          (definition.operation: empty);
      }
    }
    return undefined;
  });

  return score;
}

/**
 * We try to find argument `first` or `last` and use it here - otherwise we apply penalty for
 * missing first/last argument instead.
 */
function getNumberOfEdges(definition) {
  let first = UNLIMITED_LIST_PENALTY;
  if (definition.arguments != null && definition.arguments.length > 0) {
    const argumentNode = definition.arguments.find(argument => {
      return argument.name.value === 'first' || argument.name.value === 'last';
    });
    if (argumentNode !== undefined && argumentNode.value.kind === 'IntValue') {
      first = Number(argumentNode.value.value);
    }
  }
  return first;
}

function isIntrospectionField(name: string): boolean {
  // This copies GraphQL implementation:
  // https://github.com/graphql/graphql-js/blob/48ea2d3e8df5e4fbbdb5e0ce67c0a3c219b024f8/src/utilities/assertValidName.js#L29
  return name.length > 1 && name[0] === '_' && name[1] === '_';
}
